# ADR 003: Event Envelope Design

## Status
Approved

## Context
A uniform structure is required for all real-time events sent over WebSockets to allow clients to robustly parse, route, and ignore messages.

## Decision
We will adopt a strict `RealtimeEvent` envelope:
```json
{
  "event_id": "uuid",
  "event_version": 1,
  "event_type": "VERSION_READY",
  "repository_id": "...",
  "repository_version_id": "...",
  "timestamp": "iso8601",
  "payload": {}
}
```

## Consequences
- Strong typing and versioning support.
- Large data (source code, full graph) will NEVER be placed in `payload`. It is strictly for metadata and IDs.
