# ADR 001: Realtime WebSocket Architecture

## Status
Approved

## Context
CodeGraph needs a way to synchronize real-time updates (like completion of repository analysis) and IDE cursor events with the backend graph intelligence services.

## Decision
We will use WebSockets exposed via FastAPI as the primary transport protocol. 
Authentication will occur *after* the connection is established via an explicit `AUTH` message payload containing a JWT, rather than via URL query parameters, to prevent token leakage in proxy logs or browser history.

## Consequences
- Requires explicit connection state handling (CONNECTING -> AUTHENTICATING -> CONNECTED).
- Improves security by keeping credentials out of standard HTTP metadata.
- Enables bi-directional, persistent messaging for real-time IDE sync.
