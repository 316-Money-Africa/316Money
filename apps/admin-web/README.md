# admin-web

Internal admin console for compliance analysts, finance operators, support and scoped superadmins.

**SRS:** SRS-316-AFR-001 §2, §18

## Requirement IDs

- `ADM-001` — Superadmin SHALL provide scoped customer, merchant and agent records with approval history.
- `ADM-002` — Finance operators SHALL inspect ledger journals, provider attempts, settlement batches and unmatched items.
- `ADM-003` — Compliance users SHALL review KYC/KYB, agent approval, suspicious activity and restrictions.
- `ADM-004` — Support SHALL access masked records and case history without unrestricted financial mutation privileges.
- `ADM-005` — Platform administrators SHALL manage market flags, provider health, rates, limits and release cohorts under approval control.
- `ADM-006` — The system SHALL record who changed configurations, previous/new values, justification and effective date.
- `ADM-007` — Dashboards SHALL distinguish actual settled revenue from pending gross payment volume.

## Notes

Privileged actions go through platform/approvals (maker-checker).
