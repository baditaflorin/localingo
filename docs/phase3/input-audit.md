# Input Audit

Audit date: 2026-05-09

## Status Grid

| Input pathway                     | Status          | Notes                                                                                                                    |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Lesson answer buttons             | works fully     | Choice answers submit and score immediately.                                                                             |
| Text answer input                 | works fully     | Typed and grammar inputs submit on form post.                                                                            |
| Microphone capture                | works fully     | Browser support and permission still matter, but the feature now has a visible settings gate and a manual fallback path. |
| JSON state import via file picker | works fully     | Import validates, upgrades legacy state, and shows actionable errors.                                                    |
| Drag and drop import              | works fully     | JSON state files can be dropped into the Progress workspace.                                                             |
| Paste JSON import                 | works fully     | Exported JSON can be pasted directly into the Progress workspace.                                                        |
| URL/deep-link import              | works fully     | Shared `#share=` URLs are supported on load and in pasted input.                                                         |
| Clipboard read                    | out of scope    | Clipboard write is supported; direct clipboard read is intentionally not required for this release.                      |
| Multi-file import                 | out of scope    | The app moves one Localingo state at a time. Batch import is not part of the product model.                              |
| Mobile picker                     | works partially | Browser file input exists, but there is no mobile-specific guidance or alternate flow.                                   |
| Folder import                     | out of scope    | The app imports one Localingo state file, not folders of assets.                                                         |
| Sample/demo reset                 | works fully     | Reset recreates the starter profile with confirmation support.                                                           |
| Restored autosave                 | works fully     | IndexedDB restore happens on load.                                                                                       |
| Imported shared state URL         | works fully     | Share links can rehydrate local state from the URL hash.                                                                 |

## Findings

- Localingo now supports the full static-friendly state loop: file, drop, paste, autosave, and shared URL hash.
- Clipboard read and multi-file import remain consciously out of scope because the app models one full learner state at a time.
- Autosave is now visible instead of implicit.
