# 0003 Frontend Framework and Build Tooling

## Status

Accepted

## Context

The app needs a polished interactive UI, strict TypeScript, fast local development, and a GitHub Pages build.

## Decision

Use React, TypeScript strict mode, and Vite. Use Tailwind CSS for styling, lucide-react for icons, zod for runtime schemas, TanStack Query for cacheable async data, idb for IndexedDB, Vitest for unit tests, and Playwright for smoke/e2e tests.

## Consequences

The stack is familiar, production-proven, and easy to host statically. The initial bundle must be watched carefully because React and UI code consume much of the 200 KB gzipped budget.

## Alternatives Considered

Svelte and Solid were considered for smaller bundles. React was chosen because the ecosystem for Vite, testing, and PWA tooling is broader.
