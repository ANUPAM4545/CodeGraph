from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class VectorPoint(BaseModel):
    id: str  # Deterministic UUID string
    vector: List[float]
    payload: Dict[str, Any]

class ScoredPoint(BaseModel):
    id: str
    score: float
    payload: Dict[str, Any]

class VectorStore(ABC):
    """
    Abstract vector database interface.
    """
    
    @abstractmethod
    def ensure_collection(self, collection_name: str, dimension: int):
        pass
        
    @abstractmethod
    def upsert(self, collection_name: str, points: List[VectorPoint]):
        pass
        
    @abstractmethod
    def search(
        self, 
        collection_name: str, 
        query_vector: List[float], 
        repository_version_id: str, 
        limit: int = 10
    ) -> List[ScoredPoint]:
        pass
        
    @abstractmethod
    def delete_by_ids(self, collection_name: str, point_ids: List[str], repository_version_id: str):
        pass
        
    @abstractmethod
    def get_existing_ids(self, collection_name: str, repository_version_id: str) -> List[str]:
        """Fetch all point IDs for a given repository version (for stale cleanup)."""
        pass
