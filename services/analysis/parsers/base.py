from abc import ABC, abstractmethod
from typing import Optional
from services.analysis.domain.graph import CanonicalGraph

class LanguageAnalyzer(ABC):
    """
    Base abstraction for a language-specific analyzer.
    """
    
    @abstractmethod
    def can_handle(self, file_path: str) -> bool:
        """Return True if this analyzer can parse the given file."""
        pass
        
    @abstractmethod
    def analyze(self, file_path: str, source_code: bytes, repository_version_id: str) -> Optional[CanonicalGraph]:
        """
        Parse the source code and return a CanonicalGraph containing nodes and edges.
        Returns None if the file was skipped or unparsable.
        """
        pass
