# idempotency

Idempotency-key handling and durable business-operation keys.

**SRS:** SRS-316-AFR-001 §5, §11

## Requirement IDs

- `AFR-CORE-001` — Every transaction SHALL carry immutable global IDs, market/corridor codes, actor ID, originating channel, correlation ID and idempotency key where applicable.
- `LED-003` — Ledger write operations SHALL be idempotent using a durable unique business-operation key.
