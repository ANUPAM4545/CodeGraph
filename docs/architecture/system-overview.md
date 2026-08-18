# Architecture System Overview

CodeGraph uses a modular architecture combining a Next.js frontend with a FastAPI backend.

## Boundaries
- **Frontend**: Handles user interaction, 2D/3D visualization using a unified graph representation.
- **Backend (FastAPI)**: Serves REST endpoints for the frontend. Coordinates job creation and database interaction.
- **Analysis Engine**: A background worker pattern (via Redis) to perform heavy AST parsing, symbol extraction, and embedding generation.
- **Databases**:
  - PostgreSQL: Transactional data (Users, Repositories, Analysis Jobs).
  - Neo4j: The Code Knowledge Graph.
  - Qdrant: Semantic code search embeddings.
  - Redis: Job queue and caching.
