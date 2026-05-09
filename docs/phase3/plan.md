# Phase 3 Plan

Created: 2026-05-09

Ranked by direct impact on whether a stranger can use the app end to end.

## Highest Impact

1. Add a visible save status so autosave is trustworthy.
2. Add a real settings surface for persisted settings.
3. Make `dailyGoalXp` visible and actually meaningful in the UI.
4. Make `voiceEnabled` actually gate speaking workflows.
5. Add safe import error handling with what/why/next-step messaging.
6. Add drag-and-drop state import.
7. Add paste-based JSON import.
8. Add shareable state URLs using hash state.
9. Add import from shared hash state on load.
10. Add copy-to-clipboard export.
11. Add explicit export success feedback.
12. Add reset confirmation and post-reset feedback.
13. Add progress/history export metadata with provenance.
14. Add an activity log visible in the app.
15. Add a `?debug=1` debug panel for inspectability.

## Medium Impact

16. Add async status and re-entry protection to DuckDB summary runs.
17. Add a profile name editor that persists.
18. Add empty-state and recovery text for import/share/settings pathways.
19. Split `App.tsx` into view modules and state helpers.
20. Remove unsafe casts where straightforward.
21. Replace placeholder integration coverage with meaningful persistence coverage.
22. Expand Playwright coverage to include import/export/share/settings/reset.
23. Update README claims and limitations to match reality.
24. Add Phase 3 stranger-test document and postmortem.

## Out of Scope

- New learning content engines.
- Backend services or sync.
- Visual polish work that does not improve completeness.
