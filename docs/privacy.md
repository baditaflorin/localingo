# Privacy

Localingo v0.1.0 has no analytics, tracking pixels, ads, account system, or backend database.

## Stored Locally

The app stores the following in browser IndexedDB:

- XP, streak, completed lessons.
- Spaced repetition cards and due dates.
- Exercise attempts and scores.
- Settings.

## Network Requests

The app loads static assets from GitHub Pages:

https://baditaflorin.github.io/localingo/

The app fetches public commit metadata from the unauthenticated GitHub REST API:

https://api.github.com/repos/baditaflorin/localingo/commits/main

The PayPal and GitHub links only open when selected by the user:

https://www.paypal.com/paypalme/florinbadita

https://github.com/baditaflorin/localingo

## Microphone

Speech scoring runs in the browser with Web Audio. Recordings are decoded locally for scoring and are not uploaded by Localingo.

## Export and Delete

Use the Progress tab to export local progress as JSON or reset local progress. Browser site-data controls can also delete all Localingo data.
