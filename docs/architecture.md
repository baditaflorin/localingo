# Architecture

Localingo is a Mode A static application published from GitHub Pages.

Live site:
https://baditaflorin.github.io/localingo/

Repository:
https://github.com/baditaflorin/localingo

## Context

```mermaid
C4Context
  title Localingo System Context
  Person(learner, "Learner", "Language learner using one browser/device")
  System(localingo, "Localingo", "Static local-first language tutor")
  System_Ext(githubPages, "GitHub Pages", "Static hosting")
  System_Ext(githubApi, "GitHub REST API", "Public commit metadata")
  Rel(learner, localingo, "Practices lessons, reviews cards, exports progress")
  Rel(localingo, githubPages, "Served from")
  Rel(localingo, githubApi, "Fetches public main commit")
```

## Containers

```mermaid
C4Container
  title Localingo Containers
  Person(learner, "Learner", "Uses the app")
  System_Boundary(browser, "Learner Browser") {
    Container(spa, "React SPA", "React, TypeScript, Vite", "Lesson flow, SRS, grammar, generation, progress")
    ContainerDb(db, "IndexedDB", "idb", "Profile, attempts, SRS cards, settings")
    Container(audio, "Speech scorer", "Web Audio", "RMS, pitch, clarity, local pronunciation score")
    Container(sql, "Analytics lab", "DuckDB-WASM", "Lazy local SQL summary")
    Container(pwa, "Service worker", "vite-plugin-pwa", "Offline app shell cache")
  }
  System_Ext(githubApi, "GitHub REST API", "Public data")
  Rel(learner, spa, "Interacts")
  Rel(spa, db, "Persists progress")
  Rel(spa, audio, "Scores recordings")
  Rel(spa, sql, "Loads on demand")
  Rel(spa, pwa, "Registers")
  Rel(spa, githubApi, "Reads current main commit")
```

## Module Boundaries

- `src/app`: shell, tabs, build metadata, error boundary.
- `src/data`: bundled seed course.
- `src/features/lesson`: lesson UI inside `App.tsx`.
- `src/features/review`: spaced repetition scheduler.
- `src/features/grammar`: answer and grammar feedback.
- `src/features/generation`: local embeddings and generated drills.
- `src/features/speech`: recording hook and pronunciation scoring.
- `src/features/analytics`: progress summaries and DuckDB-WASM lab.
- `src/lib`: storage, export/import, normalization, GitHub metadata.

## Pages Boundary

Everything under `docs/` is public. No secrets are allowed in the frontend. The app can call only unauthenticated public APIs or local browser APIs.
