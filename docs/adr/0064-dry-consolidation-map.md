# 0064 DRY Consolidation Map

## Status

Accepted

## Context

`App.tsx` currently repeats section scaffolding, action handling, and lightweight status concerns.

## Decision

Extract:

- app state orchestration into a dedicated hook
- shared action/notice patterns into utility helpers
- large workspace sections into feature view modules

## Consequences

The main shell becomes easier to read and easier to test.
