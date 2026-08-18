# ADR 008: Multi Tenant Data Isolation

## Status
Approved

## Context
CodeGraph is transitioning to an Enterprise model where Organizations own repositories. We must guarantee that one Organization cannot read or query the Code Intelligence graphs or AI embeddings of another Organization.

## Decision
- **Postgres**: All relationships flow through `organization_id`. Repositories, Members, and Jobs are hard-linked to an Organization.
- **Neo4j**: Every graph query (Impact Analysis, Subsystem Detection, etc.) must explicitly filter by `repository_version_id`. Since a version maps 1:1 to a Repository, and a Repository maps 1:1 to an Organization, this provides strict logical isolation. Future graph deployments can leverage Neo4j multi-database features, but for this milestone, strict Cypher scoping is used.
- **Qdrant**: Every vector payload must include `organization_id`, `repository_id`, and `repository_version_id`. All vector searches MUST apply a `Must` filter on `organization_id`.

## Consequences
- Prevents cross-tenant AI leakage.
- Ensures robust security boundaries.
