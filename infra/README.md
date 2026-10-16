# infra

Deployment, environments, secrets and runtime platform.

**SRS:** SRS-316-AFR-001 §3, §17

## Requirement IDs

- `SEC-003` — The system SHALL encrypt data in transit and at rest and use managed keys and secrets.
- `NFR-01` — Availability: 99.9% monthly for critical platform APIs initially; partner outages tracked separately
- `NFR-06` — Disaster recovery: Proposed critical RPO ≤ 15 minutes and RTO ≤ 4 hours, subject to DR tests
- `NFR-11` — Scalability: Stateless services horizontally scalable; queue backpressure and load tests

## Contents

- [disaster-recovery/](disaster-recovery/README.md) — Backup, restore and DR test definitions.
- [environments/](environments/README.md) — Per-environment deployment definitions (sandbox, staging, pilot, production).
- [observability/](observability/README.md) — Tracing, metrics, alerting and dashboards.
- [secrets/](secrets/README.md) — Managed secrets store and key-rotation configuration.
