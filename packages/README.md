# packages

Shared libraries used by services, so every service applies the same cross-cutting rules.

**SRS:** SRS-316-AFR-001 §5, §13

## Contents

- [core-types/](core-types/README.md) — Global IDs, money in currency minor units, UTC ISO 8601 timestamps, market/corridor codes, structured error codes.
- [idempotency/](idempotency/README.md) — Idempotency-key handling and durable business-operation keys.
- [state-machines/](state-machines/README.md) — Canonical transaction state machines and finality rules shared by services and tests.
- [tenancy-guard/](tenancy-guard/README.md) — Context-bound authorisation and cross-tenant protection for APIs, object IDs, caches and background workers.
- [tracing/](tracing/README.md) — Correlation-ID propagation and instrumentation helpers.
