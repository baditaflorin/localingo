# Controls Audit

Audit date: 2026-05-09

## Core Controls

| Control                | Status      | Notes                                                                     |
| ---------------------- | ----------- | ------------------------------------------------------------------------- |
| Lesson tab             | works fully | Switches to lesson workspace.                                             |
| Review tab             | works fully | Switches to review workspace.                                             |
| Generate tab           | works fully | Switches to generated drills.                                             |
| Progress tab           | works fully | Switches to progress workspace.                                           |
| Lesson selector        | works fully | Chooses lesson and resets exercise index.                                 |
| Choice answer buttons  | works fully | Submit and score.                                                         |
| Type check button      | works fully | Submit and score.                                                         |
| Grammar check button   | works fully | Submit and score.                                                         |
| Speech record button   | works fully | Starts/stops recording and respects the Settings gate for voice practice. |
| Speech manual check    | works fully | Scores typed response against expected answer.                            |
| Lesson next button     | works fully | Advances to next exercise.                                                |
| Review reveal button   | works fully | Reveals card answer.                                                      |
| Review quality buttons | works fully | Reschedules card and awards XP.                                           |
| Export JSON            | works fully | Downloads state and confirms success.                                     |
| Copy JSON              | works fully | Copies the full state JSON and confirms success or failure.               |
| Copy share link        | works fully | Copies a complete `#share=` link for state handoff.                       |
| Import JSON            | works fully | Imports file, drop, and pasted state with visible error handling.         |
| Run SQL                | works fully | Runs DuckDB summary with a loading state and re-entry protection.         |
| Reset local progress   | works fully | Uses confirmation when destructive-action confirmation is enabled.        |
| Learner name input     | works fully | Persists the learner profile name.                                        |
| Daily goal setting     | works fully | Updates the daily goal meter.                                             |
| Voice practice toggle  | works fully | Enables or disables microphone-based speaking practice.                   |
| Romanized hints toggle | works fully | Shows or hides phonetic hints in speaking exercises.                      |
| Confirm reset toggle   | works fully | Controls reset confirmation behavior.                                     |
| GitHub repo link       | works fully | Opens repository.                                                         |
| PayPal link            | works fully | Opens PayPal.                                                             |
| Live link              | works fully | Opens deployed site.                                                      |

## Findings

- There are no obvious dead buttons in the visible UI.
- The visible controls are now end-to-end complete for the workflows they claim.
- The remaining gaps are scope choices, not misleading controls.
