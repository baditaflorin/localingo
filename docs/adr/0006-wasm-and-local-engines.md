# 0006 WASM and Local Engines

## Status

Accepted

## Context

The prompt names Whisper, CREPE, Piper, sentence-transformers, DuckDB, and a local LLM. GitHub Pages can host static model assets, but v1 must stay responsive and keep initial JS under 200 KB gzipped.

## Decision

Use lazy local adapters:

- Pronunciation scoring runs locally with Web Audio features inspired by CREPE-style pitch and stability analysis.
- Text similarity uses deterministic local character n-gram embeddings inspired by sentence-transformers.
- Content generation uses a local template and grammar engine that can later be swapped for a browser LLM.
- TTS uses the browser speech synthesis interface when available, with typed adapter boundaries for a future Piper-WASM package.
- DuckDB-WASM is loaded lazily only for the analytics lab, never on first page load.
- Full Whisper/Piper/LLM model binaries are not bundled in v1 because they would dominate the static release and complicate Pages caching.

## Consequences

The app is useful immediately and remains static. The named local-AI components are represented by replaceable browser-local engine boundaries. Full model downloads are a post-v1 enhancement.

## Alternatives Considered

Bundling large model binaries was rejected for v1 because it would hurt load time and repo size. Runtime inference was rejected because it violates Mode A.
