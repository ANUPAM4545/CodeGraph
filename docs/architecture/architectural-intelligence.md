# Architectural Intelligence

## Overview
CodeGraph Milestone 7 introduces true architectural intelligence. Rather than relying on simulated logic or generic AI bots, CodeGraph now employs a deterministic, Neo4j-backed `ImpactAnalysisService` and `ArchitectureRiskService` to compute the consequences of code changes.

## Impact Analysis
- **Graph Traversal Strategy**: Utilizes parameterized Cypher to traverse `CALLS`, `IMPORTS`, `INHERITS`, `DEFINES`, and `CONTAINS` relationships.
- **Bounded Depth**: Queries are strictly bounded to a maximum of 3 hops (default 1) using Cypher path matching (`*1..3`).
- **DTO**: Returns an `ImpactAnalysisDTO` summarizing direct dependencies, direct dependents, callers, callees, inheritance neighbors, affected files, and affected modules.

## Architecture Risk Engine
- **Deterministic**: No LLM involvement in score calculation. Identical graph topologies yield identical risk signals.
- **Signals**: Evaluates `fan_in` (incoming dependencies) and `fan_out` (outgoing dependencies) alongside cross-module boundaries (`affected_modules`).
- **Explainability**: Yields a human-readable reason detailing exactly why a specific component was flagged (e.g. "High fan-in (37 callers/dependents)").

## Subsystem & Hotspot Detection
- **SubsystemDetector**: Grouping logic relies on Top-Level Directory extraction paired with Import Density measurement. CodeGraph does not use generic connected-components as they often merge unrelated modules through shared utilities.
- **EntryPointDetector**: Uses structural heuristics (like the function label `main`) to identify likely execution entry points.
- **Hotspots**: Highlights files/symbols with unusually high `fan_in` or cross-boundary connectivity.

## AI Grounding & Evidence Quality
The `HybridRetriever` supports two new intents:
- `CHANGE_IMPACT`: Fetches structural consequences from `ImpactAnalysisService` to ground the LLM's understanding of what happens when a specific symbol is modified.
- `ARCHITECTURE_EXPLANATION`: Retrieves architectural summaries and hotspots.
- **Evidence Quality**: Evaluates the retrieved evidence (STRONG, MODERATE, LIMITED) based on the presence of exact graph matches vs purely semantic similarity. The LLM distinguishes observed facts from inferences.

## Visual Impact Modes
- **2D React Flow**: Selecting a node visually highlights (via opacity/stroke) its callers, dependents, and dependencies while dimming unrelated elements.
- **3D Universe**: Supports "Architecture View" to view high-level subsystems/directories (hiding symbols) and "Hotspot View" emphasizing central nodes.

## IDE Context API
- Exposes `POST /api/v1/repositories/{repo_id}/versions/{version_id}/developer-context`.
- Allows future VS Code / JetBrains extensions to easily query structural impact, neighbors, and relevant AI chunks using a file path and line range.
