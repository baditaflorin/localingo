# 0068 Persistence Schema and Migrations

## Status

Accepted

## Context

Phase 3 adds settings and activity metadata that must survive reloads and handoff.

## Decision

Advance the state schema to include:

- versioned metadata envelope for import/export/share
- persisted settings users can edit
- persisted activity log entries

Imports from prior schema versions are migrated forward in-browser.

## Consequences

Old exports remain usable and new exports become more reproducible.
