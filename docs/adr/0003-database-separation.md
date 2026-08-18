# ADR 0003: Database Separation

## Status
Accepted

## Context
CodeGraph needs to store standard application data, code graph data, and embeddings for semantic search.

## Decision
We will use:
- **PostgreSQL**: Transactional application data (Users, Repositories).
- **Neo4j**: Code knowledge graph (AST entities, Relationships).
- **Qdrant**: Semantic/vector search for code chunks.

## Consequences
- Data is appropriately modeled for its access pattern.
- Operational overhead is higher due to managing three separate database technologies.
