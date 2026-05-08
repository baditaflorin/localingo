# 0015 Deployment Topology

## Status

Accepted

## Context

Mode A deploys to GitHub Pages only.

## Decision

Serve all production assets from:

https://baditaflorin.github.io/localingo/

There is no backend server, Docker Compose stack, nginx config, Prometheus, or GHCR image in v1.

## Consequences

Deployment is a git push containing a fresh `docs/` build. Rollback is a git revert of the publishing commit.

## Alternatives Considered

Docker hosting was rejected because no runtime API is needed.
