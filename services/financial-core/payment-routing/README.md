# payment-routing

Provider eligibility, attempt control and failover. Never blind re-execution after a timeout.

**SRS:** SRS-316-AFR-001 §4, §14

## Requirement IDs

- `PAY-005` — Payment methods SHALL be restricted to eligible country/provider combinations and customer instruments.
- `PAY-006` — Provider attempts SHALL be correlated to one payment intent and protected against unsafe duplicate execution.
- `INT-004` — Provider timeouts SHALL create an unknown/pending outcome until verified; blind re-execution SHALL be prohibited.
- `INT-005` — Routing SHALL use health, market eligibility, costs, limits and transaction risk without breaching provider contracts.
