# ADR 011: Enterprise Resource Governance

## Status
Approved

## Context
To offer SaaS tiers (FREE, TEAM, ENTERPRISE) and prevent "noisy neighbor" problems, CodeGraph must implement resource governance across Organizations.

## Decision
- **Quotas**: `Organization` model is designed to support repository limits, AI token quotas, and storage limits.
- **Graph Governance**: All Neo4j queries must have a `LIMIT` (e.g. `LIMIT 1000` for subsystem detection) and enforce `dbms.transaction.timeout` to prevent massive repositories from locking the graph database.
- **Frontend LOD**: The 2D React Flow and 3D React Three Fiber interfaces implement viewport-based and chunk-based lazy loading to prevent client-side Out Of Memory crashes on graphs exceeding 100k nodes.

## Consequences
- Provides clear boundaries for SaaS billing plans.
- Stabilizes infrastructure against massive mono-repos.
