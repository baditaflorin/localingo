# 0013 Testing Strategy

## Status

Accepted

## Context

Local hooks replace GitHub Actions. Tests must be fast enough for pre-push.

## Decision

Use:

- Vitest for unit tests colocated with source.
- Playwright for one browser happy path.
- `scripts/smoke.sh` to build, serve Pages output, and run the Playwright smoke.
- `make test`, `make build`, and `make smoke` as the pre-push path.

Coverage focuses on scheduler, answer checking, grammar feedback, and app smoke behavior.

## Consequences

Core learning logic is protected without adding CI. Developers must run local checks before pushing.

## Alternatives Considered

GitHub Actions were rejected because the prompt explicitly forbids them.
