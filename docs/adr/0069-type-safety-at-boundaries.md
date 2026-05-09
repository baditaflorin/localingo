# 0069 Type Safety at Boundaries

## Status

Accepted

## Context

The app already validates some boundaries but still uses a few direct casts.

## Decision

- validate imported state with zod
- validate shared hash payloads with zod
- remove straightforward UI-level casts where a typed helper is clearer
- keep unavoidable browser boundary narrowing localized

## Consequences

The app keeps user-owned state trustworthy without adding ceremony to every internal call.
