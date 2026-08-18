# ADR 009: Job Scheduling Architecture

## Status
Approved

## Context
As CodeGraph scales to hundreds of repositories, a simple background worker queue is insufficient. We need to prioritize urgent security scans over routine architectural background optimizations and prevent one tenant from consuming all worker nodes.

## Decision
We will build a `JobScheduler` wrapping our Redis queue architecture.
- **Priority Queues**: `HIGH`, `NORMAL`, `LOW`.
- **Stateless Workers**: Workers pull from queues based on priority. They read the job context strictly from the Postgres database via `job_id`.
- **Telemetry**: Introduced `JobExecution` model to track worker telemetry (duration, errors, status) independent of the logical `AnalysisJob`.
- **Retries**: Implemented a `RetryPolicy` with exponential backoff for temporary failures (e.g. Neo4j timeouts, GitHub rate limits).

## Consequences
- Allows graceful degradation during heavy load.
- Prevents poison pills from infinitely retrying.
