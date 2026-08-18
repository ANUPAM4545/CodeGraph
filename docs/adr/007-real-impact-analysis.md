# ADR 007: Real Graph-Backed Impact Analysis

## Context
CodeGraph needs to answer complex questions about change impact (e.g. "What breaks if I change this function?"). Previously, impact analysis was mocked. We must establish a strategy for querying real architectural dependencies without exposing the system to unlimited runaway graph traversals.

## Decision
1. **Impact Analysis Service**: We will implement a dedicated service executing deterministic, parameterized Cypher queries against Neo4j.
2. **Bounded Traversal**: All impact traversals are bounded to a maximum depth of 3 hops (`*1..3`). Default is 1 hop. The API explicitly clamps inputs exceeding this threshold.
3. **Relationship Semantics**: The DTO explicitly classifies dependencies as `callers`, `callees`, `direct_dependents`, `direct_dependencies`, and `inheritance_neighbors` to preserve the semantics of `CALLS`, `IMPORTS`, and `INHERITS` respectively.
4. **No LLM Calculation**: Impact analysis is deterministic. The LLM merely synthesizes the result; it never calculates graph boundaries, coupling, or node risk itself.

## Consequences
- Protects the Neo4j database from unbounded cycle-inducing queries on extremely large repos.
- Grounds the AI Copilot strictly in observable reality, mitigating hallucinations concerning code interactions.
- Forces the definition of strict API contracts (`ImpactAnalysisDTO`) that can be serialized and passed into AI context windows deterministically.
