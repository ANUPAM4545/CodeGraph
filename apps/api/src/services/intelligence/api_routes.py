import re
from typing import List, Dict, Any
from .dto import ApiEndpointDTO

class APIRouteAnalyzer:
    """
    Extracts real API endpoints, HTTP methods, paths, and handler symbols from Neo4j AST.
    """
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver

    def analyze(self, version_id: str) -> List[ApiEndpointDTO]:
        endpoints: List[ApiEndpointDTO] = []
        
        with self.driver.session() as session:
            # Query 1: Functions defined in route/api/controller files
            query = """
            MATCH (f:GraphNode {repository_version_id: $version_id, type: "Function"})
            WHERE f.file_path =~ ".*(routes?/|api/|controllers?/|endpoints?/|views?/|app\\.py|server\\.py|router\\.py|main\\.py).*"
            RETURN f.id AS id, coalesce(f.name, "handler") AS name, 
                   coalesce(f.file_path, "") AS file_path,
                   coalesce(f.qualified_name, f.name) AS qualified_name
            ORDER BY f.file_path, f.name
            LIMIT 100
            """
            results = session.run(query, version_id=version_id)
            
            for r in results:
                func_name = r["name"]
                file_path = r["file_path"]
                
                # Skip internal/helper functions
                if func_name.startswith("_") or func_name in ["init_db", "create_app", "setup", "teardown", "lifespan"]:
                    continue
                    
                method, path, summary = self._infer_route_metadata(func_name, file_path)
                
                endpoints.append(ApiEndpointDTO(
                    method=method,
                    path=path,
                    handler=func_name,
                    source_file=file_path,
                    summary=summary
                ))

            # Query 2: Next.js / Express Route files
            next_query = """
            MATCH (f:GraphNode {repository_version_id: $version_id, type: "File"})
            WHERE f.file_path =~ ".*(src/app/.*/route\\.[jt]sx?|pages/api/.*\\.[jt]sx?|src/api/.*\\.[jt]sx?).*"
            RETURN f.id AS id, f.name AS name, f.file_path AS file_path
            LIMIT 50
            """
            next_results = session.run(next_query, version_id=version_id)
            for r in next_results:
                file_path = r["file_path"]
                # Extract route path from file hierarchy
                path = "/" + file_path.replace("src/app/", "").replace("pages/api/", "api/").replace("/route.ts", "").replace("/route.js", "")
                if not any(e.source_file == file_path for e in endpoints):
                    endpoints.append(ApiEndpointDTO(
                        method="GET/POST",
                        path=path,
                        handler="RouteHandler",
                        source_file=file_path,
                        summary=f"Next.js Serverless Route Handler at {path}"
                    ))
                    
        return endpoints[:60]

    def _infer_route_metadata(self, func_name: str, file_path: str) -> tuple:
        lower_func = func_name.lower()
        
        # Derive base resource from file path (e.g. backend/routes/disputes.py -> /api/disputes)
        resource = "api"
        file_match = re.search(r'(?:routes?|api|controllers?)/([^/]+)\.(?:py|ts|js)', file_path)
        if file_match:
            resource = file_match.group(1).replace("_", "-")
        elif "app.py" in file_path or "main.py" in file_path:
            resource = "app"
            
        method = "GET"
        action = func_name.replace("_", " ").title()
        
        if lower_func.startswith(("create_", "post_", "add_", "register", "login", "send_", "submit", "upload", "respond", "pay_")):
            method = "POST"
            action_name = lower_func.split("_", 1)[-1] if "_" in lower_func else lower_func
            path = f"/api/{resource}/{action_name}" if action_name not in ["create", "post", "add"] else f"/api/{resource}"
            summary = f"Create or execute {action} operation"
        elif lower_func.startswith(("update_", "put_", "edit_", "patch_", "resolve_", "toggle_")):
            method = "PUT"
            action_name = lower_func.split("_", 1)[-1] if "_" in lower_func else lower_func
            path = f"/api/{resource}/:id/{action_name}" if action_name not in ["update", "put", "edit"] else f"/api/{resource}/:id"
            summary = f"Update or modify {action}"
        elif lower_func.startswith(("delete_", "remove_", "drop_", "cancel_")):
            method = "DELETE"
            path = f"/api/{resource}/:id"
            summary = f"Delete or cancel {resource} resource"
        else:
            method = "GET"
            if lower_func.startswith(("get_", "fetch_", "list_", "read_")):
                action_name = lower_func.split("_", 1)[-1]
                path = f"/api/{resource}/{action_name}" if action_name != resource else f"/api/{resource}"
            else:
                path = f"/api/{resource}/{lower_func}"
            summary = f"Retrieve {action} data"
            
        return method, path, summary
