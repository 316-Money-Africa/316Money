# banking-psp

Local bank and card PSP adapters.

**SRS:** SRS-316-AFR-001 §14

## Requirement IDs

- `INT-001` — Each provider adapter SHALL declare supported countries, currencies, methods, limits, refund capabilities and callback semantics.
- `INT-003` — Provider webhooks SHALL be authenticated and replay protected.
- `INT-007` — Sandbox tests SHALL validate success, failure, timeout, duplicate callback, delayed callback and partial reversal cases.
