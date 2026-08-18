# ADR 0004: Async Analysis Worker Architecture

## Status
Accepted

## Context
Repository analysis (AST parsing, graph building) is computationally expensive and cannot block HTTP requests.

## Decision
We will implement an asynchronous analysis worker architecture. The FastAPI backend will dispatch `Analysis Jobs` to a Redis queue. A separate Python worker process (`services/analysis`) will pick up the jobs, execute the analysis, and populate Neo4j/Qdrant.

## Consequences
- Scalable analysis that does not degrade API performance.
- Requires Redis for job queue management.
