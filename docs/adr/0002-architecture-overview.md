# 0002 Architecture Overview

## Status

Accepted

## Context

The product needs an app-like learning surface with durable local progress and no runtime backend.

## Decision

Use a browser-only architecture with these module boundaries:

- `src/app`: shell, providers, layout, build metadata, and global error handling.
- `src/data`: bundled seed curriculum.
- `src/features/lesson`: lesson flow, exercises, XP, and immediate feedback.
- `src/features/review`: spaced repetition queue and scheduler.
- `src/features/speech`: microphone capture and pronunciation scoring.
- `src/features/grammar`: local grammar and answer feedback.
- `src/features/generation`: local practice generation.
- `src/features/analytics`: local progress summaries and optional DuckDB-WASM exploration.
- `src/lib`: storage, normalization, GitHub metadata, and shared utilities.

## Consequences

Feature code remains isolated and testable. Browser-only persistence makes privacy straightforward, but account sync remains outside v1.

## Alternatives Considered

A server API was rejected because it would add deployment and security surface without improving v1 learning loops.
