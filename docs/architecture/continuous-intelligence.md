# Continuous Code Intelligence Architecture

## Overview
CodeGraph Milestone 6 introduces continuous intelligence, transforming the static batch analysis into an event-driven system triggered by GitHub Webhooks. It employs an incremental update strategy for both the Neo4j graph and the Qdrant semantic index.

## Webhook Architecture
- **Endpoint**: `POST /api/v1/webhooks/github`
- **Security**: Validates `X-Hub-Signature-256` using HMAC SHA-256 with constant-time comparison. No JWT required.
- **Idempotency**: Handled using `provider` ("github") and `delivery_id` (`X-GitHub-Delivery`). Enforced by PostgreSQL `UNIQUE` constraint.
- **Flow**: Fast HTTP return. Enqueues a `PROCESS_WEBHOOK` background job via RQ and Redis.

## Copy-on-Write Version Isolation
Each commit processed results in a new strictly immutable `RepositoryVersion`. The Neo4j incremental construction clones unaffected graph nodes to the new `repository_version_id` without mutating the parent version. 
This guarantees isolation for queries answering architectural questions for historical points in time.

## Semantic Indexing (Qdrant)
For unaffected files, Qdrant vectors are NOT re-embedded. The pipeline fetches the existing vectors, assigns a new deterministic version-scoped ID, and upserts them to the new version payload. New embeddings are generated only for `ADDED` or `MODIFIED` chunks.

## Impact Analysis
A 1-3 hop bounded traversal identifies callers, dependencies, and imports affected by modified symbols. This is surfaced directly via `/api/v1/repositories/{id}/versions/{version_id}/impact` and used as evidence for `CHANGE_IMPACT` AI questions.

## Full-Analysis Fallback
When a commit graph is fundamentally corrupted, or the diff exceeds the `INCREMENTAL_CHANGE_THRESHOLD_PERCENT` (20%), the pipeline falls back to `FULL_ANALYSIS`. This ensures stability despite missed webhooks or large-scale refactors.
