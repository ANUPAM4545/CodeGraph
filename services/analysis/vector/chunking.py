import hashlib
import uuid
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class CodeChunk(BaseModel):
    id: str  # Deterministic UUID
    repository_id: str
    repository_version_id: str
    file_path: str
    node_id: Optional[str]
    chunk_type: str  # e.g. "Class", "Function", "Method", "File"
    language: str
    symbol_name: Optional[str]
    qualified_name: Optional[str]
    line_start: int
    line_end: int
    content: str
    content_hash: str

def generate_deterministic_uuid(repository_version_id: str, file_path: str, chunk_identity: str) -> str:
    """
    Generate a deterministic UUID v5-like identifier for Qdrant points based on stable keys.
    """
    raw = f"{repository_version_id}::{file_path}::{chunk_identity}"
    # Qdrant accepts standard UUIDs. We generate one using MD5 hash of our unique string.
    m = hashlib.md5(raw.encode('utf-8'))
    return str(uuid.UUID(m.hexdigest()))

def hash_content(content: str) -> str:
    """Generate a stable hash for the text content."""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def extract_chunks_from_file(
    repository_id: str,
    repository_version_id: str,
    file_path: str,
    source_text: str,
    language: str,
    canonical_nodes: List[Dict[str, Any]]
) -> List[CodeChunk]:
    """
    Given a file's source text and its extracted canonical AST nodes (from Neo4j or Parser),
    generate code-aware chunks.
    canonical_nodes should be a list of dicts with:
    {
      "id": str,
      "type": str,
      "name": str,
      "qualified_name": str,
      "start_line": int,
      "end_line": int
    }
    """
    chunks = []
    lines = source_text.splitlines(keepends=True)
    
    for node in canonical_nodes:
        # 1-indexed lines
        start = node.get("start_line", 1)
        end = node.get("end_line", len(lines))
        
        # Guard bounds
        start_idx = max(0, start - 1)
        end_idx = min(len(lines), end)
        
        chunk_content = "".join(lines[start_idx:end_idx])
        chunk_content = chunk_content.strip()
        if not chunk_content:
            continue
            
        c_hash = hash_content(chunk_content)
        chunk_identity = f"{node['type']}::{node.get('qualified_name', node.get('name', ''))}::{start}::{end}"
        point_id = generate_deterministic_uuid(repository_version_id, file_path, chunk_identity)
        
        chunks.append(CodeChunk(
            id=point_id,
            repository_id=repository_id,
            repository_version_id=repository_version_id,
            file_path=file_path,
            node_id=node.get("id"),
            chunk_type=node.get("type", "Unknown"),
            language=language,
            symbol_name=node.get("name"),
            qualified_name=node.get("qualified_name"),
            line_start=start,
            line_end=end,
            content=chunk_content,
            content_hash=c_hash
        ))
        
    return chunks
