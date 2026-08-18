from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.services.security import get_current_user
from src.db.models.user import User
from src.db.models.repository import RepositoryVersion
from src.api.deps import get_authorized_repository_version
from src.schemas.graph import GraphDTO, GraphNodeDTO, GraphOverviewDTO, NodeDetailDTO
from services.analysis.graph.query import GraphQueryService
from src.core.config import settings

router = APIRouter()

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

@router.get("/{repository_id}/versions/{version_id}/graph/overview", response_model=GraphOverviewDTO)
def get_graph_overview(
    repository_id: str,
    version_id: str,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    graph_service: GraphQueryService = Depends(get_graph_service)
):
    return graph_service.get_overview(str(version.id))

@router.get("/{repository_id}/versions/{version_id}/graph", response_model=GraphDTO)
def get_graph(
    repository_id: str,
    version_id: str,
    node_types: Optional[str] = Query(None, description="Comma separated list of node types"),
    relationship_types: Optional[str] = Query(None, description="Comma separated list of relationship types"),
    limit: int = Query(500, le=2000, description="Max nodes to return"),
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    graph_service: GraphQueryService = Depends(get_graph_service)
):
    ntypes = node_types.split(",") if node_types else None
    rtypes = relationship_types.split(",") if relationship_types else None
    
    return graph_service.get_subgraph(
        version_id=str(version.id),
        node_types=ntypes,
        rel_types=rtypes,
        limit=limit
    )

@router.get("/{repository_id}/versions/{version_id}/graph/nodes/search", response_model=List[GraphNodeDTO])
def search_graph_nodes(
    repository_id: str,
    version_id: str,
    q: str = Query(..., min_length=2),
    limit: int = Query(50, le=200),
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    graph_service: GraphQueryService = Depends(get_graph_service)
):
    return graph_service.search_nodes(version_id=str(version.id), query=q, limit=limit)

@router.get("/{repository_id}/versions/{version_id}/graph/nodes/{node_id}", response_model=GraphNodeDTO)
def get_graph_node(
    repository_id: str,
    version_id: str,
    node_id: str,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    graph_service: GraphQueryService = Depends(get_graph_service)
):
    node = graph_service.get_node(version_id=str(version.id), node_id=node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found in this repository version")
    return node

@router.get("/{repository_id}/versions/{version_id}/graph/nodes/{node_id}/details", response_model=NodeDetailDTO)
def get_node_details(
    repository_id: str,
    version_id: str,
    node_id: str,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    graph_service: GraphQueryService = Depends(get_graph_service)
):
    repo_url = version.repository.url if hasattr(version, 'repository') and version.repository else None
    details = graph_service.get_node_details(
        version_id=str(version.id),
        node_id=node_id,
        repo_url=repo_url,
        commit_sha=version.commit_sha
    )
    if not details:
        raise HTTPException(status_code=404, detail="Node not found in this repository version")
    return details

@router.get("/{repository_id}/versions/{version_id}/graph/nodes/{node_id}/neighbors", response_model=GraphDTO)
def get_node_neighbors(
    repository_id: str,
    version_id: str,
    node_id: str,
    direction: str = Query("BOTH", regex="^(INCOMING|OUTGOING|BOTH)$"),
    relationship_types: Optional[str] = Query(None),
    depth: int = Query(1, ge=1, le=3),
    limit: int = Query(500, le=2000),
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    graph_service: GraphQueryService = Depends(get_graph_service)
):
    rtypes = relationship_types.split(",") if relationship_types else None
    
    # First verify node exists
    node = graph_service.get_node(version_id=str(version.id), node_id=node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
        
    return graph_service.get_neighbors(
        version_id=str(version.id),
        node_id=node_id,
        direction=direction,
        rel_types=rtypes,
        depth=depth,
        limit=limit
    )
