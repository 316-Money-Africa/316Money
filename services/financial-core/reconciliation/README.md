# reconciliation

Ledger, provider and bank matching; exception queue; daily formal and intraday checks.

**SRS:** SRS-316-AFR-001 §11

## Requirement IDs

- `LED-008` — Provider statements and bank statements SHALL reconcile to internal transaction and ledger references.
- `LED-009` — Unmatched, duplicate, missing or stale settlement items SHALL enter a tracked exception queue.
- `LED-010` — The system SHALL support daily formal reconciliation and risk-based intraday checks.
- `PAY-012` — Merchant reconciliation SHALL identify unmatched provider transactions, settlement variance and aging exceptions.
- `MON-TR-003` — UK-to-Africa incoming transfers SHALL map partner-provided references to the correct beneficiary wallet and reconcile settlement before final credit.
- `INT-006` — Provider status and balance reconciliation SHALL be available to authorised operators.
- `NFR-05` — Reconciliation: Daily formal reconciliation, risk-based intraday checks, all exceptions tracked
