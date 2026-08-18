# ADR 0005: Shared Graph Representation

## Status
Accepted

## Context
CodeGraph features both a 2D graph architecture (React Flow) and a 3D Codebase Universe (React Three Fiber). We need a data structure that drives both without duplicating logic.

## Decision
We will expose a single Normalized Graph DTO from the backend API. Both the 2D and 3D visualizers will consume this identical structure.

## Consequences
- Guarantees consistency between 2D and 3D views.
- Prevents the frontend from maintaining a separate disconnected data model.
