# hotspots-web-mobile

316 Hotspots: agent owner and operator interface (registration, cash ops, float, rates, analytics, documents).

**SRS:** SRS-316-AFR-001 §8

## Requirement IDs

- `HOT-REG-001` — Applicants SHALL select collection, payout or hybrid agent classification, subject to market policy.
- `HOT-REG-002` — Registration SHALL collect agent/merchant identity, business documents, approved operating address, coordinates and proof of eligibility.
- `HOT-REG-003` — Agent activation SHALL require KYC/KYB, risk screening, agreement acceptance, compliance approval and permitted service assignment.
- `HOT-REG-004` — Agents SHALL configure approved service areas, opening hours, contact preferences and temporary availability.
- `HOT-REG-005` — Agents SHALL propose cash-in and cash-out charges separately; rates SHALL be validated against country caps, fee disclosures and platform commission policy.
- `HOT-REG-006` — Material changes to agent rates, bank destinations or operator permissions SHALL be auditable and may require approval.
- `HOT-REG-007` — Agents SHALL access a document centre for contracts, statements, certificates, notices and compliance requests.
- `HOT-CASH-001` — A cash-in intent SHALL bind consumer, agent, amount, currency, rate, fee, expiry and verification challenge.
- `HOT-CASH-002` — The consumer SHALL approve the total cost and destination before cash-in execution.
- `HOT-CASH-003` — An agent SHALL attest receipt of physical cash only within an approved session and limit.
- `HOT-CASH-004` — Wallet credit SHALL occur only after authorised confirmation and defined ledger/provider settlement controls.
- `HOT-CASH-005` — Cash-out SHALL reserve eligible customer funds before an agent receives payout authorisation.
- `HOT-CASH-006` — Cash-out SHALL require customer authentication and agent confirmation of physical disbursement.
- `HOT-CASH-007` — Expired, abandoned or disputed cash-out SHALL release or hold reservations according to a documented recovery policy.
- `HOT-CASH-008` — Agents SHALL be prevented from paying out when float, cash availability, limits or compliance status are insufficient.
- `HOT-CASH-009` — Agent and customer views SHALL show consistent final transaction status and matched receipts.
- `HOT-CASH-010` — Each cash operation SHALL capture location, actor, device, verification result and immutable event trail.
- `HOT-OPS-001` — Agent float SHALL distinguish available electronic float, reserved float, cash-on-hand declarations and unsettled positions.
- `HOT-OPS-002` — Float top-up/rebalancing SHALL use authorised rails and reconciliation, with configurable low-float alerts.
- `HOT-OPS-003` — Agent earnings SHALL itemise gross fees, platform commissions, adjustments and settlement status.
- `HOT-OPS-004` — Agent analytics SHALL include cash-in/out volume, completion rate, fees, repeat customers, disputes and trends.
- `HOT-OPS-005` — Ratings SHALL only be accepted from eligible completed transactions and SHALL support moderation and appeals.
- `HOT-OPS-006` — Agent ranking SHALL use documented scoring factors and SHALL not imply regulated status or financial safety.
- `HOT-OPS-007` — Agents SHALL receive secure in-app support, case tracking, operational notices and escalation options.
- `HOT-OPS-008` — Operators SHALL have individually assigned permissions and transaction limits rather than sharing owner credentials.
- `SEC-009` — Mobile apps SHALL protect tokens using platform secure storage and detect high-risk device conditions as policy requires.
