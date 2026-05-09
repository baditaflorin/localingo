# Input Audit

Audit date: 2026-05-09

## Status Grid

| Input pathway                     | Status          | Notes                                                                                  |
| --------------------------------- | --------------- | -------------------------------------------------------------------------------------- |
| Lesson answer buttons             | works fully     | Choice answers submit and score immediately.                                           |
| Text answer input                 | works fully     | Typed and grammar inputs submit on form post.                                          |
| Microphone capture                | works partially | Depends on browser support and permission; no global setting gate in UI.               |
| JSON state import via file picker | works partially | Happy-path only; invalid imports are not surfaced safely to the user.                  |
| Drag and drop import              | not built       | No drop target exists.                                                                 |
| Paste JSON import                 | not built       | No paste area or clipboard fallback exists.                                            |
| URL/deep-link import              | not built       | No route or hash import exists.                                                        |
| Clipboard read                    | not built       | No permission flow or fallback exists.                                                 |
| Multi-file import                 | not built       | Only single `application/json` file is accepted.                                       |
| Mobile picker                     | works partially | Browser file input exists, but there is no mobile-specific guidance or alternate flow. |
| Folder import                     | not built       | Not relevant to current app surface, but not implemented.                              |
| Sample/demo reset                 | works partially | Reset recreates default course state, but there is no explicit “load demo” language.   |
| Restored autosave                 | works fully     | IndexedDB restore happens on load.                                                     |
| Imported shared state URL         | not built       | No sharable state URL support.                                                         |

## Findings

- The app accepts only one user-owned artifact today: a previously exported JSON state file.
- Real first-time users cannot bring their own learning state except by file import.
- Failure handling around import is weak enough to feel broken instead of guided.
- Autosave exists, but it is invisible; users are expected to trust it without feedback.
