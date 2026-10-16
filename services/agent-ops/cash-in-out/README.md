# cash-in-out

Cash-in and cash-out intents, reservations, verification challenges and completion evidence.

**SRS:** SRS-316-AFR-001 §8.2, §10

## Requirement IDs

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
- `MON-EXT-006` — Cash top-up and withdrawal SHALL require a unique transaction reference, amount confirmation and controlled completion evidence.
- `MON-EXT-007` — Customer and agent SHALL receive matching transaction receipts; cash handover shall not by itself authorise unsupported ledger posting.
- `SEC-006` — Agent cash workflows SHALL use anti-collusion controls, transaction limits, unique challenges and fraud investigation capability.
