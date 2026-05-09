# Feature Claims Audit

Audit date: 2026-05-09

## Claims vs Reality

| Claim source       | Claim                                                           | Status        | Notes                                                                                 |
| ------------------ | --------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------- |
| README             | Lesson loop with choice, typed, grammar, and speaking exercises | shipped fully | Matches current implementation.                                                       |
| README             | SM-2-inspired spaced repetition stored in IndexedDB             | shipped fully | Present in review scheduler and storage.                                              |
| README             | Local grammar feedback and deterministic n-gram embeddings      | shipped fully | Present.                                                                              |
| README             | Browser microphone pronunciation scoring with Web Audio         | shipped fully | Works when browser APIs are available and now has clearer settings/fallback behavior. |
| README             | Local generated drills based on due review cards                | shipped fully | Present in Generate tab.                                                              |
| README             | Export/import of progress as JSON                               | shipped fully | Import/export now covers file, paste, and legacy upgrade paths with guidance.         |
| README             | Shareable Localingo state links                                 | shipped fully | Implemented in the Progress workspace.                                                |
| README             | Activity log                                                    | shipped fully | Implemented in the Progress workspace.                                                |
| README             | Persistent settings for voice and goals                         | shipped fully | Implemented in the Settings workspace.                                                |
| README             | Version and current main commit shown in the app                | shipped fully | Present in header.                                                                    |
| README             | Public GitHub and PayPal links shown in the app header          | shipped fully | Present.                                                                              |
| docs/privacy.md    | Progress can be reset from the Progress tab                     | shipped fully | Reset is now confirmable and scoped clearly to local browser state.                   |
| docs/postmortem.md | Private language practice, stored in this browser               | shipped fully | Matches IndexedDB persistence.                                                        |

## Findings

- The main documentation claims now match the shipped workflows.
- New docs should describe state-movement limits explicitly: Localingo shares its own state, not arbitrary third-party formats.
