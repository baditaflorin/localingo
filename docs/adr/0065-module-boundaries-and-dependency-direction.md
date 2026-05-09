# 0065 Module Boundaries and Dependency Direction

## Status

Accepted

## Context

`App.tsx` currently imports nearly every feature directly and also owns persistence and side effects.

## Decision

Use this direction:

- `app` composes surfaces and providers
- `features/*` render focused workflows
- `lib/*` owns pure shared helpers and persistence boundaries

Feature views may depend on `lib`, but `lib` must not depend on feature UI modules.

## Consequences

Future work can modify a workflow without re-opening the full shell.
