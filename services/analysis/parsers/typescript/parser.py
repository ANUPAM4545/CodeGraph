from typing import Tuple, List, Dict, Any
from .extractor import TypeScriptExtractor
from services.analysis.domain.nodes import GraphNode
from services.analysis.domain.relationships import GraphEdge

class TypeScriptParser:
    """
    Parser interface for TypeScript/JavaScript files.
    """
    def __init__(self):
        pass

    def parse_file(self, version_id: str, file_path: str, source_code: bytes) -> Tuple[List[GraphNode], List[GraphEdge], dict]:
        extractor = TypeScriptExtractor(version_id=version_id, file_path=file_path, source_code=source_code)
        return extractor.extract()
