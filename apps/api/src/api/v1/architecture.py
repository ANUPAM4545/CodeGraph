# pyrefly: ignore-all-errors
# type: ignore
from fastapi import APIRouter, Depends, HTTPException
from src.db.models.repository import RepositoryVersion
from src.api.deps import get_authorized_repository_version
from src.core.config import settings

from src.services.analysis.graph.impact import ImpactAnalysisService
from src.services.analysis.graph.risk import ArchitectureRiskService
from src.services.analysis.graph.architecture import SubsystemDetector, CouplingAnalysisService, EntryPointDetector

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

@router.get("/{repository_id}/versions/{version_id}/architecture/summary")
def get_architecture_summary(
    repository_id: str,
    version_id: str,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    driver = Depends(get_neo4j_driver)
):
    version_id = str(version.id)
    sub_detector = SubsystemDetector(driver)
    entry_detector = EntryPointDetector(driver)
    
    return {
        "subsystems": sub_detector.detect_subsystems(version_id),
        "entry_points": entry_detector.detect_entry_points(version_id)
    }

@router.get("/{repository_id}/versions/{version_id}/architecture/hotspots")
def get_architecture_hotspots(
    repository_id: str,
    version_id: str,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    driver = Depends(get_neo4j_driver)
):
    version_id = str(version.id)
    with driver.session() as session:
        query = """
        MATCH (n:GraphNode {repository_version_id: $version_id})-[r:IMPORTS|CALLS]->(target:GraphNode {repository_version_id: $version_id})
        WITH target, count(DISTINCT n) AS fan_in,
             collect(DISTINCT {
               id: n.id,
               name: coalesce(n.name, n.file_path, "Unnamed"),
               type: n.type,
               file_path: coalesce(n.file_path, n.name, ""),
               rel_type: type(r)
             }) AS dependents
        ORDER BY fan_in DESC
        LIMIT 20
        RETURN target.id AS id, coalesce(target.name, target.qualified_name) AS name, 
               target.type AS type, target.file_path AS file_path, fan_in, dependents
        """
        results = session.run(query, version_id=version_id)
        hotspots = []
        for r in results:
            raw_dependents = r["dependents"] or []
            top_callers = [d.get("name") for d in raw_dependents[:5] if d.get("name")]
            hotspots.append({
                "id": r["id"],
                "name": r["name"],
                "type": r["type"],
                "file": r["file_path"] or r["name"],
                "fan_in": r["fan_in"],
                "top_callers": top_callers,
                "dependents": raw_dependents,
                "signals": {"fan_in": r["fan_in"]}
            })
    return hotspots

@router.get("/{repository_id}/versions/{version_id}/architecture/report")
def get_architecture_report(
    repository_id: str,
    version_id: str,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    driver = Depends(get_neo4j_driver)
):
    version_id = str(version.id)
    sub_detector = SubsystemDetector(driver)
    entry_detector = EntryPointDetector(driver)
    cycle_detector = CouplingAnalysisService(driver)
    
    subsystems = sub_detector.detect_subsystems(version_id)
    hotspots = get_architecture_hotspots(repository_id, version_id, version, driver)
    cycles = cycle_detector.detect_cycles(version_id)
    entry_points = entry_detector.detect_entry_points(version_id)
    couplings = cycle_detector.analyze_coupling(version_id)
    
    # Calculate Architecture Health Score (0-100)
    base_score = 100
    if len(cycles) > 0:
        base_score -= min(35, len(cycles) * 10)
    high_coupling_subs = sum(1 for s in subsystems if s.get("health") == "HIGH_COUPLING")
    base_score -= min(25, high_coupling_subs * 8)
    health_score = max(30, min(100, base_score))
    
    health_grade = "A+" if health_score >= 90 else ("A" if health_score >= 80 else ("B" if health_score >= 70 else ("C" if health_score >= 60 else "D")))

    return {
        "repository_id": repository_id,
        "version_id": version_id,
        "health_score": health_score,
        "health_grade": health_grade,
        "subsystems_count": len(subsystems),
        "hotspots_count": len(hotspots),
        "cycles_count": len(cycles),
        "entry_points_count": len(entry_points),
        "subsystems": subsystems,
        "hotspots": hotspots,
        "cycles": cycles,
        "entry_points": entry_points,
        "couplings": couplings.get("module_couplings", [])
    }

@router.get("/{repository_id}/versions/{version_id}/architecture/cycles")
def get_architecture_cycles(
    repository_id: str,
    version_id: str,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    driver = Depends(get_neo4j_driver)
):
    version_id = str(version.id)
    cycle_detector = CouplingAnalysisService(driver)
    return cycle_detector.detect_cycles(version_id)

@router.post("/{repository_id}/versions/{version_id}/architecture/analyze-change")
def analyze_change(
    repository_id: str,
    version_id: str,
    payload: dict,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    driver = Depends(get_neo4j_driver)
):
    version_id = str(version.id)
    node_id = payload.get("node_id")
    if not node_id:
        raise HTTPException(status_code=400, detail="node_id required")
        
    impact_svc = ImpactAnalysisService(driver)
    risk_svc = ArchitectureRiskService(driver)
    
    impact = impact_svc.analyze_impact(version_id, node_id, depth=2)
    risk = risk_svc.calculate_risk(version_id, node_id)
    
    return {
        "impact": impact.__dict__,
        "risk_signals": risk
    }
