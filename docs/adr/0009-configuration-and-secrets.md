# 0009 Configuration and Secrets

## Status

Accepted

## Context

Mode A has no safe place for secrets. The frontend must never contain API keys or private tokens.

## Decision

Use build-time public configuration only:

- `VITE_APP_BASE`
- `VITE_GITHUB_REPO`

Keep `.env*` ignored and commit `.env.example` with placeholders. Any future secret-backed feature must move to Mode B offline generation or Mode C runtime backend with a new ADR.

## Consequences

The app can be forked and hosted safely. Secrets scanning remains part of local hooks.

## Alternatives Considered

Encrypted or obfuscated frontend secrets were rejected because they are still client-visible.
