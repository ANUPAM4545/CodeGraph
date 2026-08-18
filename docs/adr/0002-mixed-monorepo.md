# ADR 0002: Mixed Monorepo

## Status
Accepted

## Context
We need to house both a Next.js (TypeScript) frontend and a FastAPI (Python) backend, along with shared libraries and infrastructure configuration.

## Decision
We will use a mixed monorepo structure. `pnpm` will manage the JS/TS workspace for the frontend (`apps/web`) and shared packages (`packages/*`). `uv` will be used for Python dependency and environment management (`apps/api`, `services/analysis`).

## Consequences
- Code lives in one repository, ensuring synchronous versioning.
- We must run separate build/dependency commands for JS and Python instead of a single tool.
