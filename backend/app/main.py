
from collections import defaultdict, deque
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.database import get_neo4j_driver


app = FastAPI(
    title="SkillPath AI API",
    description="Graph-powered career navigation and skill-gap analysis.",
    version="0.1.0",
)


class AnalyzeRequest(BaseModel):
    target_role: str = Field(min_length=1, max_length=100)
    skills: list[str] = Field(max_length=100)


class Recommendation(BaseModel):
    title: str
    type: Literal["course", "project"]
    reason: str


class AnalyzeResponse(BaseModel):
    target_role: str
    existing_skills: list[str]
    missing_skills: list[str]
    roadmap: list[str]
    recommendations: list[Recommendation]


def order_missing_skills(
    missing_skills: list[str],
    prerequisites: list[tuple[str, str]],
) -> list[str]:
    """Order missing skills using prerequisite edges when possible."""
    missing_set = set(missing_skills)
    adjacency: dict[str, set[str]] = defaultdict(set)
    indegree = {skill: 0 for skill in missing_set}

    for prerequisite, advanced in prerequisites:
        if (
            prerequisite in missing_set
            and advanced in missing_set
            and advanced not in adjacency[prerequisite]
        ):
            adjacency[prerequisite].add(advanced)
            indegree[advanced] += 1

    queue = deque(
        sorted(skill for skill, degree in indegree.items() if degree == 0)
    )
    ordered = []

    while queue:
        skill = queue.popleft()
        ordered.append(skill)

        for advanced in sorted(adjacency[skill]):
            indegree[advanced] -= 1
            if indegree[advanced] == 0:
                queue.append(advanced)

    # Preserve any skills involved in cycles rather than dropping them.
    ordered.extend(sorted(missing_set - set(ordered)))
    return ordered


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillPath AI API",
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_career(request: AnalyzeRequest):
    target_role = request.target_role.strip()
    supplied_skills = {
        skill.strip()
        for skill in request.skills
        if skill.strip()
    }

    if not target_role:
        raise HTTPException(status_code=422, detail="Target role cannot be blank.")

    if len(supplied_skills) > 100:
        raise HTTPException(
            status_code=422,
            detail="Provide no more than 100 distinct skills.",
        )

    driver = get_neo4j_driver()

    try:
        with driver.session(database="neo4j") as session:
            role_record = session.run(
                """
                MATCH (role:CareerRole {name: $role_name})
                      -[:REQUIRES_SKILL]->(skill:Skill)
                RETURN collect(skill.name) AS required_skills
                """,
                role_name=target_role,
            ).single()

            if role_record is None or not role_record["required_skills"]:
                raise HTTPException(
                    status_code=404,
                    detail=f"No required skills found for role '{target_role}'.",
                )

            required_skills = sorted(set(role_record["required_skills"]))
            existing_skills = sorted(
                supplied_skills.intersection(required_skills)
            )
            missing_skills = sorted(
                set(required_skills) - supplied_skills
            )

            prerequisite_records = session.run(
                """
                MATCH (prerequisite:Skill)-[:PREREQUISITE_OF]->(advanced:Skill)
                RETURN prerequisite.name AS prerequisite,
                       advanced.name AS advanced
                """
            )
            prerequisites = [
                (record["prerequisite"], record["advanced"])
                for record in prerequisite_records
            ]

            roadmap = order_missing_skills(
                missing_skills,
                prerequisites,
            )

            resource_records = session.run(
                """
                MATCH (resource)-[relationship]->(skill:Skill)
                WHERE (
                    resource:Course AND type(relationship) = 'TEACHES'
                ) OR (
                    resource:Project AND type(relationship) = 'DEVELOPS'
                )
                RETURN
                    CASE
                        WHEN resource:Course THEN resource.title
                        ELSE resource.name
                    END AS title,
                    CASE
                        WHEN resource:Course THEN 'course'
                        ELSE 'project'
                    END AS type,
                    skill.name AS skill
                """
            )

            recommendations = []
            seen_recommendations = set()

            for record in resource_records:
                title = record["title"]
                resource_type = record["type"]
                skill = record["skill"]

                if skill not in missing_skills:
                    continue

                key = (title, resource_type)
                if key in seen_recommendations:
                    continue

                seen_recommendations.add(key)
                recommendations.append(
                    Recommendation(
                        title=title,
                        type=resource_type,
                        reason=f"Helps develop the missing skill: {skill}.",
                    )
                )

            recommendations.sort(key=lambda item: (item.type, item.title))

            return AnalyzeResponse(
                target_role=target_role,
                existing_skills=existing_skills,
                missing_skills=missing_skills,
                roadmap=roadmap,
                recommendations=recommendations,
            )

    except HTTPException:
        raise
    except Exception as exc:
        # Avoid exposing credentials or internal database details to clients.
        raise HTTPException(
            status_code=503,
            detail="Career analysis is temporarily unavailable.",
        ) from exc
    finally:
        driver.close()
