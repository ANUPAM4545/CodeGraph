from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class GraphNodeDTO(BaseModel):
    id: str
    type: str
    label: str
    repository_version_id: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class GraphEdgeDTO(BaseModel):
    id: str
    type: str
    source: str
    target: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class GraphDTO(BaseModel):
    nodes: List[GraphNodeDTO]
    edges: List[GraphEdgeDTO]

class GraphOverviewDTO(BaseModel):
    repository_version_id: str
    total_nodes: int
    total_edges: int
    directories: int
    files: int
    classes: int
    functions: int
    methods: int
    variables: int
    parameters: int
    external_packages: int
    imports: int
    calls: int
    inheritance_relationships: int

class NodeRelationshipDTO(BaseModel):
    id: Optional[str] = None
    type: str
    connected_node_id: str
    connected_node_name: Optional[str] = None
    connected_node_type: Optional[str] = None
    direction: str  # 'INCOMING' | 'OUTGOING'

class NodeDetailDTO(BaseModel):
    id: str
    type: str
    name: Optional[str] = None
    file_path: Optional[str] = None
    qualified_name: Optional[str] = None
    line_start: Optional[int] = None
    line_end: Optional[int] = None
    language: Optional[str] = None
    description: Optional[str] = None
    source_code: Optional[str] = None
    github_url: Optional[str] = None
    repository_id: Optional[str] = None
    repository_version_id: Optional[str] = None
    commit_sha: Optional[str] = None
    branch: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[str] = None
    children_count: Optional[int] = None
    properties: Dict[str, Any] = Field(default_factory=dict)
    incoming_relationships: List[NodeRelationshipDTO] = Field(default_factory=list)
    outgoing_relationships: List[NodeRelationshipDTO] = Field(default_factory=list)


