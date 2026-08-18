# Architecture Decision Record: 0007-canonical-graph-model
## Title
Canonical Graph Model for Code Intelligence

## Status
Accepted

## Context
CodeGraph must extract code intelligence from various programming languages (Python, TypeScript, Go, etc.) into a cohesive queryable Code Knowledge Graph stored in Neo4j. We need a strategy to represent codebase information consistently, independent of the underlying parsing technology (Tree-sitter) and independent of the graph database engine. 

If we push abstract syntax tree (AST) nodes directly into the database, queries will become fragile, tightly coupled to Tree-sitter's AST grammar definitions per language, and impossibly verbose.

## Decision
1. **Language-Agnostic Canonical Domain:** We introduce a generic CodeGraph Canonical Domain Model (e.g. `CodeNode` envelope, `GraphRelationship`). All parsers must transform their language-specific AST into this schema before persistence.
2. **Determinism over Randomness:** All node identities must be deterministic, generated using a stable hashing algorithm incorporating the `repository_version_id`, structural type, and qualified source path.
3. **RepositoryVersion Isolation:** The graph data MUST be scoped to its exact version snapshot. `repository_version_id` is stamped on all nodes. We will adopt a "delete-and-rebuild" strategy per version iteration for Milestone 2.
4. **Primary Entities over Tokens:** Instead of mapping every `+` or `if` statement, we extract structural entities (Files, Classes, Functions, Methods, Variables, Parameters, Imports, ExternalPackages) and semantic relationships (CONTAINS, DEFINES, INHERITS, CALLS, IMPORTS, HAS_PARAMETER).
5. **No Blind Dependency Fabrication:** If an import or call cannot be definitively resolved internally within the codebase, it is recorded as an external edge or retained as node metadata rather than fabricating a false link.

## Consequences
- **Positive:** We decouple the UI and Neo4j queries from language-specific quirks.
- **Positive:** Idempotent re-analysis is trivially supported without duplicating thousands of nodes.
- **Negative:** Information loss. We lose fine-grained block-level AST logic inside function bodies (for now), but this is acceptable given our visualization and macro-level analysis focus.
