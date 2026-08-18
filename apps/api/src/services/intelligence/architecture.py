from typing import List, Dict, Any
from .dto import SubsystemDTO
from ..analysis.graph.architecture import SubsystemDetector

class ArchitectureAnalyzer:
    """
    Extracts structural subsystem decomposition and assigns architectural responsibilities.
    """
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver
        self.subsystem_detector = SubsystemDetector(neo4j_driver)

    def analyze(self, version_id: str) -> List[SubsystemDTO]:
        raw_subs = self.subsystem_detector.detect_subsystems(version_id)
        subsystems: List[SubsystemDTO] = []
        
        for s in raw_subs:
            name = s["name"]
            resp = self._infer_responsibility(name)
            
            subsystems.append(SubsystemDTO(
                name=name,
                responsibility=resp,
                files_count=s.get("files", 0),
                symbols_count=s.get("symbols", 0),
                coupling_ratio=s.get("coupling_ratio", 0.0),
                status=s.get("health", "LOW_COUPLING"),
                sample_files=s.get("sample_files", [])
            ))

        return subsystems

    def _infer_responsibility(self, name: str) -> str:
        lower = name.lower()
        if "routes" in lower or "api" in lower or "controllers" in lower:
            return "REST API Routing, HTTP request validation, and endpoint handling."
        elif "models" in lower or "schemas" in lower or "entities" in lower or "db" in lower:
            return "Database entity modeling, data schema definitions, and relational mapping."
        elif "components" in lower or "ui" in lower or "views" in lower or "pages" in lower:
            return "User interface presentation, React view rendering, and interactive state."
        elif "utils" in lower or "helpers" in lower or "lib" in lower or "common" in lower:
            return "Cross-cutting shared utilities, external integrations, and helper logic."
        elif "templates" in lower or "emails" in lower:
            return "Dynamic message templates, email generation, and visual layout assets."
        elif "services" in lower or "core" in lower:
            return "Business logic execution, domain rules orchestration, and service workflows."
        elif "backend" in lower:
            return "Server-side application runtime, database connection, and API services."
        elif "frontend" in lower:
            return "Client-side single page application and responsive user interface."
        return "Dedicated functional subsystem and module boundary."
