from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
import hashlib

class GraphEdge(BaseModel):
    id: str
    type: str
    source_id: str
    target_id: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class EdgeIdentityGenerator:
    @staticmethod
    def _hash(val: str) -> str:
        return hashlib.sha256(val.encode('utf-8')).hexdigest()
        
    @classmethod
    def edge_id(cls, source_id: str, target_id: str, type_name: str, context: str = "") -> str:
        # A deterministic hash for an edge, preventing duplicate identical edges between nodes.
        return cls._hash(f"{source_id}:{type_name}:{target_id}:{context}")
