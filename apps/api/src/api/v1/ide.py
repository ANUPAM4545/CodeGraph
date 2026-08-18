from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.db.models.user import User
from src.db.models.repository import RepositoryVersion
from src.api.deps import get_authorized_repository_version
from src.services.security import get_current_user
from src.core.config import settings
from src.services.analysis.graph.impact import ImpactAnalysisService
import neo4j

router = APIRouter()

def get_neo4j_driver():
    driver = neo4j.GraphDatabase.driver(
        uri=settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )
    try:
        yield driver
    finally:
        driver.close()

@router.post("/{repository_id}/versions/{version_id}/developer-context")
def get_developer_context(
    repository_id: str,
    version_id: str,
    payload: dict,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    driver = Depends(get_neo4j_driver)
):
    version_id = str(version.id)
    file_path = payload.get("file_path")
    line_start = payload.get("line_start")
    line_end = payload.get("line_end")
    symbol_id = payload.get("symbol_id")
    symbol_name = payload.get("symbol_name")
    
    if not symbol_id and not file_path:
        raise HTTPException(status_code=400, detail="Must provide symbol_id or file_path")
        
    impact_svc = ImpactAnalysisService(driver)
    
    impact_data = None
    if symbol_id:
        impact_data = impact_svc.analyze_impact(version_id, symbol_id, depth=3)
    
    # In a real app we would use HybridRetriever here for semantic_evidence, but for now we construct the DTO:
    import datetime
    
    return {
        "repository_id": repository_id,
        "repository_version_id": version_id,
        "commit_sha": version.commit_sha,
        "file_path": file_path,
        "line_start": line_start,
        "line_end": line_end,
        "symbol_id": symbol_id or "unknown",
        "symbol_name": symbol_name or "unknown",
        "symbol_type": "Function", # Mocked for now, normally retrieved from Neo4j node label
        "definition": f"def {symbol_name}(...): ...",
        "callers": len(impact_data.callers) if impact_data else 0,
        "callees": len(impact_data.callees) if impact_data else 0,
        "dependencies": [d["name"] for d in (impact_data.dependencies if impact_data else [])[:5]],
        "dependents": [d["name"] for d in (impact_data.dependents if impact_data else [])[:5]],
        "impact": {
            "affected_files": len(impact_data.affected_files) if impact_data else 0,
            "affected_modules": len(impact_data.affected_modules) if impact_data else 0,
            "traversal_depth": 3
        },
        "risk": impact_data.risk_score.name if impact_data else "LOW",
        "risk_signals": impact_data.risk_signals if impact_data else [],
        "subsystem": "Unknown",
        "architecture_context": "Found in structural graph",
        "evidence_quality": 0.9,
        "semantic_evidence": [],
        "citations": [
            {"file_path": file_path, "symbol_name": symbol_name, "line_start": line_start, "line_end": line_end, "node_id": symbol_id}
        ] if file_path else [],
        "readiness": version.status.upper(),
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
