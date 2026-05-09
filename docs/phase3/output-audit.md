# Output Audit

Audit date: 2026-05-09

## Status Grid

| Output pathway                           | Status          | Notes                                                                               |
| ---------------------------------------- | --------------- | ----------------------------------------------------------------------------------- |
| Lesson feedback UI                       | works fully     | Immediate correctness and explanation are shown.                                    |
| JSON state export download               | works partially | Happy-path only; export lacks stronger provenance and there is no copy/share path.  |
| Copy to clipboard                        | not built       | No output can be copied directly.                                                   |
| Share link                               | not built       | No hash-state or short-link flow exists.                                            |
| Downloadable state with version metadata | works partially | Export contains state plus `exportedAt`, but not a richer metadata envelope.        |
| Print/PDF-friendly output                | not built       | No print mode or export-specific rendering exists.                                  |
| Image/screenshot export                  | not built       | No user-facing path exists.                                                         |
| API/curl-ready output                    | not built       | No automation-oriented export exists.                                               |
| Debug/export of history                  | not built       | Attempt history is stored, but not exported separately or inspectably.              |
| Reset/delete state                       | works partially | Reset exists, but there is no confirm step or visibility into what will be cleared. |

## Findings

- Export exists, but it is the only real “take my work with me” path.
- Users cannot easily move state between tabs/devices without manual file handling.
- There is no quick copy/share action for lightweight handoff.
