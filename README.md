# 🚀 SkillPath AI — Career Navigator & Skill Gap Analyzer

**An AI-powered career guidance platform that helps students discover skill gaps and build personalized learning roadmaps.**

## 📌 Project Overview

SkillPath AI helps students prepare for their dream careers by comparing their existing skills with the skills required for a target role. It identifies missing skills, recommends learning resources and projects, and provides a structured roadmap to improve career readiness.

By leveraging **Neo4j's graph database**, SkillPath AI models relationships between career roles, skills, courses, and projects to make learning paths more structured and understandable.

## ✨ Key Features

- 🎯 **Career Role Selection:** Choose a target career.
- 🧠 **Skill Gap Analysis:** Identify skills you already have and skills you need to develop.
- 🗺️ **Personalized Learning Roadmap:** Discover a recommended sequence for learning new skills.
- 📚 **Learning Recommendations:** Explore relevant courses and hands-on projects.
- 🔗 **Skill Dependency Mapping:** Understand prerequisites and relationships between skills.
- ⚡ **Interactive Web Interface:** Analyze your career readiness through a user-friendly interface.

## 🕸️ Neo4j Usage

Neo4j serves as the graph database for connecting career roles, skills, courses, and projects.

### Graph Relationships

- `REQUIRES_SKILL` — Connects career roles to required skills.
- `HAS_SKILL` — Represents skills associated with a user.
- `PREREQUISITE_OF` — Defines dependencies between skills.
- `TEACHES` — Connects courses to the skills they teach.
- `DEVELOPS` — Connects projects to the skills they develop.

### Example Learning Path

**Python + Statistics → Machine Learning → Deep Learning**

This graph-based approach helps identify missing skills and organize learning recommendations according to skill dependencies.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend user interface |
| Python | Backend logic |
| FastAPI | Backend API |
| Neo4j AuraDB | Graph database |
| Cypher | Graph queries |
| GitHub | Version control and collaboration |

## 🔄 How It Works

1. Select a target career role.
2. Enter your existing skills.
3. Analyze your skills against the role's requirements.
4. Identify missing skills and prerequisites.
5. Follow the recommended learning roadmap.
6. Explore relevant courses and projects.

## 🎯 Goal

To make career preparation more personalized, structured, and accessible by helping students understand what to learn next and how each skill contributes to their career goals.

## 👥 Team

Built collaboratively by **Team SkillPath AI** for the Neo4j Graph Builder Build Sprint.

## 🌱 Future Enhancements

- AI-generated career roadmaps.
- Interactive graph visualization.
- Personalized course recommendations.
- Progress tracking and skill assessments.
- Support for additional career roles and learning resources.

---

**SkillPath AI — Know your gaps. Build your path. Shape your future.**
