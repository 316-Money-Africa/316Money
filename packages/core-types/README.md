# core-types

Global IDs, money in currency minor units, UTC ISO 8601 timestamps, market/corridor codes, structured error codes.

**SRS:** SRS-316-AFR-001 §5, §13

## Requirement IDs

- `AFR-CORE-001` — Every transaction SHALL carry immutable global IDs, market/corridor codes, actor ID, originating channel, correlation ID and idempotency key where applicable.
- `AFR-CORE-007` — The platform SHALL support time-zone-aware timestamps in UTC and local presentation for users.
