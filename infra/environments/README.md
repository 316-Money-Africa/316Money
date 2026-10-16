# environments

Per-environment deployment definitions (sandbox, staging, pilot, production).

**SRS:** SRS-316-AFR-001 §17, §20

## Requirement IDs

- `NFR-01` — Availability: 99.9% monthly for critical platform APIs initially; partner outages tracked separately
- `NFR-11` — Scalability: Stateless services horizontally scalable; queue backpressure and load tests
- `SEC-010` — No production flow SHALL activate before jurisdiction-specific legal and funds-flow sign-off.
