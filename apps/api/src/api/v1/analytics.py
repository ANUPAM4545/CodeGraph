from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import uuid

from src.db.session import get_db
from src.db.models.user import User
from src.db.models.organization import Organization, OrganizationMember
from src.db.models.repository import Repository, RepositoryVersion
from src.db.models.job import AnalysisJob
from src.services.security import get_current_user
from services.analysis.graph.query import GraphQueryService
from src.core.config import settings

router = APIRouter()

# DTOs for Dashboard Overview
class DashboardMetricsDTO(BaseModel):
    total_repositories: int
    active_repositories: int
    analyzing_repositories: int
    failed_repositories: int
    
    total_analyses: int
    completed_analyses: int
    running_analyses: int
    failed_analyses: int
    
    total_files_indexed: int
    total_code_entities: int

class RecentRepositoryDTO(BaseModel):
    id: str
    name: str
    full_name: str
    description: Optional[str] = None
    visibility: str
    default_branch: str
    url: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    latest_version_id: Optional[str] = None
    latest_commit_sha: Optional[str] = None
    latest_status: Optional[str] = None
    files_count: Optional[int] = None
    entities_count: Optional[int] = None

class AnalysisActivityDTO(BaseModel):
    id: str
    repository_id: str
    repository_name: str
    repository_version_id: str
    commit_sha: str
    branch: str
    job_type: str
    status: str
    progress: float
    error: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class CodebaseHealthDTO(BaseModel):
    metric_name: str
    value: str
    status: str  # "healthy" | "warning" | "error" | "unavailable"
    explanation: Optional[str] = None

class DashboardOverviewDTO(BaseModel):
    organization: Optional[Dict[str, Any]] = None
    metrics: DashboardMetricsDTO
    recent_repositories: List[RecentRepositoryDTO]
    analysis_activity: List[AnalysisActivityDTO]
    health: List[CodebaseHealthDTO]

# DTOs for Deep Real-Time Analytics
class EntityDistributionDTO(BaseModel):
    entity_type: str
    count: int
    percentage: float
    color: str

class RelationshipDistributionDTO(BaseModel):
    relationship_type: str
    count: int
    percentage: float
    color: str

class TopPackageDTO(BaseModel):
    package_name: str
    import_count: int
    percentage: float

class CodeDenseFileDTO(BaseModel):
    file_name: str
    symbol_count: int
    functions_count: int
    classes_count: int

class PipelineMetricsDTO(BaseModel):
    total_repositories: int
    total_files_indexed: int
    total_entities: int
    total_relationships: int
    total_analyses: int
    success_rate: float
    last_analysis_duration_seconds: Optional[float] = None
    last_analyzed_at: Optional[datetime] = None

class DeepAnalyticsDTO(BaseModel):
    repository_id: Optional[str] = None
    repository_name: Optional[str] = None
    repository_full_name: Optional[str] = None
    version_id: Optional[str] = None
    commit_sha: Optional[str] = None
    branch: Optional[str] = None
    pipeline_metrics: PipelineMetricsDTO
    entity_distribution: List[EntityDistributionDTO]
    relationship_distribution: List[RelationshipDistributionDTO]
    top_packages: List[TopPackageDTO]
    code_dense_files: List[CodeDenseFileDTO]


def get_graph_service() -> GraphQueryService:
    service = GraphQueryService(
        uri=settings.NEO4J_URI,
        user=settings.NEO4J_USER,
        password=settings.NEO4J_PASSWORD
    )
    try:
        yield service
    finally:
        service.close()


@router.get("/dashboard", response_model=DashboardOverviewDTO)
def get_dashboard_overview(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    graph_service: GraphQueryService = Depends(get_graph_service)
):
    member = db.query(OrganizationMember).filter(OrganizationMember.user_id == user.id).first()
    org_data = None
    org_id = None
    if member:
        org = db.query(Organization).filter(Organization.id == member.organization_id).first()
        if org:
            org_id = org.id
            org_data = {
                "id": str(org.id),
                "name": org.name,
                "role": member.role.name if hasattr(member.role, 'name') else str(member.role),
                "plan": "Enterprise"
            }

    if org_id:
        repo_filter = or_(Repository.organization_id == org_id, Repository.owner_id == user.id)
    else:
        repo_filter = (Repository.owner_id == user.id)

    repos = db.query(Repository).filter(repo_filter).order_by(desc(Repository.created_at)).all()
    repo_ids = [r.id for r in repos]

    total_repos = len(repos)
    active_repos = 0
    analyzing_repos = 0
    failed_repos = 0

    jobs = []
    if repo_ids:
        jobs = db.query(AnalysisJob).filter(
            AnalysisJob.repository_id.in_(repo_ids)
        ).order_by(desc(AnalysisJob.created_at)).all()

    total_analyses = len(jobs)
    completed_analyses = sum(1 for j in jobs if j.status == 'COMPLETED')
    running_analyses = sum(1 for j in jobs if j.status in ['RUNNING', 'QUEUED', 'PENDING'])
    failed_analyses = sum(1 for j in jobs if j.status == 'FAILED')

    total_files_indexed = 0
    total_code_entities = 0
    total_edges_mapped = 0
    total_external_packages = 0

    recent_repo_dtos: List[RecentRepositoryDTO] = []
    
    for r in repos:
        latest_ver = db.query(RepositoryVersion).filter(
            RepositoryVersion.repository_id == r.id
        ).order_by(desc(RepositoryVersion.created_at)).first()

        ver_id = str(latest_ver.id) if latest_ver else None
        commit_sha = latest_ver.commit_sha if latest_ver else None
        ver_status = latest_ver.status if latest_ver else "pending"

        if ver_status == "completed":
            active_repos += 1
        elif ver_status in ["analyzing", "pending"]:
            analyzing_repos += 1
        elif ver_status == "failed":
            failed_repos += 1
        else:
            active_repos += 1

        files_count = None
        entities_count = None

        if ver_id and ver_status == "completed":
            try:
                overview = graph_service.get_overview(ver_id)
                if overview:
                    files_count = overview.files
                    entities_count = overview.total_nodes
                    total_files_indexed += overview.files
                    total_code_entities += overview.total_nodes
                    total_edges_mapped += overview.total_edges
                    total_external_packages += overview.external_packages
            except Exception:
                pass

        recent_repo_dtos.append(RecentRepositoryDTO(
            id=str(r.id),
            name=r.name,
            full_name=r.full_name,
            description=r.description,
            visibility=r.visibility or "public",
            default_branch=r.default_branch or "main",
            url=r.url,
            created_at=r.created_at,
            updated_at=r.updated_at or r.created_at,
            latest_version_id=ver_id,
            latest_commit_sha=commit_sha,
            latest_status=ver_status,
            files_count=files_count,
            entities_count=entities_count
        ))

    activity_dtos: List[AnalysisActivityDTO] = []
    repo_name_map = {r.id: r.name for r in repos}
    
    for j in jobs[:10]:
        v = db.query(RepositoryVersion).filter(RepositoryVersion.id == j.repository_version_id).first()
        commit_sha = v.commit_sha if v else "latest"
        branch = v.branch if v else "main"
        r_name = repo_name_map.get(j.repository_id, "Repository")

        activity_dtos.append(AnalysisActivityDTO(
            id=str(j.id),
            repository_id=str(j.repository_id),
            repository_name=r_name,
            repository_version_id=str(j.repository_version_id),
            commit_sha=commit_sha,
            branch=branch,
            job_type=j.job_type or "full_analysis",
            status=j.status,
            progress=j.progress or (100.0 if j.status == 'COMPLETED' else 0.0),
            error=j.error,
            created_at=j.created_at,
            started_at=j.started_at,
            completed_at=j.completed_at
        ))

    health_metrics: List[CodebaseHealthDTO] = []

    if total_repos == 0:
        health_metrics.append(CodebaseHealthDTO(
            metric_name="Architecture Health",
            value="Not available",
            status="unavailable",
            explanation="No repositories connected yet."
        ))
    elif completed_analyses > 0:
        health_metrics.append(CodebaseHealthDTO(
            metric_name="Indexed Files",
            value=f"{total_files_indexed:,} files",
            status="healthy",
            explanation="Successfully parsed and indexed in Neo4j."
        ))

        health_metrics.append(CodebaseHealthDTO(
            metric_name="Graph Connectivity",
            value=f"{total_edges_mapped:,} edges",
            status="healthy",
            explanation="Mapped structural and dependency relationships."
        ))

        health_metrics.append(CodebaseHealthDTO(
            metric_name="External Dependencies",
            value=f"{total_external_packages} packages",
            status="healthy" if total_external_packages > 0 else "unavailable",
            explanation="Third-party package imports tracked across codebases."
        ))

        success_rate = int((completed_analyses / max(1, total_analyses)) * 100)
        health_metrics.append(CodebaseHealthDTO(
            metric_name="Analysis Success Rate",
            value=f"{success_rate}%",
            status="healthy" if success_rate >= 80 else ("warning" if success_rate >= 50 else "error"),
            explanation=f"{completed_analyses} of {total_analyses} analyses completed successfully."
        ))
    else:
        health_metrics.append(CodebaseHealthDTO(
            metric_name="Analysis Status",
            value="Pending initial analysis",
            status="warning",
            explanation="Start an analysis job to compute graph health metrics."
        ))

    metrics_dto = DashboardMetricsDTO(
        total_repositories=total_repos,
        active_repositories=active_repos,
        analyzing_repositories=analyzing_repos,
        failed_repositories=failed_repos,
        total_analyses=total_analyses,
        completed_analyses=completed_analyses,
        running_analyses=running_analyses,
        failed_analyses=failed_analyses,
        total_files_indexed=total_files_indexed,
        total_code_entities=total_code_entities
    )

    return DashboardOverviewDTO(
        organization=org_data,
        metrics=metrics_dto,
        recent_repositories=recent_repo_dtos[:6],
        analysis_activity=activity_dtos,
        health=health_metrics
    )


@router.get("/deep", response_model=DeepAnalyticsDTO)
def get_deep_analytics(
    repository_id: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    graph_service: GraphQueryService = Depends(get_graph_service)
):
    # 1. Resolve Target Repository
    target_repo = None
    if repository_id and repository_id not in ["all", "active", "default", "demo"]:
        try:
            repo_uuid = uuid.UUID(repository_id)
            target_repo = db.query(Repository).filter(Repository.id == repo_uuid, Repository.owner_id == user.id).first()
        except (ValueError, TypeError):
            target_repo = db.query(Repository).filter(Repository.name == repository_id, Repository.owner_id == user.id).first()
    
    if not target_repo:
        target_repo = db.query(Repository).filter(Repository.owner_id == user.id).order_by(Repository.created_at.desc()).first()

    if not target_repo:
        # Return clean empty structure if no repositories exist
        return DeepAnalyticsDTO(
            pipeline_metrics=PipelineMetricsDTO(
                total_repositories=0,
                total_files_indexed=0,
                total_entities=0,
                total_relationships=0,
                total_analyses=0,
                success_rate=0.0
            ),
            entity_distribution=[],
            relationship_distribution=[],
            top_packages=[],
            code_dense_files=[]
        )

    # 2. Get latest completed version for the repo
    latest_version = db.query(RepositoryVersion).filter(
        RepositoryVersion.repository_id == target_repo.id
    ).order_by(RepositoryVersion.created_at.desc()).first()

    version_id = str(latest_version.id) if latest_version else None
    commit_sha = latest_version.commit_sha if latest_version else "latest"
    branch = latest_version.branch if latest_version else target_repo.default_branch

    # 3. Pipeline execution metrics
    jobs = db.query(AnalysisJob).filter(AnalysisJob.repository_id == target_repo.id).order_by(AnalysisJob.created_at.desc()).all()
    total_analyses = len(jobs)
    completed_analyses = sum(1 for j in jobs if j.status == 'COMPLETED')
    success_rate = (completed_analyses / max(1, total_analyses)) * 100.0

    last_duration = None
    last_completed_at = None
    if jobs:
        latest_job = jobs[0]
        if latest_job.started_at and latest_job.completed_at:
            last_duration = (latest_job.completed_at - latest_job.started_at).total_seconds()
            last_completed_at = latest_job.completed_at

    # 4. Query Neo4j for Real Entity and Relationship Distribution
    entity_dist: List[EntityDistributionDTO] = []
    rel_dist: List[RelationshipDistributionDTO] = []
    top_packages: List[TopPackageDTO] = []
    code_dense_files: List[CodeDenseFileDTO] = []

    total_nodes = 0
    total_edges = 0
    total_files = 0

    ENTITY_COLORS = {
        "Function": "#3b82f6",       # Blue
        "File": "#10b981",           # Emerald
        "Directory": "#6366f1",      # Indigo
        "Class": "#8b5cf6",          # Violet
        "Method": "#ec4899",         # Pink
        "ExternalPackage": "#f59e0b", # Amber
        "RepositoryVersion": "#64748b" # Slate
    }

    RELATIONSHIP_COLORS = {
        "IMPORTS": "#3b82f6", # Blue
        "DEFINES": "#8b5cf6", # Purple
        "CONTAINS": "#10b981", # Green
        "CALLS": "#ec4899",   # Pink
        "INHERITS": "#f59e0b" # Amber
    }

    if version_id:
        try:
            with graph_service.driver.session() as session:
                # Query Entity breakdown
                q_entities = """
                MATCH (n:GraphNode {repository_version_id: $version_id})
                RETURN n.type AS entity_type, count(n) AS count
                ORDER BY count DESC
                """
                res_entities = session.run(q_entities, version_id=version_id)
                entity_rows = list(res_entities)
                total_nodes = sum(r["count"] for r in entity_rows)

                for r in entity_rows:
                    etype = r["entity_type"]
                    cnt = r["count"]
                    if etype == "File":
                        total_files = cnt
                    pct = round((cnt / max(1, total_nodes)) * 100, 1)
                    entity_dist.append(EntityDistributionDTO(
                        entity_type=etype,
                        count=cnt,
                        percentage=pct,
                        color=ENTITY_COLORS.get(etype, "#94a3b8")
                    ))

                # Query Relationship breakdown
                q_rels = """
                MATCH (src:GraphNode {repository_version_id: $version_id})-[r]->(tgt:GraphNode {repository_version_id: $version_id})
                RETURN type(r) AS rel_type, count(r) AS count
                ORDER BY count DESC
                """
                res_rels = session.run(q_rels, version_id=version_id)
                rel_rows = list(res_rels)
                total_edges = sum(r["count"] for r in rel_rows)

                for r in rel_rows:
                    rtype = r["rel_type"]
                    cnt = r["count"]
                    pct = round((cnt / max(1, total_edges)) * 100, 1)
                    rel_dist.append(RelationshipDistributionDTO(
                        relationship_type=rtype,
                        count=cnt,
                        percentage=pct,
                        color=RELATIONSHIP_COLORS.get(rtype, "#94a3b8")
                    ))

                # Query Top External Packages
                q_pkgs = """
                MATCH (f:GraphNode {type: 'File', repository_version_id: $version_id})-[r:IMPORTS]->(p:GraphNode {type: 'ExternalPackage'})
                RETURN p.name AS package_name, count(r) AS import_count
                ORDER BY import_count DESC LIMIT 10
                """
                res_pkgs = session.run(q_pkgs, version_id=version_id)
                pkg_rows = list(res_pkgs)
                total_pkg_imports = sum(r["import_count"] for r in pkg_rows)

                for r in pkg_rows:
                    pname = r["package_name"]
                    cnt = r["import_count"]
                    pct = round((cnt / max(1, total_pkg_imports)) * 100, 1)
                    top_packages.append(TopPackageDTO(
                        package_name=pname,
                        import_count=cnt,
                        percentage=pct
                    ))

                # Query Code Dense Files
                q_dense = """
                MATCH (f:GraphNode {type: 'File', repository_version_id: $version_id})-[r:DEFINES]->(sym:GraphNode)
                RETURN f.name AS file_name, count(sym) AS symbol_count, 
                       sum(CASE WHEN sym.type = 'Function' THEN 1 ELSE 0 END) AS functions,
                       sum(CASE WHEN sym.type = 'Class' THEN 1 ELSE 0 END) AS classes
                ORDER BY symbol_count DESC LIMIT 10
                """
                res_dense = session.run(q_dense, version_id=version_id)
                for r in res_dense:
                    code_dense_files.append(CodeDenseFileDTO(
                        file_name=r["file_name"],
                        symbol_count=r["symbol_count"],
                        functions_count=r["functions"],
                        classes_count=r["classes"]
                    ))

        except Exception as ex:
            print(f"Error querying deep graph analytics: {ex}")

    pipeline_metrics = PipelineMetricsDTO(
        total_repositories=1,
        total_files_indexed=total_files,
        total_entities=total_nodes,
        total_relationships=total_edges,
        total_analyses=total_analyses,
        success_rate=round(success_rate, 1),
        last_analysis_duration_seconds=round(last_duration, 1) if last_duration is not None else None,
        last_analyzed_at=last_completed_at
    )

    return DeepAnalyticsDTO(
        repository_id=str(target_repo.id),
        repository_name=target_repo.name,
        repository_full_name=target_repo.full_name,
        version_id=version_id,
        commit_sha=commit_sha,
        branch=branch,
        pipeline_metrics=pipeline_metrics,
        entity_distribution=entity_dist,
        relationship_distribution=rel_dist,
        top_packages=top_packages,
        code_dense_files=code_dense_files
    )
