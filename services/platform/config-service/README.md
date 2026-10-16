# config-service

Serves market/corridor/method/cohort configuration and feature flags from config/, with versioning and approval workflow.

**SRS:** SRS-316-AFR-001 §4, §15

## Requirement IDs

- `AFR-CORE-005` — All product capabilities SHALL be gated by jurisdiction, product, user verification tier, provider status and approved feature flags.
- `AFR-CORE-006` — Country configurations SHALL be versioned and require an authorised approval workflow for financial-impacting changes.
- `ADM-005` — Platform administrators SHALL manage market flags, provider health, rates, limits and release cohorts under approval control.
- `ADM-006` — The system SHALL record who changed configurations, previous/new values, justification and effective date.
- `SEC-010` — No production flow SHALL activate before jurisdiction-specific legal and funds-flow sign-off.
