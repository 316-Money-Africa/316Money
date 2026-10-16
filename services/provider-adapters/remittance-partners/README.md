# remittance-partners

UK-origin funding and remittance partner adapters, including inbound reference mapping.

**SRS:** SRS-316-AFR-001 §6.2, §14

## Requirement IDs

- `MON-TR-003` — UK-to-Africa incoming transfers SHALL map partner-provided references to the correct beneficiary wallet and reconcile settlement before final credit.
- `INT-001` — Each provider adapter SHALL declare supported countries, currencies, methods, limits, refund capabilities and callback semantics.
- `INT-003` — Provider webhooks SHALL be authenticated and replay protected.
