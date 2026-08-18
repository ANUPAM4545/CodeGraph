# ADR 002: Redis Pub/Sub Multiplexing

## Status
Approved

## Context
To support multiple scale-out FastAPI instances handling thousands of developer WebSockets, we need a mechanism to broadcast events (e.g. `VERSION_READY`) globally to the correct nodes.

## Decision
We will use Redis Pub/Sub. However, to conserve Redis connections, we will implement a *Single Redis Subscriber Multiplexer*. One global async task per API instance will listen to all subscribed channels, mapping incoming Redis events to the in-memory WebSocket `ConnectionManager`.

## Consequences
- Significantly reduces Redis connection overhead.
- Requires internal mapping logic (Channel -> Set of Connection IDs).
- Ensures Tenant Isolation by subscribing only to `codegraph:repository:{id}:version:{id}`.
