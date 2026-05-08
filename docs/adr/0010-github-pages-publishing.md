# 0010 GitHub Pages Publishing

## Status

Accepted

## Context

The live Pages URL is a first-class deliverable from the first commit. Documentation also lives under `docs/`.

## Decision

Publish GitHub Pages from `main` branch `/docs`.

Vite builds the app into `docs/` with `emptyOutDir: false` so ADRs and documentation are preserved. App assets are hashed under `docs/assets/`. A generated `docs/404.html` mirrors `docs/index.html` for SPA fallback.

Base path:

`/localingo/`

Live URL:

https://baditaflorin.github.io/localingo/

Repository URL:

https://github.com/baditaflorin/localingo

## Consequences

The built frontend is committed. `.gitignore` ignores `dist/` but not `docs/`. Documentation and static app output share one tree, so build scripts must preserve Markdown files.

## Alternatives Considered

A `gh-pages` branch was considered but rejected to keep local publishing simple without GitHub Actions.
