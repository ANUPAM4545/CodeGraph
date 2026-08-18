# Enterprise Platform Architecture

## Overview
Milestone 9 elevates CodeGraph into a multi-tenant enterprise code intelligence platform. The architecture revolves around `Organization` tenancy, centralized RBAC, scalable background orchestration, and governed graph analysis.

## Multi Tenancy Model
- **Organizations**: The highest boundary of isolation. A user accesses repositories by being an `OrganizationMember`.
- **Isolation Enforcement**: 
  - *Postgres*: `organization_id` foreign keys.
  - *Neo4j*: Explicit filter on `repository_version_id` AND `organization_id` in Cypher queries.
  - *Qdrant*: Strict `organization_id` Payload `Must` filters.

## RBAC Design & Authorization
- **Roles**: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`.
- **Permissions Matrix**: Managed in `AuthorizationService`.
- **Enforcement**: API endpoints (`/api/v1/*`) invoke `AuthorizationService.require_permission()` instead of writing inline `repo.owner_id == user.id` checks.

## Worker Architecture
- **Stateless Workers**: Workers read contexts exclusively from DB IDs.
- **Job Scheduler**: Replaces raw enqueueing with a priority-based structure (`HIGH`, `NORMAL`, `LOW`).
- **Retries**: Network/transient failures are governed by a `RetryPolicy` with exponential backoff.
- **Job Executions**: Telemetry per worker execution is logged in `JobExecution` to monitor duration, error rates, and status independent of the high-level analysis intent.

## Storage Abstraction
- The `StorageProvider` interface shields business logic from file I/O.
- We support `LocalStorageProvider` today and define `S3StorageProvider` for upcoming cloud deployments.
- Used to archive full architectural snapshots and dependency trees that exceed standard JSON column capacities.

## Security & Governance
- **API Keys**: Scoped securely (prefixed format, stored as hashes, tracked via `last_used_at`).
- **Quotas**: Prevent individual tenants from DDOSing the Neo4j instance.
- **Timeouts**: Added `LIMIT` and `transaction.timeout` parameters to Neo4j traversals to prevent pathological graph shapes from halting the system.

## Scaling
- **Frontend**: The React Flow (2D) and React Three Fiber (3D) interfaces deploy lazy-loading and LOD (Level of Detail) rules. Massive enterprise monorepos are not fetched entirely into browser memory; they are progressively loaded based on camera viewport and manual subgraph expansions.
- **AI Routing**: Foundation laid for `LLMRouter` to distinguish between `cheap_model` usage (for summarization) and `advanced_model` usage (for architecture risk analysis) to govern token costs effectively.
