# ADR 0001: Modular Monolith

## Status
Accepted

## Context
We need to establish the backend architecture. Microservices add significant operational overhead and complexity early in a project's lifecycle.

## Decision
We will build the FastAPI backend as a modular monolith. Directories like `auth`, `users`, `repositories`, `analysis`, and `graph` will represent strict module boundaries. We will not split these into separate deployable services during Milestone 0.

## Consequences
- Faster iteration.
- Simpler deployment.
- Module boundaries must be strictly enforced via code reviews to prevent tight coupling, allowing future extraction if necessary.
