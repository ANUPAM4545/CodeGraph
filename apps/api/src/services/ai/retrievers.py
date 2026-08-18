from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from services.analysis.graph.query import GraphQueryService
from services.analysis.vector.qdrant import QdrantVectorStore
from services.analysis.vector.embeddings import get_embedding_provider
import logging

class RetrievedEvidence(BaseModel):
    source_type: str  # "CODE_CHUNK", "GRAPH_NODE", "GRAPH_RELATIONSHIP"
    score: float
    content: str
    metadata: Dict[str, Any]

class GraphRetriever:
    def __init__(self, graph_service: GraphQueryService):
        self.graph_service = graph_service
        
    def retrieve_symbol(self, version_id: str, symbol_name: str) -> List[RetrievedEvidence]:
        nodes = self.graph_service.search_nodes(version_id, symbol_name, limit=5)
        evidence = []
        for n in nodes:
            # For each matched node, fetch a shallow neighborhood to get context
            neighbors = self.graph_service.get_neighbors(version_id, n.id, direction="BOTH", depth=1, limit=50)
            
            # Format node context
            content = f"SYMBOL: {n.label}\nTYPE: {n.type}\nPATH: {n.metadata.get('file_path')}"
            
            # Format relationships
            rels = []
            for edge in neighbors.edges:
                if edge.source == n.id:
                    tgt = next((x.label for x in neighbors.nodes if x.id == edge.target), edge.target)
                    rels.append(f"OUTGOING: {edge.type} -> {tgt}")
                elif edge.target == n.id:
                    src = next((x.label for x in neighbors.nodes if x.id == edge.source), edge.source)
                    rels.append(f"INCOMING: {src} -> {edge.type}")
                    
            if rels:
                content += "\nRELATIONSHIPS:\n" + "\n".join(rels)
                
            evidence.append(RetrievedEvidence(
                source_type="GRAPH_NODE",
                score=0.9, # High score for exact graph match
                content=content,
                metadata={"node_id": n.id, "file_path": n.metadata.get("file_path"), "symbol_name": n.label}
            ))
            
        return evidence

class SemanticRetriever:
    def __init__(self, vector_store: QdrantVectorStore):
        self.vector_store = vector_store
        self.embedding_provider = get_embedding_provider()
        
    def search(self, version_id: str, query: str, top_k: int = 5) -> List[RetrievedEvidence]:
        query_vector = self.embedding_provider.embed_text(query)
        results = self.vector_store.search(
            collection_name="codegraph_chunks",
            query_vector=query_vector,
            repository_version_id=version_id,
            limit=top_k
        )
        
        evidence = []
        for r in results:
            evidence.append(RetrievedEvidence(
                source_type="CODE_CHUNK",
                score=r.score,
                content=r.payload.get("content", ""),
                metadata={
                    "file_path": r.payload.get("file_path"),
                    "node_id": r.payload.get("node_id"),
                    "symbol_name": r.payload.get("symbol_name"),
                    "line_start": r.payload.get("line_start"),
                    "line_end": r.payload.get("line_end")
                }
            ))
        return evidence

class HybridRetriever:
    """
    Orchestrates Query Intent, Graph Retrieval, and Semantic Retrieval.
    """
    def __init__(self, graph_service: GraphQueryService, vector_store: QdrantVectorStore):
        self.graph = GraphRetriever(graph_service)
        self.semantic = SemanticRetriever(vector_store)
        
    def _classify_intent(self, query: str) -> str:
        q_lower = query.lower()
        if any(word in q_lower for word in ["calls", "depends", "dependency", "invokes"]):
            return "DEPENDENCY"
        if any(word in q_lower for word in ["where is", "find", "show me", "implemented"]):
            return "SYMBOL_LOOKUP"
        if any(word in q_lower for word in ["change", "commit", "affect", "impact", "diff", "modified"]):
            return "CHANGE_IMPACT"
        if any(word in q_lower for word in ["architecture", "overview", "explain the codebase"]):
            return "ARCHITECTURE"
        return "GENERAL_EXPLANATION"
        
    def retrieve(self, version_id: str, query: str, selected_node_id: Optional[str] = None) -> List[RetrievedEvidence]:
        intent = self._classify_intent(query)
        evidence = []
        
        logging.info(f"Hybrid Retrieval Intent: {intent}")
        
        # 1. Base semantic search (always good for context)
        sem_evidence = self.semantic.search(version_id, query, top_k=5)
        evidence.extend(sem_evidence)
        
        # 2. Heuristic Graph Augmentation
        # If the user asked about a specific symbol by name, look it up in the graph
        # We do a naive token intersection or just rely on selected_node_id
        if selected_node_id:
            # We fetch exactly this node's graph context
            # (We will implement this by doing a lookup using graph_service directly)
            neighbors = self.graph.graph_service.get_neighbors(version_id, selected_node_id, direction="BOTH", depth=1)
            # Find main node
            main_node = next((n for n in neighbors.nodes if n.id == selected_node_id), None)
            if main_node:
                content = f"SELECTED NODE: {main_node.label}\nTYPE: {main_node.type}\nPATH: {main_node.metadata.get('file_path')}\n"
                rels = []
                for edge in neighbors.edges:
                    if edge.source == selected_node_id:
                        tgt = next((x.label for x in neighbors.nodes if x.id == edge.target), edge.target)
                        rels.append(f"CALLS/OUT: {edge.type} -> {tgt}")
                    else:
                        src = next((x.label for x in neighbors.nodes if x.id == edge.source), edge.source)
                        rels.append(f"CALLED_BY/IN: {src} -> {edge.type}")
                content += "\n".join(rels)
                
                evidence.append(RetrievedEvidence(
                    source_type="GRAPH_NODE",
                    score=1.0,
                    content=content,
                    metadata={"node_id": selected_node_id, "file_path": main_node.metadata.get("file_path"), "symbol_name": main_node.label}
                ))
                
        elif intent in ["SYMBOL_LOOKUP", "DEPENDENCY"]:
            # Very crude extraction of possible camelCase or snake_case symbols from query
            words = [w for w in query.replace("?", "").split() if "_" in w or not w.islower()]
            for word in words:
                if len(word) > 3:
                    graph_ev = self.graph.retrieve_symbol(version_id, word)
                    evidence.extend(graph_ev)
                    
        elif intent == "ARCHITECTURE":
            arch_summary = "ARCHITECTURE SUMMARY:\nAnalyzed subsystems and modules indexed in Neo4j graph."
            if hasattr(self.graph, "driver"):
                try:
                    from src.services.analysis.graph.architecture import SubsystemDetector
                    sub_detector = SubsystemDetector(self.graph.driver)
                    subs = sub_detector.detect_subsystems(version_id)
                    if subs:
                        sub_names = ", ".join([s["name"] for s in subs[:5]])
                        arch_summary = f"ARCHITECTURE SUMMARY:\nSubsystems: {sub_names}\nTotal Modules: {len(subs)}"
                except Exception:
                    pass
            evidence.append(RetrievedEvidence(
                source_type="GRAPH_ARCHITECTURE",
                score=1.0,
                content=arch_summary,
                metadata={"architecture_context": True}
            ))

        elif intent == "CHANGE_IMPACT":
            if selected_node_id:
                impact_summary = f"IMPACT for {selected_node_id}: Analyzing direct callers and dependencies."
                if hasattr(self.graph, "driver"):
                    try:
                        from src.services.analysis.graph.impact import ImpactAnalysisService
                        impact_svc = ImpactAnalysisService(self.graph.driver)
                        res = impact_svc.analyze_impact(version_id, selected_node_id, depth=1)
                        impact_summary = f"IMPACT for {selected_node_id}:\nCallers: {len(res.callers)}\nDependencies: {len(res.direct_dependencies)}\nAffected Subsystems: {len(res.affected_modules)}"
                    except Exception:
                        pass
                evidence.append(RetrievedEvidence(
                    source_type="GRAPH_IMPACT",
                    score=1.0,
                    content=impact_summary,
                    metadata={"node_id": selected_node_id, "impact_context": True}
                ))
                    
        # 3. Deduplicate and Rank
        unique_ev = self._rank_and_deduplicate(evidence)
        
        # 4. Assess Evidence Quality
        has_graph = any(e.source_type.startswith("GRAPH") for e in unique_ev)
        has_semantic = any(e.source_type == "CODE_CHUNK" and e.score > 0.8 for e in unique_ev)
        
        quality = "LIMITED"
        if has_graph and has_semantic:
            quality = "STRONG"
        elif has_graph or has_semantic:
            quality = "MODERATE"
            
        logging.info(f"Retrieval Quality: {quality}")
        # In a real app, quality might be attached to the result wrapper.
        
        return unique_ev
        
    def _rank_and_deduplicate(self, evidence: List[RetrievedEvidence]) -> List[RetrievedEvidence]:
        # Simple deduplication by content hash (approximate)
        seen = set()
        unique = []
        for ev in evidence:
            # Combine type and a hash of the content
            ident = f"{ev.source_type}::{hash(ev.content)}"
            if ident not in seen:
                seen.add(ident)
                unique.append(ev)
                
        # Rank: Graph exact matches > high score semantic
        unique.sort(key=lambda x: (x.source_type.startswith("GRAPH"), x.score), reverse=True)
        return unique
