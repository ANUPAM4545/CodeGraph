import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class ArchitectureRiskService:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver

    def calculate_risk(self, version_id: str, node_id: str) -> Dict[str, Any]:
        """
        Deterministically calculate architectural risk signals for a node.
        """
        with self.driver.session() as session:
            # Fan In (Incoming calls/imports)
            fan_in_query = """
            MATCH (n)-[:CALLS|IMPORTS]->(target)
            WHERE target.id = $node_id AND target.repository_version_id = $version_id
              AND n.repository_version_id = $version_id
            RETURN count(DISTINCT n) AS fan_in
            """
            fan_in_res = session.run(fan_in_query, node_id=node_id, version_id=version_id).single()
            fan_in = fan_in_res["fan_in"] if fan_in_res else 0

            # Fan Out (Outgoing calls/imports)
            fan_out_query = """
            MATCH (target)-[:CALLS|IMPORTS]->(n)
            WHERE target.id = $node_id AND target.repository_version_id = $version_id
              AND n.repository_version_id = $version_id
            RETURN count(DISTINCT n) AS fan_out
            """
            fan_out_res = session.run(fan_out_query, node_id=node_id, version_id=version_id).single()
            fan_out = fan_out_res["fan_out"] if fan_out_res else 0

            # Affected modules (Cross boundary proxy)
            module_query = """
            MATCH (n)-[:CALLS|IMPORTS*1..2]->(target)
            WHERE target.id = $node_id AND target.repository_version_id = $version_id
              AND n.repository_version_id = $version_id
            WITH coalesce(n.file_path, n.name) AS path
            WHERE path IS NOT NULL AND size(path) > 0
            RETURN count(DISTINCT split(path, '/')[0]) AS modules_count
            """
            mod_res = session.run(module_query, node_id=node_id, version_id=version_id).single()
            affected_modules = mod_res["modules_count"] if mod_res else 0

        # Deterministic scoring
        score = 0
        signals = {
            "fan_in": fan_in,
            "fan_out": fan_out,
            "affected_modules": affected_modules
        }
        
        reasons = []
        if fan_in > 10:
            score += 40
            reasons.append(f"High fan-in ({fan_in} callers/dependents), indicating widespread architectural usage.")
        elif fan_in > 3:
            score += 20
            reasons.append(f"Moderate fan-in ({fan_in} callers/dependents).")
            
        if affected_modules > 2:
            score += 30
            reasons.append(f"Cross-boundary propagation into {affected_modules} distinct subsystems.")
            
        if fan_out > 10:
            score += 20
            reasons.append(f"High fan-out ({fan_out} outgoing dependencies), increasing change instability.")

        risk_level = "LOW"
        if score > 60:
            risk_level = "HIGH"
        elif score > 30:
            risk_level = "MEDIUM"

        return {
            "risk_level": risk_level,
            "score": min(score, 100),
            "signals": signals,
            "explanation": " ".join(reasons) if reasons else "Normal dependency and boundary metrics."
        }
