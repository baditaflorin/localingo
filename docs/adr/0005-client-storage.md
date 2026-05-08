# 0005 Client Storage

## Status

Accepted

## Context

The app needs durable progress, review scheduling, XP, streaks, and attempt history without accounts.

## Decision

Use IndexedDB through `idb` for structured state and `localStorage` only for a tiny boot flag. Keep all records under a single database named `localingo`.

Stores:

- `profile`
- `cards`
- `attempts`
- `settings`

## Consequences

State survives reloads and works offline. Users can clear browser storage to reset. Cross-device sync remains out of scope.

## Alternatives Considered

`localStorage` alone was rejected because SRS cards and attempts are structured data. OPFS was not needed for v1.
