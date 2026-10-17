from app.database import get_neo4j_driver


def seed_career_graph():
    """Create the initial AI Engineer career graph without duplicating data."""
    driver = get_neo4j_driver()

    try:
        with driver.session(database="neo4j") as session:
            # Create the target career role.
            session.run(
                """
                MERGE (role:CareerRole {name: $name})
                SET role.description = $description
                """,
                name="AI Engineer",
                description="Builds AI-powered systems and machine learning applications.",
            )

            # Create the learner and their current skills.
            session.run(
                """
                MERGE (learner:Learner {id: $learner_id})
                SET learner.name = $name
                WITH learner
                UNWIND $skills AS skill_name
                MERGE (skill:Skill {name: skill_name})
                MERGE (learner)-[:HAS_SKILL]->(skill)
                """,
                learner_id="demo-learner",
                name="Demo Learner",
                skills=["Python", "SQL"],
            )

            # Create the skills required for the target role.
            session.run(
                """
                MATCH (role:CareerRole {name: $role_name})
                UNWIND $skills AS skill_name
                MERGE (skill:Skill {name: skill_name})
                MERGE (role)-[:REQUIRES_SKILL]->(skill)
                """,
                role_name="AI Engineer",
                skills=[
                    "Python",
                    "SQL",
                    "Machine Learning",
                    "Statistics",
                    "Deep Learning",
                ],
            )

            # Define prerequisite relationships.
            session.run(
                """
                UNWIND $prerequisites AS item
                MATCH (prerequisite:Skill {name: item.prerequisite})
                MATCH (advanced:Skill {name: item.advanced})
                MERGE (prerequisite)-[:PREREQUISITE_OF]->(advanced)
                """,
                prerequisites=[
                    {
                        "prerequisite": "Python",
                        "advanced": "Machine Learning",
                    },
                    {
                        "prerequisite": "Statistics",
                        "advanced": "Machine Learning",
                    },
                    {
                        "prerequisite": "Machine Learning",
                        "advanced": "Deep Learning",
                    },
                ],
            )

            # Create courses and connect them to the skills they teach.
            session.run(
                """
                UNWIND $courses AS item
                MERGE (course:Course {title: item.title})
                SET course.url = item.url
                WITH course, item
                MATCH (skill:Skill {name: item.skill})
                MERGE (course)-[:TEACHES]->(skill)
                """,
                courses=[
                    {
                        "title": "Python Fundamentals",
                        "url": "https://docs.python.org/3/tutorial/",
                        "skill": "Python",
                    },
                    {
                        "title": "SQL Tutorial",
                        "url": "https://www.w3schools.com/sql/",
                        "skill": "SQL",
                    },
                    {
                        "title": "Machine Learning",
                        "url": "https://scikit-learn.org/stable/tutorial/index.html",
                        "skill": "Machine Learning",
                    },
                    {
                        "title": "Statistics Fundamentals",
                        "url": "https://www.khanacademy.org/math/statistics-probability",
                        "skill": "Statistics",
                    },
                    {
                        "title": "Deep Learning Tutorial",
                        "url": "https://www.tensorflow.org/tutorials",
                        "skill": "Deep Learning",
                    },
                ],
            )

            # Create projects and connect them to the skills they develop.
            session.run(
                """
                UNWIND $projects AS item
                MERGE (project:Project {name: item.name})
                SET project.description = item.description
                WITH project, item
                MATCH (skill:Skill {name: item.skill})
                MERGE (project)-[:DEVELOPS]->(skill)
                """,
                projects=[
                    {
                        "name": "Exploratory Data Analysis",
                        "description": "Explore a dataset and communicate insights using Python.",
                        "skill": "Python",
                    },
                    {
                        "name": "Predictive Modeling",
                        "description": "Train and evaluate a machine learning model.",
                        "skill": "Machine Learning",
                    },
                    {
                        "name": "Neural Network Classifier",
                        "description": "Build and evaluate a basic neural network.",
                        "skill": "Deep Learning",
                    },
                ],
            )

        print("Career graph seed completed successfully.")

    finally:
        driver.close()


if __name__ == "__main__":
    seed_career_graph()
