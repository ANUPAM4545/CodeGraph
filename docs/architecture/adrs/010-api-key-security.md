# ADR 010: API Key Security

## Status
Approved

## Context
Organizations need to integrate CodeGraph with their CI/CD pipelines (e.g. triggering an analysis on git push) without using individual user credentials. 

## Decision
We introduce `DeveloperApiKey` bound to an `Organization`.
- **Format**: `cg_live_<random_secret>`. The `cg_` prefix allows GitHub Advanced Security and other secret scanners to easily identify leaked tokens.
- **Storage**: We ONLY store the `hashed_key` (e.g. via bcrypt or argon2) in Postgres. The plaintext key is shown exactly once upon creation.
- **Tracking**: Keys track `created_at`, `last_used_at`, `expires_at`, and `revoked_at`.

## Consequences
- Complies with enterprise security best practices.
- Minimizes blast radius if the database is compromised.
