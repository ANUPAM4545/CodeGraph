# CodeGraph - Hybrid Code Intelligence Engine

## 1. Overview
The CodeGraph AI Intelligence Engine is designed to provide grounded, evidence-based answers to user queries about repository codebases. It is explicitly NOT a generic conversational chatbot.

The architecture relies on a **Hybrid Retrieval** strategy:
- **Structural Graph Intelligence**: Provided by Neo4j (via Tree-sitter parsed canonical AST graph).
- **Semantic Code Retrieval**: Provided by Qdrant (via dense vector embeddings of code chunks).
- **Grounded LLM Synthesis**: Provided by an LLM that is strictly constrained to use only retrieved evidence.

## 2. Job Architecture & Lifecycle
To ensure independent resilience, Graph Analysis and Semantic Indexing run as separate jobs:

1. **GRAPH_ANALYSIS**: Parses Python files, resolves symbol boundaries, builds the Canonical Graph, and persists to Neo4j.
2. **SEMANTIC_INDEX**: Automatically dispatched via RQ upon successful graph completion. It fetches canonical nodes from the graph to create exact source line chunks, generates embeddings, and persists to Qdrant.

Failure of the `SEMANTIC_INDEX` job does not invalidate the `GRAPH_ANALYSIS` job. The 2D Graph Explorer remains functional even if semantic AI is temporarily unavailable.

## 3. Qdrant & Embedding Strategy
- **Vector Store**: Qdrant is used with a single unified collection: `codegraph_chunks`. All queries are scoped using Qdrant payload filters on `repository_version_id` to strictly isolate data.
- **Embedding Provider**: We use a modular `EmbeddingProvider` interface. The MVP implementation uses `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions). This is lightweight and fast for local development, and the interface permits swapping to specialized code embedding models (e.g., text-embedding-3-small) in production.
- **Code-Aware Chunking**: Chunks are aligned exactly with canonical AST nodes (Classes, Methods, Functions).
- **Deterministic Vectors**: Point IDs are generated as UUID v5 hashes of `repository_version_id + file_path + node_identity`. This ensures idempotency.
- **Stale Vector Cleanup**: When re-indexing an existing version, new points are upserted first, and then obsolete IDs belonging to that version are deleted. The index is not completely dropped, providing resilience against partial indexing failures.

## 4. Hybrid Retriever
The `HybridRetriever` implements heuristic intent classification to route queries:
- **DEPENDENCY**: Invokes graph traversal (`CALLED_BY`, `CALLS`).
- **SYMBOL_LOOKUP**: Prioritizes exact graph matching and shallow neighborhood retrieval.
- **GENERAL_EXPLANATION / ARCHITECTURE**: Relies primarily on dense semantic retrieval.
- **Node Selection**: If a user selects a node on the frontend and asks a question, the retriever extracts the exact graph context of the node, scoring it as maximum relevance.

## 5. Context Builder & Token Limits
The `ContextBuilder` aggregates results from the Graph and Semantic Retrievers. It deduplicates based on content and ranks graph exact matches highly. It respects a hard token budget (e.g., ~6000 tokens) to ensure the LLM never hits a `context_length_exceeded` error, gracefully truncating lower-priority evidence.

## 6. Grounding and Hallucination Controls
The `LLMProvider` is hardcoded with a deterministic temperature (`0.0`) and a strict system prompt instructing the model to:
- NEVER invent files, functions, or relationships.
- Clearly state if the provided repository context is insufficient.
- Cite exact line numbers and paths.

Every piece of evidence passed into the context string contains explicit `[CODE_CHUNK]` or `[GRAPH_NODE]` provenance metadata, which is echoed by the LLM and matched by the API into interactive `SourceCitation` blocks on the frontend.

## 7. Known Limitations & Runtime Verification
- **Test Sandbox**: Due to the absence of active PostgreSQL, Redis, Neo4j, and Qdrant instances in the build environment, tests are statically verified and use mocks. True End-to-End runtime verification requires a fully spun-up local compose cluster.
- **Scalability**: MiniLM handles individual chunks well, but very large monolithic functions might exceed context lengths if not further sub-chunked (currently not implemented).
- **No Agents**: The system strictly retrieves and explains. It cannot execute code, mutate the repository, or perform autonomous debugging workflows.
