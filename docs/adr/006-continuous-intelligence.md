# ADR 006: Continuous Intelligence & Incremental Updates

## Context
CodeGraph currently executes a full batch analysis of repositories. To scale, we must process updates incrementally upon GitHub Webhook delivery.

## Decision
1. **Webhook Processing**: We will expose a `POST /api/v1/webhooks/github` endpoint secured via HMAC SHA-256 validation. It will persist events with `provider` and `delivery_id` as a unique compound key to guarantee idempotency.
2. **Copy-on-Write Graph**: New commits generate a new `RepositoryVersion`. The Neo4j graph is constructed by cloning unchanged elements from the parent version and appending/patching only the changed files and relationships. Parent graphs remain completely immutable.
3. **Incremental Semantic Indexing**: Qdrant embeddings for unchanged chunks are reused across versions by assigning a new deterministic `repository_version_id`-scoped ID and saving the existing vector array. This drastically reduces OpenAI embedding costs.
4. **Fallback Mechanism**: A strict fallback to `FULL_ANALYSIS` occurs if the change threshold exceeds 20% or if the parent version history is disconnected/missing.

## Consequences
- Requires careful handling of Neo4j node IDs across versions.
- Ensures historical versions remain intact for the 2D Explorer and 3D Universe.
- Greatly speeds up ingestion for normal pushes.
- Substantially reduces embedding token costs.
