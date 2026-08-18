# Real-Time Developer Sync Architecture

## Overview
CodeGraph Milestone 8 introduces a real-time developer synchronization layer. This layer transforms the system from a static analysis batch tool into an active, intelligent copilot that maintains constant context with the developer's IDE and the web application.

## Transport & Multiplexing
- **WebSockets**: The primary transport mechanism for real-time events. Hosted on FastAPI at `/api/v1/ws/repositories/{repo_id}/versions/{version_id}`.
- **Redis Pub/Sub**: Acts as the central event bus across multiple FastAPI instances.
- **Multiplexer**: A single global Redis subscriber task listens to all relevant channels and routes events to the appropriate in-memory `ConnectionManager`. We **DO NOT** create a Redis subscriber per WebSocket connection to preserve memory and connection limits.

## Authentication & Authorization Flow
Authentication is strictly performed via the WebSocket channel after the connection is established. **No JWTs are passed in the URL or query parameters.**

1. **Connect**: Client connects to `wss://codegraph/api/v1/ws/repositories/{repo_id}/versions/{version_id}`.
2. **Auth Message**: Client sends `{"type": "AUTH", "token": "jwt", ...}` within 10 seconds.
3. **Verify**: Server validates the JWT signature, and checks repository/version ownership via the DB.
4. **Accept**: Server sends `{"type": "AUTH_SUCCESS", ...}`. The connection is now registered to receive Pub/Sub events.

## IDE Protocol

### 1. Request Context (IDE -> Server)
```json
{
  "type": "CONTEXT_CHANGED",
  "request_id": "req-123",
  "payload": {
    "file_path": "src/main.ts",
    "line": 42,
    "level": "LIGHT"
  }
}
```
**Levels:**
- `LIGHT`: Rapid resolution of file/symbol, basic neighbors.
- `STANDARD`: Explicit request. Includes `LIGHT` + Impact Analysis + Dependencies.
- `DEEP`: Explicit request. Includes `STANDARD` + Architectural Risk + AI/Semantic chunk context.

### 2. Context Response (Server -> IDE)
```json
{
  "type": "CONTEXT_RESOLVED",
  "request_id": "req-123",
  "payload": {
    "repository_version_id": "...",
    "resolved_symbol_id": "...",
    "basic_neighbors": [],
    "impact": {}
  }
}
```

### 3. Request AI (IDE -> Server)
AI requests must be explicitly triggered by the user. The backend does not run generative AI on every cursor movement.
```json
{
  "type": "REQUEST_AI",
  "request_id": "ai-456",
  "payload": {
    "query": "What happens if I change this parameter?",
    "context": { ... }
  }
}
```

## Security & Isolation
- **Tenant Isolation**: Connections are strictly subscribed to `codegraph:repository:{repo_id}:version:{version_id}`.
- **Payload Limits**: We do not broadcast large graph payloads, source code, or huge diffs over WebSockets. We only broadcast notifications and metadata (e.g. `VERSION_READY`). Clients must fetch large data via standard REST endpoints using the provided IDs.
