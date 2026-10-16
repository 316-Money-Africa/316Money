# financial-core

Central financial core. Posting authority lives here; read models elsewhere are eventually consistent.

**SRS:** SRS-316-AFR-001 §3, §4, §11

## Requirement IDs

- `AFR-CORE-002` — Every monetary action SHALL use server-side validation and ledger-controlled posting.
- `AFR-CORE-004` — All money movements SHALL have audit-linked states and recoverable error handling.

## Contents

- [account-wallet/](account-wallet/README.md) — Wallet definitions, eligibility, holds, currency representation and partner mappings.
- [fx-quote/](fx-quote/README.md) — FX pricing, quote expiry and rate locks.
- [ledger/](ledger/README.md) — Immutable double-entry ledger: journals, lines, balances, holds, reversals via compensating entries.
- [payment-intent/](payment-intent/README.md) — Payment intents, hosted checkout, payment links/QR, POS payment requests and lifecycle state.
- [payment-routing/](payment-routing/README.md) — Provider eligibility, attempt control and failover.
- [reconciliation/](reconciliation/README.md) — Ledger, provider and bank matching; exception queue; daily formal and intraday checks.
- [refund-dispute/](refund-dispute/README.md) — Refunds, reversals, claims, chargebacks and evidence.
- [settlement-payout/](settlement-payout/README.md) — Merchant and agent settlements and payout scheduling.
