# 0004 Static Data Contract

## Status

Accepted

## Context

Mode A has no server-side data generation. The first curriculum should be deterministic, versioned, and bundled with the app.

## Decision

Ship seed curriculum as TypeScript data in `src/data/course.ts`.

Persist user progress in IndexedDB with schema version `1`. Export/import uses JSON with this top-level shape:

- `schemaVersion`: number
- `exportedAt`: ISO timestamp
- `profile`: user profile and streak state
- `cards`: spaced repetition cards
- `attempts`: exercise attempt history

Static app metadata is exposed through `docs/version.json` after build. Live commit metadata is fetched from:

https://api.github.com/repos/baditaflorin/localingo/commits/main

## Consequences

The app works offline after first load. Curriculum updates require a normal app release. Export/import provides the v1 escape hatch for backups.

## Alternatives Considered

Committed JSON files were considered. TypeScript data gives stricter local typing while the dataset remains small.
