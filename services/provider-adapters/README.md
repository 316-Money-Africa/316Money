# provider-adapters

Managed provider integrations behind one adapter contract. Each provider stays subject to technical, commercial, regulatory and contractual verification.

**SRS:** SRS-316-AFR-001 §14

## Requirement IDs

- `INT-001` — Each provider adapter SHALL declare supported countries, currencies, methods, limits, refund capabilities and callback semantics.
- `INT-002` — Provider secrets SHALL be held in a managed secrets store and rotated under policy.
- `INT-003` — Provider webhooks SHALL be authenticated and replay protected.
- `INT-004` — Provider timeouts SHALL create an unknown/pending outcome until verified; blind re-execution SHALL be prohibited.
- `INT-005` — Routing SHALL use health, market eligibility, costs, limits and transaction risk without breaching provider contracts.
- `INT-006` — Provider status and balance reconciliation SHALL be available to authorised operators.
- `INT-007` — Sandbox tests SHALL validate success, failure, timeout, duplicate callback, delayed callback and partial reversal cases.

## Contents

- [adapter-sdk/](adapter-sdk/README.md) — Shared adapter contract: capability declaration, webhook authentication/replay protection, timeout→unknown handling, sandbox test harness.
- [banking-psp/](banking-psp/README.md) — Local bank and card PSP adapters.
- [fx-providers/](fx-providers/README.md) — FX rate provider adapters.
- [kyc-providers/](kyc-providers/README.md) — KYC/KYB and screening provider adapters.
- [mobile-money/](mobile-money/README.md) — Mobile money operator adapters and signature verifiers.
- [reloadly/](reloadly/README.md) — Reloadly digital catalogue and gift-card/airtime fulfilment adapter.
- [remittance-partners/](remittance-partners/README.md) — UK-origin funding and remittance partner adapters, including inbound reference mapping.
