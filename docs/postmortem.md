# Postmortem

## What Was Built

Localingo v0.1.0 is a static GitHub Pages language-learning app with:

- A Spanish quickstart course.
- Choice, typed, grammar, and speech exercises.
- SM-2-inspired spaced repetition.
- IndexedDB local persistence.
- Local grammar feedback.
- Deterministic local embeddings and generated drills.
- Web Audio pronunciation scoring.
- Lazy DuckDB-WASM analytics.
- PWA app shell.
- Public GitHub, PayPal, version, and commit links in the UI.

Live site:
https://baditaflorin.github.io/localingo/

Repository:
https://github.com/baditaflorin/localingo

## Was Mode A Correct?

Yes. Mode A was correct for v1. The product does not need accounts, server-side mutations, secrets, payments, cross-device sync, or hosted model inference. GitHub Pages is enough for the public app.

The main compromise is model depth: full Whisper, Piper, and local LLM binaries are not bundled in v0.1.0. The app instead ships local adapter boundaries and useful deterministic local engines. That kept the app static, fast on first load, and deployable from day one.

## What Worked

- GitHub Pages from `/docs` kept deployment simple.
- The local-first state model made privacy straightforward.
- The lesson and review loop became testable quickly.
- Lazy DuckDB-WASM kept the first-load JavaScript under budget.

## What Did Not Work

- DuckDB-WASM adds a large lazy static asset, about 38 MB.
- GitHub Pages cannot set COOP/COEP headers, which limits some high-performance WASM/threaded model options.
- Browser microphone APIs vary, so speech scoring needs graceful fallback.

## Surprises

- The PWA precache initially tried to cache the DuckDB-WASM binary and failed the build.
- Vitest's default glob picked up Playwright specs until the test lanes were split.

## Accepted Tech Debt

- Full Whisper/Piper/browser LLM model loading is deferred.
- Course content is small and bundled in TypeScript.
- Generated drills are template-based, not model-generated.
- Commit display uses the public GitHub API with build commit fallback.

## Next 3 Improvements

1. Add a real optional local model pack with explicit downloads and cache controls.
2. Add a course authoring format so contributors can add languages without editing TypeScript.
3. Add richer speech feedback with phoneme-level alignment when a static-friendly engine is selected.

## Time Spent Vs Estimate

Estimated: one focused implementation session for v0.1.0.

Actual: one focused implementation session. Most time went into wiring static deployment, local persistence, tests, and Pages-safe build output.
