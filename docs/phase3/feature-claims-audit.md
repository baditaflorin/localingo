# Feature Claims Audit

Audit date: 2026-05-09

## Claims vs Reality

| Claim source       | Claim                                                           | Status            | Notes                                                                                        |
| ------------------ | --------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| README             | Lesson loop with choice, typed, grammar, and speaking exercises | shipped fully     | Matches current implementation.                                                              |
| README             | SM-2-inspired spaced repetition stored in IndexedDB             | shipped fully     | Present in review scheduler and storage.                                                     |
| README             | Local grammar feedback and deterministic n-gram embeddings      | shipped fully     | Present.                                                                                     |
| README             | Browser microphone pronunciation scoring with Web Audio         | shipped partially | Works when browser APIs are available, but the app does not clearly frame fallback/recovery. |
| README             | Local generated drills based on due review cards                | shipped fully     | Present in Generate tab.                                                                     |
| README             | Export/import of progress as JSON                               | shipped partially | Import/export exists, but user guidance and failure handling are incomplete.                 |
| README             | Version and current main commit shown in the app                | shipped fully     | Present in header.                                                                           |
| README             | Public GitHub and PayPal links shown in the app header          | shipped fully     | Present.                                                                                     |
| docs/privacy.md    | Progress can be reset from the Progress tab                     | shipped partially | True, but reset is abrupt and not confirmable.                                               |
| docs/postmortem.md | Private language practice, stored in this browser               | shipped fully     | Matches IndexedDB persistence.                                                               |

## Findings

- The docs are mostly honest, but a few “shipped” claims are only happy-path complete.
- The most visible mismatch is import/export maturity versus the confidence implied by README wording.
