# 0061 Input Pathway Coverage Policy

## Status

Accepted

## Context

The app currently supports direct interaction and file import, but it does not support the alternate entry paths users expect from a static app.

## Decision

Support these state input paths in Phase 3:

- file picker JSON import
- drag-and-drop JSON import
- pasted JSON import
- shared URL hash import
- restored autosave from IndexedDB

Inputs outside the product's current scope, such as arbitrary third-party course formats, stay out of scope.

## Consequences

The app becomes usable across tabs and devices without a backend.
