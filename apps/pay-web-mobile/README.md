# pay-web-mobile

316 Pay Africa: merchant dashboard (web) and mobile POS for businesses.

**SRS:** SRS-316-AFR-001 §7

## Requirement IDs

- `PAY-001` — Merchant onboarding SHALL capture legal business details, beneficial ownership, KYB evidence and approved settlement destinations.
- `PAY-002` — Merchant organisations SHALL support owner/admin/finance/developer/cashier roles and branch/outlet scoping.
- `PAY-003` — Merchant dashboard SHALL show payment volume, success rates, fees, refunds, unsettled amounts and settlements.
- `PAY-004` — Merchants SHALL create payment intents, hosted checkout sessions, reusable/one-time links and QR payment requests.
- `PAY-005` — Payment methods SHALL be restricted to eligible country/provider combinations and customer instruments.
- `PAY-006` — Provider attempts SHALL be correlated to one payment intent and protected against unsafe duplicate execution.
- `PAY-007` — Merchants SHALL access API credentials with environment separation, secret rotation and scoped permissions.
- `PAY-008` — Webhooks SHALL be signed, timestamped, retried with backoff and safely replayable.
- `PAY-009` — Mobile POS SHALL support cashier sessions, payment requests, confirmation, receipt and shift reconciliation.
- `PAY-010` — Refunds SHALL enforce role permissions, provider eligibility, balance availability and approval policy.
- `PAY-011` — Settlement reports SHALL itemise gross collections, provider fees, platform fees, refunds, reserves and net payouts.
- `PAY-012` — Merchant reconciliation SHALL identify unmatched provider transactions, settlement variance and aging exceptions.
- `PAY-013` — Merchants SHALL be able to apply to the Hotspots programme without bypassing separate agent vetting.
- `PAY-014` — A linked merchant SHALL see a Hotspots workspace switch only after approval and explicit authorisation.
- `SEC-009` — Mobile apps SHALL protect tokens using platform secure storage and detect high-risk device conditions as policy requires.

## Notes

If web and mobile end up on different stacks, split into pay-web/ and pay-mobile/.
