# ADR 0006: Repository Version Concept

## Status
Accepted

## Context
A codebase is a moving target. If we analyze a repository, the insights, embeddings, and graph nodes correspond to a specific point in time (a commit hash).

## Decision
We make `RepositoryVersion` a first-class concept in the data model. All graph data, AI answers, and analysis will be tied to a specific `RepositoryVersion`, which belongs to a `Repository`.

## Consequences
- Allows accurate impact analysis.
- Prevents semantic search and AI from hallucinating based on mixed, outdated, or overwritten versions of the codebase.
- Increases database complexity but ensures data accuracy.
