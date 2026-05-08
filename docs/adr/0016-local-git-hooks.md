# 0016 Local Git Hooks

## Status

Accepted

## Context

The prompt requires local hooks and no GitHub Actions.

## Decision

Use plain `.githooks/` scripts wired through:

`git config core.hooksPath .githooks`

Hooks:

- `pre-commit`: format check, lint, TypeScript check, and gitleaks staged scan when installed.
- `commit-msg`: Conventional Commits validation.
- `pre-push`: `make test`, `make build`, `make smoke`.
- `post-merge` and `post-checkout`: dependency/build hints only.

## Consequences

Hooks are transparent shell scripts and require no extra hook manager. Developers should install `gitleaks` locally for full secret scanning.

## Alternatives Considered

Lefthook was considered but rejected to reduce dependencies.
