# platform

Cross-cutting shared services.

**SRS:** SRS-316-AFR-001 §3, §4

## Contents

- [approvals/](approvals/README.md) — Maker-checker approval workflow for privileged finance, rate, payout, config and compliance actions.
- [audit-logger/](audit-logger/README.md) — Append-only, tamper-evident business and security audit trail.
- [config-service/](config-service/README.md) — Serves market/corridor/method/cohort configuration and feature flags from config/, with versioning and approval workflow.
- [document-vault/](document-vault/README.md) — Statements, receipts, agent contracts, certificates and compliance documentation.
- [notifications-messaging/](notifications-messaging/README.md) — Push/email/SMS, in-app messages and support case tracking.
- [reporting-analytics/](reporting-analytics/README.md) — Consumer, merchant, agent and admin insights built from eventually consistent read models.
- [webhooks-outbound/](webhooks-outbound/README.md) — Signed, timestamped, retried and replayable merchant webhooks.
