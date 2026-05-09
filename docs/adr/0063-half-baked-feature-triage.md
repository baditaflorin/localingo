# 0063 Half-Baked Feature Triage

## Status

Accepted

## Context

Several features exist on the happy path but lack the completion details a stranger needs.

## Decision

Finish:

- import/export flows
- persisted settings UI
- DuckDB run status and recovery
- reset confirmation
- integration and e2e coverage for state movement

Keep out of scope:

- arbitrary external course import
- PDF/print export
- cloud sync

## Consequences

The visible product gets simpler and more trustworthy without pretending to support broader workflows.
