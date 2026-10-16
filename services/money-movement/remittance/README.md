# remittance

Cross-border Africa-to-Africa and UK-to-Africa remittances: corridors, beneficiaries, quotes and payouts.

**SRS:** SRS-316-AFR-001 §6.2, §10

## Requirement IDs

- `MON-TR-002` — The system SHALL allow supported Africa-to-Africa remittances only for enabled corridors and approved payout rails.
- `MON-TR-003` — UK-to-Africa incoming transfers SHALL map partner-provided references to the correct beneficiary wallet and reconcile settlement before final credit.
- `MON-TR-005` — The system SHALL display FX rates, payout currency, fees, expected receipt and quote expiry before confirmation.
- `MON-TR-007` — Unsupported corridor, missing KYC or exceeded limits SHALL prevent initiation with an actionable error.
