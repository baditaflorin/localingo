# 0012 Metrics and Observability

## Status

Accepted

## Context

The app is static and local-first. Usage analytics are optional and can easily become privacy-invasive.

## Decision

Do not include analytics in v1. Surface local-only progress metrics inside the app: XP, streak, due reviews, accuracy, and practice minutes.

## Consequences

There is no product telemetry, tracking script, or external beacon. The project cannot measure global usage without future opt-in analytics.

## Alternatives Considered

Plausible and a Cloudflare Worker beacon were considered and rejected for v1.
