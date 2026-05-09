# 0066 Error Handling Convention

## Status

Accepted

## Context

Async actions currently report errors inconsistently.

## Decision

Every user-facing failure must include:

- what failed
- why it failed in product language
- what the user can do next

Feature actions return notices that the shell can render consistently.

## Consequences

Import, share, speech, and analytics failures become explainable instead of silent or abrupt.
