from abc import ABC, abstractmethod
from typing import List
from services.analysis.domain.graph import CanonicalGraph

class GraphRepository(ABC):
    @abstractmethod
    def save_graph(self, graph: CanonicalGraph) -> None:
        """
        Persists the entire CanonicalGraph (nodes and edges) to the backend.
        Must handle idempotent updates (e.g. deleting old version graph first).
        """
        pass
        
    @abstractmethod
    def delete_version_graph(self, repository_version_id: str) -> None:
        """
        Deletes all nodes and edges associated with a specific repository version.
        """
        pass
