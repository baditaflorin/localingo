# 0001 Deployment Mode

## Status

Accepted

## Context

Localingo must be public, privacy-preserving, cheap to host, and usable without a runtime service. The requested product needs lessons, gamification, spaced repetition, speech feedback, grammar checking, generated practice, and local persistence.

GitHub Pages can host static assets but cannot set custom COOP/COEP headers, cannot keep secrets, and cannot run background server jobs. The v1 scope does not require accounts, cross-device sync, paid APIs, or server-side mutations.

## Decision

Use Mode A: Pure GitHub Pages.

The app is a Vite-built static site published from the `main` branch `/docs` directory at:

https://baditaflorin.github.io/localingo/

All v1 state is stored client-side. Local learning logic runs in browser TypeScript and workers. Heavy engines are lazy-loaded behind user actions. Public GitHub metadata is fetched directly from the unauthenticated GitHub REST API only to display the current commit.

## Consequences

- No backend, Docker image, nginx, runtime database, or server secrets are part of v1.
- User progress is private to the browser and device.
- Cross-device sync is a non-goal.
- AI features must remain local-first and degrade gracefully when model capabilities are unavailable.
- GitHub Pages limitations shape routing, service worker scope, and asset loading.

## Alternatives Considered

- Mode B: rejected for v1 because there is no large shared dataset requiring a scheduled generator.
- Mode C: rejected for v1 because auth, server-side inference, and cross-device sync are not required.
