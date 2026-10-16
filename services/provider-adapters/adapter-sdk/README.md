# adapter-sdk

Shared adapter contract: capability declaration, webhook authentication/replay protection, timeout→unknown handling, sandbox test harness.

**SRS:** SRS-316-AFR-001 §14

## Requirement IDs

- `INT-001` — Each provider adapter SHALL declare supported countries, currencies, methods, limits, refund capabilities and callback semantics.
- `INT-003` — Provider webhooks SHALL be authenticated and replay protected.
- `INT-004` — Provider timeouts SHALL create an unknown/pending outcome until verified; blind re-execution SHALL be prohibited.
- `INT-007` — Sandbox tests SHALL validate success, failure, timeout, duplicate callback, delayed callback and partial reversal cases.
