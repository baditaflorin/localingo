# Output Audit

Audit date: 2026-05-09

## Status Grid

| Output pathway                           | Status       | Notes                                                                 |
| ---------------------------------------- | ------------ | --------------------------------------------------------------------- |
| Lesson feedback UI                       | works fully  | Immediate correctness and explanation are shown.                      |
| JSON state export download               | works fully  | Exports a versioned envelope with provenance metadata.                |
| Copy to clipboard                        | works fully  | State JSON can be copied directly.                                    |
| Share link                               | works fully  | A full state can be moved with a shareable URL hash.                  |
| Downloadable state with version metadata | works fully  | Export includes kind, schema version, app version, and timestamp.     |
| Print/PDF-friendly output                | out of scope | This release is about state completeness, not printable materials.    |
| Image/screenshot export                  | out of scope | Not part of the Localingo state workflow.                             |
| API/curl-ready output                    | out of scope | Static local-first state handoff uses JSON and share links instead.   |
| Debug/export of history                  | works fully  | Recent activity is visible in-app and included in the exported state. |
| Reset/delete state                       | works fully  | Reset is confirmable and clearly scoped to the local browser state.   |

## Findings

- The main state output paths are now complete for a static product: download, copy, and share link.
- Print/PDF and automation outputs remain explicitly out of scope.
