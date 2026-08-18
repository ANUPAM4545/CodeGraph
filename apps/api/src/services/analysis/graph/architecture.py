import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class SubsystemDetector:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver

    def detect_subsystems(self, version_id: str, organization_id: str = None) -> List[Dict[str, Any]]:
        """
        Determine subsystems by Directory Hierarchy and File counts.
        """
        with self.driver.session() as session:
            query = """
            MATCH (f:GraphNode {repository_version_id: $version_id, type: "File"})
            WHERE f.file_path IS NOT NULL
            WITH f, 
                 CASE 
                   WHEN f.file_path CONTAINS "/" THEN 
                     CASE 
                       WHEN split(f.file_path, "/")[0] IN ["src", "app", "lib", "packages", "apps", "backend", "frontend"] AND size(split(f.file_path, "/")) > 2 
                       THEN split(f.file_path, "/")[0] + "/" + split(f.file_path, "/")[1]
                       ELSE split(f.file_path, "/")[0]
                     END
                   ELSE "root"
                 END AS module_name
            OPTIONAL MATCH (f)-[:DEFINES]->(sym:GraphNode {repository_version_id: $version_id})
            WITH module_name, count(DISTINCT f) AS file_count, count(DISTINCT sym) AS symbol_count, collect(DISTINCT f.id) AS file_ids
            RETURN module_name, file_count, symbol_count, file_ids
            ORDER BY file_count DESC
            LIMIT 50
            """
            results = session.run(query, version_id=version_id)
            subsystems = []
            for r in results:
                mod_name = r["module_name"]
                
                # Fetch cross-boundary imports
                cross_query = """
                MATCH (a:GraphNode {repository_version_id: $version_id, type: "File"})-[r:IMPORTS]->(b:GraphNode {repository_version_id: $version_id})
                WHERE a.file_path STARTS WITH $mod_name
                  AND NOT (b.file_path STARTS WITH $mod_name)
                RETURN count(DISTINCT r) AS ext_deps
                """
                ext_res = session.run(cross_query, version_id=version_id, mod_name=mod_name).single()
                ext_deps = ext_res["ext_deps"] if ext_res else 0
                
                file_count = r.get("file_count", 0) if isinstance(r, dict) else (r["file_count"] if "file_count" in r else 0)
                symbol_count = r.get("symbol_count", 0) if isinstance(r, dict) else (r["symbol_count"] if "symbol_count" in r else 0)
                
                coupling_ratio = round(ext_deps / max(1, file_count), 2)
                health = "EXCELLENT" if coupling_ratio < 0.3 else ("MODERATE" if coupling_ratio < 1.0 else "HIGH_COUPLING")
                
                subsystems.append({
                    "id": f"subsys_{mod_name.replace('/', '_')}",
                    "name": mod_name,
                    "root_path": mod_name,
                    "files": file_count,
                    "symbols": symbol_count,
                    "external_dependency_count": ext_deps,
                    "coupling_ratio": coupling_ratio,
                    "health": health
                })
            return subsystems

class CouplingAnalysisService:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver

    def analyze_coupling(self, version_id: str) -> Dict[str, Any]:
        with self.driver.session() as session:
            query = """
            MATCH (a:GraphNode {repository_version_id: $version_id, type: "File"})-[r:IMPORTS]->(b:GraphNode {repository_version_id: $version_id, type: "File"})
            WHERE a.file_path IS NOT NULL AND b.file_path IS NOT NULL
            WITH split(a.file_path, '/')[0] AS source_mod, split(b.file_path, '/')[0] AS target_mod, count(r) AS weight
            WHERE source_mod <> target_mod
            RETURN source_mod, target_mod, weight
            ORDER BY weight DESC
            LIMIT 20
            """
            results = session.run(query, version_id=version_id)
            couplings = []
            for r in results:
                couplings.append({
                    "source": r["source_mod"],
                    "target": r["target_mod"],
                    "strength": r["weight"]
                })
            return {"module_couplings": couplings}

    def detect_cycles(self, version_id: str) -> List[Dict[str, Any]]:
        """
        Bounded Cycle detection using Neo4j path matching.
        """
        with self.driver.session() as session:
            query = """
            MATCH path = (a:GraphNode {repository_version_id: $version_id})-[:IMPORTS*2..4]->(a)
            RETURN [n IN nodes(path) | coalesce(n.name, n.file_path, n.id)] AS cycle_path,
                   [n IN nodes(path) | n.id] AS cycle_ids
            LIMIT 20
            """
            results = session.run(query, version_id=version_id)
            seen = set()
            cycles = []
            for r in results:
                path = r["cycle_path"]
                ids = r["cycle_ids"]
                if len(path) > 1:
                    norm = tuple(sorted(ids[:-1]))
                    if norm not in seen:
                        seen.add(norm)
                        cycles.append({
                            "length": len(path) - 1,
                            "path": path,
                            "summary": " -> ".join(path)
                        })
            return cycles

class EntryPointDetector:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver

    def detect_entry_points(self, version_id: str) -> List[Dict[str, Any]]:
        with self.driver.session() as session:
            query = """
            MATCH (n:GraphNode {repository_version_id: $version_id})
            WHERE (n.type = "File" AND (n.name IN ["main.py", "app.py", "index.ts", "index.js", "page.tsx", "layout.tsx", "server.js", "server.ts", "App.tsx", "main.ts", "manage.py", "router.ts", "router.py"]))
               OR (n.type = "Function" AND (toLower(n.name) IN ["main", "bootstrap", "handler", "init", "start", "app", "create_app", "root"]))
            RETURN n.id AS id, coalesce(n.name, n.qualified_name) AS name, n.type AS type, n.file_path AS file_path,
                   CASE 
                     WHEN n.name IN ["page.tsx", "layout.tsx"] THEN "Next.js UI Route / Layout"
                     WHEN n.name IN ["main.py", "app.py", "server.js", "server.ts", "main.ts"] THEN "Server / App Entrypoint"
                     WHEN n.type = "Function" THEN "Primary Execution Function"
                     ELSE "Gateway Entry Point"
                   END AS reason
            ORDER BY n.type ASC, n.file_path ASC
            LIMIT 30
            """
            results = session.run(query, version_id=version_id)
            entries = []
            for r in results:
                entries.append({
                    "id": r["id"],
                    "name": r["name"],
                    "type": r["type"],
                    "file": r["file_path"] or r["name"],
                    "reason": r["reason"]
                })
            return entries
