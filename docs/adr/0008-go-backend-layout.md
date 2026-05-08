# 0008 Go Backend Layout

## Status

Accepted

## Context

The bootstrap prompt defines Go layout requirements for Modes B and C.

## Decision

Do not create a Go backend in Mode A. If the project moves to Mode B or C, use `cmd/`, `internal/`, `pkg/`, `api/`, `configs/`, `scripts/`, and `test/` following the requested Go project layout.

## Consequences

The v1 repo stays smaller and avoids unused backend scaffolding.

## Alternatives Considered

Creating empty Go directories was rejected because it would imply a backend that does not exist.
