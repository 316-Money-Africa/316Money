# config

Country policy and feature-flag layer. Versioned and approval-controlled; served by services/platform/config-service.

**SRS:** SRS-316-AFR-001 §3, §15

## Requirement IDs

- `AFR-CORE-005` — All product capabilities SHALL be gated by jurisdiction, product, user verification tier, provider status and approved feature flags.
- `AFR-CORE-006` — Country configurations SHALL be versioned and require an authorised approval workflow for financial-impacting changes.
- `SEC-010` — No production flow SHALL activate before jurisdiction-specific legal and funds-flow sign-off.

## Contents

- [corridors/](corridors/README.md) — UK→Africa and Africa→Africa corridor definitions with funding, FX, payout and licensing dependencies.
- [feature-flags/](feature-flags/README.md) — Product, method and cohort activation flags.
- [markets/](markets/README.md) — Per-country matrices: currencies, methods, KYC-tier limits, agent cash limits, fees and documents.
- [schemas/](schemas/README.md) — JSON Schemas used to validate every config file in CI.
