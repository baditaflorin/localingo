# 0011 Logging

## Status

Accepted

## Context

Mode A has no server logs. Browser console noise should be minimal in production.

## Decision

Use a tiny `logger` wrapper. Development may log diagnostics. Production logs only unexpected errors and user-actionable failures. No PII is logged.

## Consequences

The production console remains quiet. Debugging relies on local reproduction and browser devtools.

## Alternatives Considered

Remote logging was rejected because it introduces privacy and infrastructure concerns.
