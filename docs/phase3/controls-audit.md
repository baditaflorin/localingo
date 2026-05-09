# Controls Audit

Audit date: 2026-05-09

## Core Controls

| Control                | Status          | Notes                                                                 |
| ---------------------- | --------------- | --------------------------------------------------------------------- |
| Lesson tab             | works fully     | Switches to lesson workspace.                                         |
| Review tab             | works fully     | Switches to review workspace.                                         |
| Generate tab           | works fully     | Switches to generated drills.                                         |
| Progress tab           | works fully     | Switches to progress workspace.                                       |
| Lesson selector        | works fully     | Chooses lesson and resets exercise index.                             |
| Choice answer buttons  | works fully     | Submit and score.                                                     |
| Type check button      | works fully     | Submit and score.                                                     |
| Grammar check button   | works fully     | Submit and score.                                                     |
| Speech record button   | works partially | Starts/stops recording, but no high-level disable or recover flow.    |
| Speech manual check    | works fully     | Scores typed response against expected answer.                        |
| Lesson next button     | works fully     | Advances to next exercise.                                            |
| Review reveal button   | works fully     | Reveals card answer.                                                  |
| Review quality buttons | works fully     | Reschedules card and awards XP.                                       |
| Export JSON            | works partially | Downloads state but gives no success message or alternate path.       |
| Import JSON            | works partially | Imports file but has no visible error handling.                       |
| Run SQL                | works partially | Runs DuckDB summary, but has no loading state, guard, or cancel path. |
| Reset local progress   | works partially | Resets state immediately with no confirmation.                        |
| GitHub repo link       | works fully     | Opens repository.                                                     |
| PayPal link            | works fully     | Opens PayPal.                                                         |
| Live link              | works fully     | Opens deployed site.                                                  |

## Findings

- There are no obvious dead buttons in the visible UI.
- Several controls are functionally incomplete because they do not guide, confirm, or recover.
- “Works” on the demo path often still means “no observable status or error path.”
