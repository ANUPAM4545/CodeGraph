from typing import Dict, Any
from .dto import HealthMetricsDTO
from ..analysis.graph.architecture import CouplingAnalysisService, EntryPointDetector

class HealthAnalyzer:
    """
    Calculates exact deterministic CodeGraph telemetry and architecture health metrics from Neo4j.
    """
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver
        self.cycle_service = CouplingAnalysisService(neo4j_driver)
        self.entry_service = EntryPointDetector(neo4j_driver)

    def analyze(self, version_id: str) -> HealthMetricsDTO:
        with self.driver.session() as session:
            # Query counts by type
            query = """
            MATCH (n:GraphNode {repository_version_id: $version_id})
            RETURN n.type AS type, count(n) AS count
            """
            type_counts = {}
            for r in session.run(query, version_id=version_id):
                type_counts[r["type"]] = r["count"]
                
            # Query total relationships
            rel_query = """
            MATCH (n:GraphNode {repository_version_id: $version_id})-[r]->(m:GraphNode {repository_version_id: $version_id})
            RETURN count(r) AS rel_count
            """
            rel_res = session.run(rel_query, version_id=version_id).single()
            rel_count = rel_res["rel_count"] if rel_res else 0

        files = type_counts.get("File", 0)
        functions = type_counts.get("Function", 0)
        classes = type_counts.get("Class", 0)
        total_nodes = sum(type_counts.values())
        
        cycles = self.cycle_service.detect_cycles(version_id)
        entry_points = self.entry_service.detect_entry_points(version_id)
        
        # Calculate Health Score (100 base, penalty for circular dependencies)
        score = 100
        if len(cycles) > 0:
            score -= min(40, len(cycles) * 15)
        score = max(40, min(100, score))
        
        grade = "A+" if score >= 90 else ("A" if score >= 80 else ("B" if score >= 70 else ("C" if score >= 60 else "D")))

        return HealthMetricsDTO(
            total_files=files,
            total_functions=functions,
            total_classes=classes,
            total_ast_nodes=total_nodes,
            total_relationships=rel_count,
            entry_points_count=len(entry_points),
            circular_dependencies_count=len(cycles),
            health_score=score,
            health_grade=grade
        )
