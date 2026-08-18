# pyrefly: ignore-all-errors
# type: ignore
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging

from src.db.models.repository import RepositoryVersion
from src.api.deps import get_authorized_repository_version
from src.core.config import settings

from services.analysis.graph.query import GraphQueryService
from services.analysis.vector.qdrant import QdrantVectorStore
from src.services.ai.retrievers import HybridRetriever
from src.services.ai.context import ContextBuilder
from src.services.ai.llm import get_llm_provider

router = APIRouter()

class AIQueryRequest(BaseModel):
    question: str
    selected_node_id: Optional[str] = None

class AISourceCitation(BaseModel):
    source_type: str
    file_path: Optional[str] = None
    node_id: Optional[str] = None
    symbol_name: Optional[str] = None
    line_start: Optional[int] = None
    line_end: Optional[int] = None

class AIQueryResponse(BaseModel):
    answer: str
    sources: List[AISourceCitation]
    retrieval_metadata: Dict[str, Any]

def get_hybrid_retriever() -> HybridRetriever:
    graph_service = GraphQueryService(
        uri=settings.NEO4J_URI,
        user=settings.NEO4J_USER,
        password=settings.NEO4J_PASSWORD
    )
    vector_store = QdrantVectorStore()
    return HybridRetriever(graph_service, vector_store)

@router.post("/{repository_id}/versions/{version_id}/ai/query", response_model=AIQueryResponse)
def ask_ai_query(
    repository_id: str,
    version_id: str,
    request: AIQueryRequest,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    retriever: HybridRetriever = Depends(get_hybrid_retriever)
):
    # Readiness check (assuming version.status holds indexing state)
    # We allow "completed" (from graph analysis) but ideally we'd check if semantic index exists.
    # We will let the retriever try, but if it fails gracefully, it's handled.
    
    try:
        evidence = retriever.retrieve(version_id, request.question, request.selected_node_id)
        
        context_builder = ContextBuilder(max_tokens=4000)
        context_string = context_builder.build_context_string(evidence)
        
        llm = get_llm_provider()
        answer = llm.generate_answer(request.question, context_string)
        
        # Build provenance citations
        sources = []
        for ev in evidence:
            sources.append(AISourceCitation(
                source_type=ev.source_type,
                file_path=ev.metadata.get("file_path"),
                node_id=ev.metadata.get("node_id"),
                symbol_name=ev.metadata.get("symbol_name"),
                line_start=ev.metadata.get("line_start"),
                line_end=ev.metadata.get("line_end")
            ))
            
        return AIQueryResponse(
            answer=answer,
            sources=sources,
            retrieval_metadata={"evidence_count": len(evidence)}
        )
        
    except Exception as e:
        logging.error(f"AI Query failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process AI query. Ensure services are available.")
    finally:
        retriever.graph.graph_service.close()
