# Shared IDE Protocol

This document defines the stable, IDE-agnostic DTO and protocol for exchanging context between an IDE (VS Code/JetBrains) and CodeGraph.

## Developer Context API

**Endpoint**: `POST /api/v1/repositories/{repo_id}/versions/{version_id}/developer-context`
**Auth**: `Authorization: Bearer <developer_api_key>`

### Request Payload

```json
{
  "file_path": "src/auth/service.py",
  "line_start": 42,
  "line_end": 78,
  "symbol_id": "optional_neo4j_id",
  "symbol_name": "authenticate_user"
}
```

### Response Payload (`DeveloperContext` DTO)

```json
{
  "repository_id": "uuid",
  "repository_version_id": "uuid",
  "commit_sha": "abc1234",
  "file_path": "src/auth/service.py",
  "line_start": 42,
  "line_end": 78,
  "symbol_id": "uuid",
  "symbol_name": "authenticate_user",
  "symbol_type": "Function",
  "definition": "def authenticate_user(token: str): ...",
  "callers": 14,
  "callees": 6,
  "dependencies": ["UserRepository", "TokenService"],
  "dependents": ["APIController"],
  "impact": {
    "affected_files": 12,
    "affected_modules": 4,
    "traversal_depth": 3
  },
  "risk": "HIGH",
  "risk_signals": ["Crosses 4 modules", "High fan-in"],
  "subsystem": "Authentication",
  "architecture_context": "...",
  "evidence_quality": 0.95,
  "semantic_evidence": [],
  "citations": [],
  "readiness": "READY",
  "generated_at": "2026-08-14T20:00:00Z"
}
```

## AI Copilot API

**Endpoint**: `POST /api/v1/repositories/{repo_id}/versions/{version_id}/ai/query`

Request:
```json
{
  "question": "Explain this code",
  "context": {
     // Subset of DeveloperContext
     "file_path": "...",
     "line_start": 42,
     "line_end": 78
  }
}
```

## Realtime Events

Standard WebSocket envelope:
```json
{
  "event_version": "1.0",
  "event_id": "uuid",
  "event_type": "VERSION_READY | GRAPH_ANALYSIS_COMPLETED | ARCHITECTURE_UPDATED",
  "repository_id": "uuid",
  "repository_version_id": "uuid",
  "timestamp": "iso8601",
  "payload": {}
}
```
