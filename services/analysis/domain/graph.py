from typing import List
from pydantic import BaseModel
from .nodes import GraphNode
from .relationships import GraphEdge

class CanonicalGraph(BaseModel):
    repository_version_id: str
    nodes: List[GraphNode] = []
    edges: List[GraphEdge] = []
