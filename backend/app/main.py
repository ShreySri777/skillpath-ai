from fastapi import FastAPI

app = FastAPI(
    title="SkillPath AI API",
    description="Graph-powered career navigation and skill-gap analysis.",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillPath AI API",
    }