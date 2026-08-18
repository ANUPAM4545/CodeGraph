import logging
from typing import Dict, Any, Optional
from src.services.analysis.graph.impact import ImpactAnalysisService
import neo4j

logger = logging.getLogger(__name__)

class DeveloperContextResolver:
    def __init__(self, neo4j_driver: neo4j.Driver):
        self.driver = neo4j_driver
        # Simple in-memory cache keyed by repo_version_id + context key
        self._cache: Dict[str, Dict[str, Any]] = {}

    def _get_cache_key(self, version_id: str, level: str, symbol_id: str) -> str:
        return f"{version_id}:{level}:{symbol_id}"

    def clear_version_cache(self, version_id: str):
        keys_to_delete = [k for k in self._cache.keys() if k.startswith(f"{version_id}:")]
        for k in keys_to_delete:
            del self._cache[k]

    def resolve(self, version_id: str, payload: Dict[str, Any], level: str = "LIGHT") -> Dict[str, Any]:
        """
        Resolves IDE context based on level: LIGHT, STANDARD, DEEP.
        payload may contain file_path, line, column, symbol_id.
        """
        file_path = payload.get("file_path")
        symbol_id = payload.get("symbol_id")
        
        if not symbol_id and not file_path:
            return {}

        # Resolve symbol_id if missing but file_path and line are provided (simplified)
        if not symbol_id and file_path:
            symbol_id = f"{file_path}_fallback_id" # Mocked resolution for now
            
        cache_key = self._get_cache_key(version_id, level, symbol_id)
        if cache_key in self._cache:
            return self._cache[cache_key]

        context = {
            "repository_version_id": version_id,
            "resolved_symbol_id": symbol_id,
            "file_path": file_path,
            "level": level
        }

        # LIGHT Context: Basic neighbors
        if level in ["LIGHT", "STANDARD", "DEEP"]:
            with self.driver.session() as session:
                query = """
                MATCH (n)-[r]-(m) 
                WHERE n.id = $symbol_id AND n.repository_version_id = $version_id
                RETURN type(r) as rel_type, m.label as neighbor_label, m.type as neighbor_type
                LIMIT 10
                """
                results = session.run(query, symbol_id=symbol_id, version_id=version_id)
                neighbors = [{"type": r["rel_type"], "label": r["neighbor_label"], "node_type": r["neighbor_type"]} for r in results]
                context["basic_neighbors"] = neighbors

        # STANDARD Context: Impact, Dependencies, Subsystem
        if level in ["STANDARD", "DEEP"]:
            impact_svc = ImpactAnalysisService(self.driver)
            try:
                impact = impact_svc.analyze_impact(version_id, symbol_id, depth=1)
                context["impact"] = impact.__dict__
            except Exception as e:
                logger.error(f"Impact analysis failed for {symbol_id}: {e}")
                
            # Subsystem module resolution
            context["subsystem"] = file_path.split('/')[0] if file_path else "unknown"

        # DEEP Context: Semantic chunks, Architecture report, AI context
        if level == "DEEP":
            from src.services.analysis.graph.risk import ArchitectureRiskService
            risk_svc = ArchitectureRiskService(self.driver)
            try:
                risk_data = risk_svc.calculate_risk(version_id, symbol_id)
                context["architecture_signals"] = risk_data
            except Exception:
                context["architecture_signals"] = {"risk_level": "LOW", "score": 0}
            context["semantic_chunks"] = []

        self._cache[cache_key] = context
        return context
