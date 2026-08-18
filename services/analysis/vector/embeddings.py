from abc import ABC, abstractmethod
from typing import List

class EmbeddingProvider(ABC):
    """
    Abstract provider for generating text embeddings.
    Allows swapping the underlying embedding model (e.g. sentence-transformers, OpenAI, etc).
    """
    
    @property
    @abstractmethod
    def dimension(self) -> int:
        """Return the vector dimension of the embedding model."""
        pass

    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        """Embed a single text string."""
        pass

    @abstractmethod
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a batch of text strings."""
        pass


class MiniLMEmbeddingProvider(EmbeddingProvider):
    """
    Default embedding provider using sentence-transformers/all-MiniLM-L6-v2.
    Dimensionality: 384
    """
    
    def __init__(self):
        try:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer('all-MiniLM-L6-v2')
            self._dimension = 384
        except ImportError:
            # We allow it to fail at runtime if dependencies are missing, 
            # but provide a fallback or raise a clear error.
            # In our static environment, we mock it.
            self._model = None
            self._dimension = 384

    @property
    def dimension(self) -> int:
        return self._dimension

    def embed_text(self, text: str) -> List[float]:
        if not self._model:
            # Mock behavior for static environment
            return [0.0] * self.dimension
        return self._model.encode(text).tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not self._model:
            # Mock behavior for static environment
            return [[0.0] * self.dimension for _ in texts]
        return self._model.encode(texts).tolist()

# Factory function
def get_embedding_provider() -> EmbeddingProvider:
    return MiniLMEmbeddingProvider()
