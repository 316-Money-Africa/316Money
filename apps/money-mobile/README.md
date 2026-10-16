# money-mobile

316 Money Africa: iOS/Android app for individual consumers (wallets, P2P, remittance, tuition, savings, digital products, Hotspot cash access).

**SRS:** SRS-316-AFR-001 §6

## Requirement IDs

- `MON-001` — Mobile onboarding SHALL collect required country, residency, contact details, consent and verification evidence.
- `MON-002` — Wallet availability SHALL be determined by approved jurisdiction and licensed partner capabilities, not UI selection alone.
- `MON-003` — Wallets SHALL support eligible local and foreign currency representations, with explicit distinction between actual accounts and converted display equivalents.
- `MON-004` — Users SHALL view available, pending and reserved funds, statements, fees and transaction details.
- `MON-005` — Users SHALL be able to add verified beneficiaries and manage trusted recipient lists.
- `MON-006` — Sensitive actions SHALL require risk-based step-up authentication.
- `MON-007` — Account restriction, dormancy, closure and residual funds workflows SHALL be supported.
- `MON-TR-001` — Eligible users SHALL initiate in-country P2P transfers with recipient validation, fee preview and final confirmation.
- `MON-TR-002` — The system SHALL allow supported Africa-to-Africa remittances only for enabled corridors and approved payout rails.
- `MON-TR-003` — UK-to-Africa incoming transfers SHALL map partner-provided references to the correct beneficiary wallet and reconcile settlement before final credit.
- `MON-TR-004` — Email-address transfers SHALL distinguish registered recipients from invitation/claim flows and apply expiry, ownership and refund policies.
- `MON-TR-005` — The system SHALL display FX rates, payout currency, fees, expected receipt and quote expiry before confirmation.
- `MON-TR-006` — Transfer tracking SHALL display canonical status, receipt, reference and applicable estimated delivery information.
- `MON-TR-007` — Unsupported corridor, missing KYC or exceeded limits SHALL prevent initiation with an actionable error.
- `MON-ADV-001` — School-fee payments SHALL capture school identity, destination account, student reference, invoice/evidence and purpose-of-payment where required.
- `MON-ADV-002` — Education transfers SHALL undergo beneficiary validation, compliance review, FX disclosure and payout reconciliation.
- `MON-ADV-003` — Money requests SHALL support amount, currency, recipient, expiry, reminders and paid/declined status.
- `MON-ADV-004` — Bill splits SHALL support equal/custom allocation, participant tracking, partial settlements and reminders.
- `MON-ADV-005` — Savings pots SHALL support named goals, recurring rules, round-ups where available, pause and withdrawal under partner-approved terms.
- `MON-ADV-006` — The system SHALL maintain a complete history of savings automation outcomes and failures.
- `MON-EXT-001` — Digital product catalogue SHALL reflect live provider availability and pricing for the customer market.
- `MON-EXT-002` — Reloadly gift-card/airtime orders SHALL maintain fulfilment state, provider reference, delivery details and dispute/refund exceptions.
- `MON-EXT-003` — Virtual gift cards SHALL not be represented as general-purpose payment cards unless the issuer/provider supports that capability.
- `MON-EXT-004` — Eligible users SHALL pay participating merchants from 316 Money balance via an authorised 316 Pay checkout flow.
- `MON-EXT-005` — Users SHALL locate approved Hotspots by geography, availability, service type, displayed charges and applicable ratings.
- `MON-EXT-006` — Cash top-up and withdrawal SHALL require a unique transaction reference, amount confirmation and controlled completion evidence.
- `MON-EXT-007` — Customer and agent SHALL receive matching transaction receipts; cash handover shall not by itself authorise unsupported ledger posting.
- `SEC-009` — Mobile apps SHALL protect tokens using platform secure storage and detect high-risk device conditions as policy requires.

## Notes

UI and secure on-device token storage only; all monetary validation and posting happens server-side (AFR-CORE-002).
