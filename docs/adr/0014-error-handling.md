# 0014 Error Handling

## Status

Accepted

## Context

Browser APIs for microphone, speech synthesis, storage, and model loading can fail or be unavailable.

## Decision

Use typed result objects for feature failures that are expected, React error boundaries for unexpected render errors, and user-visible inline recovery states. Never crash the app because an optional local engine is unavailable.

## Consequences

The app degrades gracefully. Error paths need tests where behavior is central.

## Alternatives Considered

Global `try/catch` wrappers were rejected because they hide domain-specific recovery.
