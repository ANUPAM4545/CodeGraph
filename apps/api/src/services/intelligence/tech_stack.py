from typing import List, Dict, Any, Tuple
from .dto import TechStackItemDTO

KNOWN_TECH_MAP = {
    # Frontend
    "react": ("React", "Frontend"),
    "react-dom": ("React DOM", "Frontend"),
    "next": ("Next.js", "Frontend"),
    "vue": ("Vue.js", "Frontend"),
    "@angular/core": ("Angular", "Frontend"),
    "svelte": ("Svelte", "Frontend"),
    "tailwindcss": ("Tailwind CSS", "Frontend"),
    "framer-motion": ("Framer Motion", "Frontend"),
    "lucide-react": ("Lucide Icons", "Frontend"),
    "axios": ("Axios HTTP", "Frontend"),
    "zustand": ("Zustand State", "Frontend"),
    "@reduxjs/toolkit": ("Redux Toolkit", "Frontend"),
    "vite": ("Vite", "Frontend"),
    
    # Backend
    "fastapi": ("FastAPI", "Backend"),
    "flask": ("Flask", "Backend"),
    "flask-cors": ("Flask-CORS", "Backend"),
    "flask-sqlalchemy": ("Flask-SQLAlchemy", "Backend"),
    "django": ("Django", "Backend"),
    "express": ("Express.js", "Backend"),
    "@nestjs/core": ("NestJS", "Backend"),
    "pydantic": ("Pydantic", "Backend"),
    "sqlalchemy": ("SQLAlchemy ORM", "Backend"),
    "uvicorn": ("Uvicorn ASGI", "Backend"),
    "gunicorn": ("Gunicorn WSGI", "Backend"),
    "celery": ("Celery Task Queue", "Backend"),
    "rq": ("RQ Redis Queue", "Backend"),
    
    # Database
    "psycopg2-binary": ("PostgreSQL", "Database"),
    "asyncpg": ("PostgreSQL Async", "Database"),
    "redis": ("Redis In-Memory DB", "Database"),
    "neo4j": ("Neo4j Graph DB", "Database"),
    "qdrant-client": ("Qdrant Vector DB", "Database"),
    "pymongo": ("MongoDB", "Database"),
    "prisma": ("Prisma ORM", "Database"),
    "typeorm": ("TypeORM", "Database"),
    
    # Infrastructure & Cloud
    "boto3": ("AWS SDK (Boto3)", "Infrastructure"),
    "docker": ("Docker", "Infrastructure"),
    "kubernetes": ("Kubernetes", "Infrastructure"),
    
    # Tooling & Languages
    "typescript": ("TypeScript", "DevOps & Tooling"),
    "pytest": ("Pytest", "DevOps & Tooling"),
    "jest": ("Jest", "DevOps & Tooling"),
    "eslint": ("ESLint", "DevOps & Tooling"),
    "tree-sitter": ("Tree-Sitter AST", "DevOps & Tooling")
}

class TechnologyStackAnalyzer:
    """
    Extracts real technologies, dependencies, and frameworks from Neo4j AST and manifest files.
    """
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver

    def analyze(self, version_id: str) -> Tuple[List[TechStackItemDTO], str]:
        tech_items: List[TechStackItemDTO] = []
        languages: Dict[str, int] = {}
        seen_names = set()

        with self.driver.session() as session:
            # Query 1: External Packages
            query = """
            MATCH (p:GraphNode {repository_version_id: $version_id, type: "ExternalPackage"})
            RETURN p.name AS name, coalesce(p.file_path, "manifest") AS file_path
            LIMIT 100
            """
            pkgs = session.run(query, version_id=version_id)
            for r in pkgs:
                raw_name = r["name"].lower().strip()
                file_path = r["file_path"]
                
                # Check against known map
                if raw_name in KNOWN_TECH_MAP:
                    display_name, category = KNOWN_TECH_MAP[raw_name]
                    if display_name not in seen_names:
                        tech_items.append(TechStackItemDTO(
                            name=display_name,
                            category=category,
                            source_file=file_path
                        ))
                        seen_names.add(display_name)
                else:
                    # Generic package
                    if len(raw_name) > 2 and raw_name not in seen_names:
                        category = "Backend" if file_path.endswith((".py", "requirements.txt")) else "Frontend"
                        tech_items.append(TechStackItemDTO(
                            name=raw_name,
                            category=category,
                            source_file=file_path
                        ))
                        seen_names.add(raw_name)

            # Query 2: Language breakdown from File extensions
            file_query = """
            MATCH (f:GraphNode {repository_version_id: $version_id, type: "File"})
            RETURN f.file_path AS path
            """
            files = session.run(file_query, version_id=version_id)
            for r in files:
                path = r["path"] or ""
                if path.endswith((".ts", ".tsx")):
                    languages["TypeScript"] = languages.get("TypeScript", 0) + 1
                elif path.endswith((".js", ".jsx", ".mjs")):
                    languages["JavaScript"] = languages.get("JavaScript", 0) + 1
                elif path.endswith(".py"):
                    languages["Python"] = languages.get("Python", 0) + 1
                elif path.endswith(".go"):
                    languages["Go"] = languages.get("Go", 0) + 1
                elif path.endswith(".rs"):
                    languages["Rust"] = languages.get("Rust", 0) + 1
                elif path.endswith(".java"):
                    languages["Java"] = languages.get("Java", 0) + 1
                elif "Dockerfile" in path:
                    tech_items.append(TechStackItemDTO(name="Docker Container", category="Infrastructure", source_file=path))

        primary_lang = "Not detected"
        if languages:
            primary_lang = max(languages, key=languages.get)

        return tech_items[:30], primary_lang
