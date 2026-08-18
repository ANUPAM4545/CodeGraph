from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class ImpactAnalysisDTO:
    def __init__(self, target: str, depth: int):
        self.target = target
        self.depth = depth
        self.direct_dependencies: List[Dict[str, Any]] = []
        self.direct_dependents: List[Dict[str, Any]] = []
        self.callers: List[Dict[str, Any]] = []
        self.callees: List[Dict[str, Any]] = []
        self.inheritance_neighbors: List[Dict[str, Any]] = []
        self.affected_files: List[str] = []
        self.affected_modules: List[str] = []
        self.risk_signals: Dict[str, Any] = {}

class ImpactAnalysisService:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver
        self.allowed_rels = ["CALLS", "IMPORTS", "INHERITS", "DEFINES", "CONTAINS"]

    def analyze_impact(self, version_id: str, node_id: str, depth: int = 1) -> ImpactAnalysisDTO:
        if depth < 1:
            depth = 1
        elif depth > 3:
            depth = 3
            
        dto = ImpactAnalysisDTO(target=node_id, depth=depth)
        
        with self.driver.session() as session:
            # Fetch Callers (INCOMING CALLS)
            caller_query = f"""
            MATCH (caller)-[:CALLS*1..{depth}]->(target)
            WHERE target.id = $node_id AND target.repository_version_id = $version_id
              AND caller.repository_version_id = $version_id
            RETURN caller.id AS id, coalesce(caller.name, caller.qualified_name, "Unnamed") AS label, 
                   caller.type AS type, coalesce(caller.file_path, "") AS file_path
            LIMIT 50
            """
            callers = session.run(caller_query, node_id=node_id, version_id=version_id)
            for r in callers:
                dto.callers.append({"id": r["id"], "label": r["label"], "type": r["type"], "path": r["file_path"]})

            # Fetch Callees (OUTGOING CALLS)
            callee_query = f"""
            MATCH (target)-[:CALLS*1..{depth}]->(callee)
            WHERE target.id = $node_id AND target.repository_version_id = $version_id
              AND callee.repository_version_id = $version_id
            RETURN callee.id AS id, coalesce(callee.name, callee.qualified_name, "Unnamed") AS label,
                   callee.type AS type, coalesce(callee.file_path, "") AS file_path
            LIMIT 50
            """
            callees = session.run(callee_query, node_id=node_id, version_id=version_id)
            for r in callees:
                dto.callees.append({"id": r["id"], "label": r["label"], "type": r["type"], "path": r["file_path"]})
                
            # Direct Dependencies (OUTGOING IMPORTS / CALLS depth 1)
            deps_query = """
            MATCH (target)-[r:IMPORTS|CALLS]->(dep)
            WHERE target.id = $node_id AND target.repository_version_id = $version_id
              AND dep.repository_version_id = $version_id
            RETURN dep.id AS id, coalesce(dep.name, dep.qualified_name, "Unnamed") AS label, 
                   type(r) AS rel_type, coalesce(dep.file_path, "") AS file_path
            LIMIT 50
            """
            deps = session.run(deps_query, node_id=node_id, version_id=version_id)
            for r in deps:
                dto.direct_dependencies.append({
                    "id": r["id"], "label": r["label"], "type": r["rel_type"], "path": r["file_path"]
                })
                
            # Direct Dependents (INCOMING IMPORTS / CALLS depth 1)
            dependents_query = """
            MATCH (dependent)-[r:IMPORTS|CALLS]->(target)
            WHERE target.id = $node_id AND target.repository_version_id = $version_id
              AND dependent.repository_version_id = $version_id
            RETURN dependent.id AS id, coalesce(dependent.name, dependent.qualified_name, "Unnamed") AS label, 
                   type(r) AS rel_type, coalesce(dependent.file_path, "") AS file_path
            LIMIT 50
            """
            dependents = session.run(dependents_query, node_id=node_id, version_id=version_id)
            for r in dependents:
                dto.direct_dependents.append({
                    "id": r["id"], "label": r["label"], "type": r["rel_type"], "path": r["file_path"]
                })
                
            # Inheritance Neighbors
            inheritance_query = f"""
            MATCH (n)-[:INHERITS*1..{depth}]-(target)
            WHERE target.id = $node_id AND target.repository_version_id = $version_id
              AND n.repository_version_id = $version_id
            RETURN n.id AS id, coalesce(n.name, n.qualified_name, "Unnamed") AS label, 
                   coalesce(n.file_path, "") AS file_path
            LIMIT 50
            """
            inherit = session.run(inheritance_query, node_id=node_id, version_id=version_id)
            for r in inherit:
                dto.inheritance_neighbors.append({"id": r["id"], "label": r["label"], "path": r["file_path"]})

            # Affected files/modules
            affected_files = set()
            for coll in [dto.callers, dto.direct_dependents, dto.inheritance_neighbors]:
                for item in coll:
                    if item.get("path"):
                        affected_files.add(item["path"])
            dto.affected_files = list(affected_files)
            
            # Subsystem heuristic: first folder
            affected_modules = set()
            for path in dto.affected_files:
                parts = path.split("/")
                if len(parts) > 1:
                    affected_modules.add(parts[0])
            dto.affected_modules = list(affected_modules)
            
        return dto
