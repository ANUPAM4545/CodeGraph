import pytest
from services.ai.retrievers import HybridRetriever, RetrievedEvidence
from services.ai.context import ContextBuilder
from services.analysis.vector.chunking import generate_deterministic_uuid

class MockGraphService:
    def get_neighbors(self, version_id, node_id, direction, depth):
        class MockNeighbors:
            nodes = []
            edges = []
        return MockNeighbors()
        
class MockVectorStore:
    def search(self, *args, **kwargs):
        return []

def test_deterministic_uuid():
    u1 = generate_deterministic_uuid("v1", "main.py", "Class::App::1::10")
    u2 = generate_deterministic_uuid("v1", "main.py", "Class::App::1::10")
    u3 = generate_deterministic_uuid("v1", "main.py", "Function::run::11::20")
    
    assert u1 == u2
    assert u1 != u3
    
def test_hybrid_intent_classification():
    retriever = HybridRetriever(MockGraphService(), MockVectorStore())
    
    assert retriever._classify_intent("where is authentication implemented") == "SYMBOL_LOOKUP"
    assert retriever._classify_intent("what calls authenticate_user") == "DEPENDENCY"
    assert retriever._classify_intent("explain the architecture") == "ARCHITECTURE"
    assert retriever._classify_intent("how does it work") == "GENERAL_EXPLANATION"

def test_context_builder_budget():
    builder = ContextBuilder(max_tokens=20)  # 80 chars max
    evidence = [
        RetrievedEvidence(source_type="CODE_CHUNK", score=1.0, content="this is a short block", metadata={}),
        RetrievedEvidence(source_type="CODE_CHUNK", score=0.9, content="this is another block that should be truncated because it is long", metadata={})
    ]
    
    context = builder.build_context_string(evidence)
    # The first block with headers is around 30-40 chars. Second block should not be fully added.
    assert "this is a short block" in context
    assert "truncated" not in context
