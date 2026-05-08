# 0007 Data Generation Pipeline

## Status

Accepted

## Context

Mode B is not used in v1.

## Decision

There is no scheduled data-generation pipeline in v1. `make data` validates the bundled curriculum and emits no external artifacts.

## Consequences

No generated release artifacts are required. Future large courses can introduce Mode B with a new ADR.

## Alternatives Considered

A Go generator was considered but rejected because the seed curriculum is small and hand-authored.
