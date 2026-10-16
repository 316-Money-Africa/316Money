# tests

Cross-service test suites. Service unit tests live with each service.

**SRS:** SRS-316-AFR-001 §17, §19

## Requirement IDs

- `NFR-10` — Testing: Automated unit, contract, integration, E2E, security and reconciliation suites

## Contents

- [contract/](contract/README.md) — Consumer/provider contract tests against contracts/.
- [e2e/](e2e/README.md) — End-to-end acceptance scenarios from the SRS §19 matrix.
- [provider-sandbox/](provider-sandbox/README.md) — Provider sandbox cases: success, failure, timeout, duplicate/delayed callback and partial reversal.
- [reconciliation/](reconciliation/README.md) — Ledger invariant and reconciliation suites.
- [security/](security/README.md) — Role, cross-tenant, workspace-switch and mobile hardening tests.
