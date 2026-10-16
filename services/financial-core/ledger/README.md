# ledger

Immutable double-entry ledger: journals, lines, balances, holds, reversals via compensating entries.

**SRS:** SRS-316-AFR-001 §11, §12

## Requirement IDs

- `LED-001` — Ledger postings SHALL be double-entry and balanced per accounting currency, with explicit FX bridge postings where required.
- `LED-002` — All financial postings SHALL be immutable; correction SHALL occur through linked compensating entries.
- `LED-003` — Ledger write operations SHALL be idempotent using a durable unique business-operation key.
- `LED-004` — Account balances SHALL be derived from posted journal entries and controlled holds, not mutable client fields.
- `LED-005` — Cash-in SHALL record the legally correct liability and agent/provider receivable or settlement position.
- `LED-006` — Cash-out SHALL reserve/debit customer liability and record agent settlement exposure according to the approved funds flow.
- `LED-007` — Agent commissions and merchant fees SHALL be posted separately from principal.
- `AFR-CORE-002` — Every monetary action SHALL use server-side validation and ledger-controlled posting.
- `AFR-CORE-008` — Every business/agent financial account SHALL remain logically distinct from consumer and other merchant accounts.
- `LINK-005` — Merchant funds, agent float, consumer balances and settlement accounts SHALL use distinct ledger accounts.
- `NFR-04` — Integrity: Zero unbalanced posted ledger journals; zero duplicate posting per operation key
