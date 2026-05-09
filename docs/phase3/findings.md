# Findings

Audit date: 2026-05-09

## Top 5 Usability Gaps

1. Users cannot easily bring in or move out their own state except through one file import/export path.
2. Import, reset, and DuckDB actions do not guide users through errors, loading, or confirmation.
3. Persisted settings exist conceptually but are invisible, so users cannot control or verify them.
4. Autosave exists but feels invisible, leaving users unsure whether their work is safe.
5. The app offers no lightweight sharing or clipboard pathway, making handoff clumsy.

## Top 5 Half-Baked Features

1. JSON import: finish.
2. JSON export: finish.
3. Persisted settings: finish.
4. DuckDB analytics action: finish.
5. Integration coverage: finish.

## Top 5 Codebase Pain Points

1. `App.tsx` is the primary god module.
2. User action state is mixed with layout rendering, making changes harder than they need to be.
3. Boundary validation exists for import, but user-facing recovery is incomplete.
4. Several UX-critical flows have no dedicated tests.
5. Shared state metadata is too thin for reproducible handoff.

## Top 5 Documentation / Reality Mismatches

1. README implies polished import/export support, but the flows are still happy-path heavy.
2. “Reset local progress” exists without the deliberate UX suggested by the privacy docs.
3. The integration test name itself admits placeholder status.
4. The current docs do not describe limits around microphone support or shareability.
5. The app persists settings in code but documents no settings behavior because users cannot reach it.

## Fully Usable Means

- A stranger can open the app, practice immediately, and see that progress is being saved.
- A user can export state, import it on another tab/device, and get the same learning state back.
- A user can understand what happened when an action fails and what to do next.
- A user can control the core persistence and speech-related settings from the UI.
- A user can hand off lightweight state with a shareable link or clipboard path when a full file export is overkill.

## Phase 3 Success Metrics

- All rows in input and output audits are either green or explicitly documented as out of scope for a static local-first language tutor.
- Import/export round-trip succeeds for canonical state fixtures and a shared-link fixture.
- All destructive actions require confirmation and preserve a clear exit path.
- Every async user action with visible latency shows status and every failure shows what, why, and next step.
- `App.tsx` no longer owns all major app surfaces and stateful utilities directly.

## Out of Scope

- New learning engines or backend services.
- New course content beyond what is needed to complete existing flows.
- Visual polish work unrelated to usability completeness.
