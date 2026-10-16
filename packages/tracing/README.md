# tracing

Correlation-ID propagation and instrumentation helpers.

**SRS:** SRS-316-AFR-001 §5, §17

## Requirement IDs

- `AFR-CORE-001` — Every transaction SHALL carry immutable global IDs, market/corridor codes, actor ID, originating channel, correlation ID and idempotency key where applicable.
- `NFR-07` — Observability: 100% financial operations correlation-ID traced end-to-end
