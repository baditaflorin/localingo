# 0067 State Management Convention

## Status

Accepted

## Context

App state currently mixes persisted state, transient UI state, and action feedback inside one component.

## Decision

Use a dedicated `useLocalingoApp` hook for:

- persisted state hydration and save scheduling
- import/export/share/reset actions
- transient notices and save status

Feature components receive focused props rather than the whole app orchestration burden.

## Consequences

State transitions become clearer and easier to test.
