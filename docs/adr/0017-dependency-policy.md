# 0017 Dependency Policy

## Status

Accepted

## Context

The app needs production-ready libraries without bloating first load.

## Decision

Use established packages and keep optional heavy capabilities lazy-loaded:

- Core: React, Vite, TypeScript.
- Data and validation: TanStack Query, zod, idb.
- UI: lucide-react, Tailwind CSS.
- PWA: vite-plugin-pwa.
- Tests: Vitest, Testing Library, Playwright.
- Optional analytics lab: DuckDB-WASM lazy import.

Run `npm audit` before release and keep high/critical vulnerabilities out of v1.

## Consequences

The code stays maintainable and avoids custom reinvention where mature libraries exist.

## Alternatives Considered

Hand-rolled UI and storage abstractions were rejected where stable libraries are available.
