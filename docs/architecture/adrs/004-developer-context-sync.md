# ADR 004: Developer Context Synchronization

## Status
Approved

## Context
IDEs send frequent cursor movements (`CONTEXT_CHANGED`). Resolving the full Neo4j graph context (impact, dependencies) on every keystroke/movement is computationally expensive and slow.

## Decision
We will implement tiered context resolution (`LIGHT`, `STANDARD`, `DEEP`) combined with debouncing on the client and caching on the server (keyed by `repository_version_id`).
- `LIGHT`: Basic symbol resolution and immediate neighbors (triggered automatically).
- `STANDARD`: Impact and dependencies (triggered explicitly by the user).
- `DEEP`: Semantic chunks and AI context (triggered explicitly).

## Consequences
- Protects the Neo4j backend from DDoS by IDE plugins.
- Requires explicit user intent for heavy AI operations (`REQUEST_AI`).
