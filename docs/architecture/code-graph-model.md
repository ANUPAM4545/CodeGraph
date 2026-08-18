# CodeGraph Canonical Graph Model

The CodeGraph canonical graph model is the core language-agnostic representation of a software repository. It serves as the intermediary abstraction layer separating source-code parsing (e.g., Tree-sitter) from graph persistence (e.g., Neo4j).

## 1. Generic Graph DTO Envelope
All nodes and edges conform to a generic DTO envelope to ensure compatibility with graph databases, AI pipelines, and frontend visualization libraries (React Flow, Three.js).

### `GraphNode`
- `id` (str): Deterministic hash identity.
- `type` (str): The node label (e.g., "Function", "File").
- `repository_version_id` (str): Hard boundary for isolation.
- `name` (str): Display name.
- `qualified_name` (str): Fully qualified path.
- `file_path` (str): Associated file.
- `location` (dict): `{"line_start": int, "line_end": int, "column": int}`
- `metadata` (dict): Additional arbitrary key/value info (e.g., visibility, docstrings).

### `GraphEdge`
- `id` (str): Deterministic hash identity.
- `type` (str): Relationship semantics (e.g., "CALLS", "DEFINES").
- `source_id` (str): Origin node.
- `target_id` (str): Destination node.
- `metadata` (dict): Context (e.g., `{"confidence": 1.0, "line": 42}`).

## 2. Canonical Node Types
- `RepositoryVersion`: Root node for the analyzed commit.
- `Directory`: Logical folder structure.
- `File`: Source code file.
- `Class`: Object-oriented class.
- `Function`: Standalone function.
- `Method`: Class-bound function.
- `Parameter`: Argument signature component.
- `Variable`: Global/Class level assignment.
- `ExternalPackage`: Third-party dependencies.

## 3. Canonical Relationship Types
- `CONTAINS`: Structural nesting (e.g., Directory -> File).
- `DEFINES`: Declaration (e.g., File -> Function, Class -> Method).
- `INHERITS`: Class inheritance.
- `HAS_PARAMETER`: Function/Method -> Parameter.
- `CALLS`: Execution invocation (conservative).
- `IMPORTS`: Dependency inclusion (File -> File, or File -> ExternalPackage).

## 4. Deterministic Identity Strategy
Nodes use deterministic ID hashes to ensure idempotent analysis runs:
- `File`: `hash(version_id + file_path)`
- `Class`: `hash(version_id + file_path + "class" + qualified_name)`
- `Function`: `hash(version_id + file_path + "function" + qualified_name)`

## 5. RepositoryVersion Isolation
Data is strictly isolated per snapshot. Neo4j Cypher queries MUST filter by `repository_version_id`. Analysis jobs use a delete-and-rebuild strategy for specific versions, safely wiping out the old version graph before persisting a new one.

## 6. Python Analyzer Architecture
1. **Acquisition:** Download GitHub zipball for `commit_sha`.
2. **Parser:** Run Tree-sitter on Python files individually.
3. **Extraction:** Visit AST nodes, instantiating `GraphNode` and `GraphEdge` DTOs.
4. **Resolution:** Perform a second pass to link `CALLS` and `IMPORTS` (favoring explicit local pathing, falling back to `ExternalPackage`).
5. **Persistence:** Dispatch to `GraphRepository` which handles bulk `MERGE`/`CREATE` statements.

## 7. Known Limitations
- Pure static analysis of Python cannot resolve 100% of dynamic `CALLS` due to duck-typing and runtime metaprogramming. False positives are heavily penalized, so unresolved calls are deferred to metadata.
- Import alias resolution is strictly local to the file being parsed.
