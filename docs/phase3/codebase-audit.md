# Codebase Audit

Audit date: 2026-05-09

## DRY Violations

- [src/app/App.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/src/app/App.tsx:1)
  Repeated panel/card rendering patterns for metrics, actions, and section shells live inline instead of through shared view helpers.
- [src/app/App.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/src/app/App.tsx:1)
  Import/export/reset side effects and notification-less actions are all handled ad hoc inside the component.

## SOLID Violations

- [src/app/App.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/src/app/App.tsx:1)
  God module: shell, data orchestration, persistence timing, feedback rendering, import/export, reset, and presentation all share one file.
- [src/lib/storage.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/src/lib/storage.ts:1)
  Handles DB schema, initial seed creation, reset semantics, and full-store replacement in one module.

## Dead Code and Dormant Paths

- No obvious abandoned files in `src/`.
- [test/integration/storage.test.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/test/integration/storage.test.ts:1)
  Placeholder integration test title signals incomplete test intent.

## TODO / FIXME / XXX / HACK Count

- `0` in app source.
- One “placeholder” integration test remains in test naming.

## Type Safety Holes

- [src/main.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/src/main.tsx:16)
  `document.getElementById('root') as HTMLElement`
- [src/app/App.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/src/app/App.tsx:570)
  `quality as ReviewQuality`
- [src/features/analytics/duckdbLab.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/src/features/analytics/duckdbLab.ts:28)
  DuckDB row cast instead of validated result parsing.
- [src/lib/exportImport.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-duolingo-super-84/src/lib/exportImport.ts:49)
  `JSON.parse(value) as unknown` boundary is acceptable, but surrounding error messaging is missing.

## Inconsistent Patterns

- Async actions sometimes surface user-facing errors inline (`DuckDB`) and sometimes not at all (`import`, `export`, `reset`).
- Persisted settings exist in state, but there is no UI convention for editing them.
- The app uses test coverage for logic modules but leaves UX-critical flows lightly tested.

## Coverage Holes on Real-User Paths

- Import failure path.
- Reset confirmation/recovery path.
- Any settings persistence path, because no settings UI exists.
- Share/copy pathways, because none exist yet.
