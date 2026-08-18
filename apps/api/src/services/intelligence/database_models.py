import re
from typing import List, Dict, Any
from .dto import DbModelDTO

class DatabaseModelAnalyzer:
    """
    Extracts real database schemas and ORM model entities from Neo4j AST.
    """
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver

    def analyze(self, version_id: str) -> List[DbModelDTO]:
        models: List[DbModelDTO] = []
        
        with self.driver.session() as session:
            # Query classes in model/schema/entity/db files
            query = """
            MATCH (c:GraphNode {repository_version_id: $version_id, type: "Class"})
            WHERE c.file_path =~ ".*(models?\\.py|models?/.*|schemas?\\.py|schemas?/.*|entities?/.*|db/.*|prisma/.*).*"
            RETURN c.id AS id, c.name AS name, coalesce(c.file_path, "") AS file_path,
                   coalesce(c.qualified_name, c.name) AS qualified_name
            ORDER BY c.file_path, c.name
            LIMIT 50
            """
            results = session.run(query, version_id=version_id)
            
            for r in results:
                name = r["name"]
                file_path = r["file_path"]
                
                # Skip config classes, base classes or DTOs that are not entities
                if name in ["Base", "Model", "Config", "DBConfig", "Session", "SessionLocal"]:
                    continue
                if name.endswith(("Response", "Request", "DTO", "Schema", "Config")):
                    continue
                    
                orm = self._detect_orm(file_path)
                table_name = self._infer_table_name(name)
                
                models.append(DbModelDTO(
                    name=name,
                    table_name=table_name,
                    orm_framework=orm,
                    source_file=file_path
                ))

        return models

    def _detect_orm(self, file_path: str) -> str:
        if file_path.endswith(".py"):
            return "SQLAlchemy / Python ORM"
        elif "prisma" in file_path:
            return "Prisma ORM"
        elif file_path.endswith((".ts", ".js")):
            return "TypeORM / Prisma / Mongoose"
        return "Relational / Document ORM"

    def _infer_table_name(self, model_name: str) -> str:
        # Convert PascalCase to snake_case plural (e.g. OrderItem -> order_items, User -> users)
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', model_name)
        snake = re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
        if not snake.endswith("s"):
            return f"{snake}s"
        return snake
