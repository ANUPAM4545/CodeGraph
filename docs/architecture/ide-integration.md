# IDE Integration Architecture

CodeGraph is a developer-native intelligence platform. The IDE clients (VS Code, JetBrains) consume the existing CodeGraph APIs and realtime infrastructure as lightweight clients.

## Architecture Principle

The IDE is a **CLIENT**. CodeGraph remains the **INTELLIGENCE SERVER**.

```
VS Code / JetBrains
        |
        | HTTPS / WebSocket (via Ticket)
        v
CodeGraph API
        |
        +---- PostgreSQL (Metadata, Auth)
        |
        +---- Neo4j (Graph)
        |
        +---- Qdrant (Semantic)
        |
        +---- LLM (AI)
        v
Architectural Intelligence
```

## Authentication

IDE Clients authenticate via **Developer API Keys**.
- Key is prefixed with `cg_live_` or `cg_test_`.
- Stored securely in IDE Secret Storage (e.g. VS Code SecretStorage).
- Transmitted as `Authorization: Bearer <key>`.
- The CodeGraph backend resolves this to an Organization and User via constant-time hashed verification against PostgreSQL.

## Realtime Synchronization

IDE Clients subscribe to realtime analysis events (e.g. `VERSION_READY`, `GRAPH_ANALYSIS_COMPLETED`).
- **Ticket Authentication**: IDE makes a `POST /api/v1/ws/ticket` request using its API Key.
- Receives a short-lived, single-use ticket.
- Connects to `wss://<codegraph>/api/v1/ws/repositories/{repo_id}/versions/{version_id}?ticket=<ticket>`.
- Permanent API keys are never placed in WebSocket URLs to prevent leakage in proxy logs.

## Core Capabilities

- **Repository Detection**: Local Git remotes mapped to CodeGraph repositories.
- **Version Resolution**: Local HEAD mapped to CodeGraph `RepositoryVersion`.
- **Developer Context**: Unified `DeveloperContext` DTO provides risk, impact, and architecture info on hover/selection.
- **AI Copilot**: Native WebView querying CodeGraph's Hybrid Retriever.
- **Source Navigation**: Citations open the local file and jump to the specific line.
