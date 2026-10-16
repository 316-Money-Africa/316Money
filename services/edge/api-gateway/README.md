# api-gateway

Gateway: WAF integration, request IDs, scope checks, throttling and strict schema validation.

**SRS:** SRS-316-AFR-001 §3, §13

## Requirement IDs

- `AFR-CORE-001` — Every transaction SHALL carry immutable global IDs, market/corridor codes, actor ID, originating channel, correlation ID and idempotency key where applicable.
- `SEC-001` — The platform SHALL enforce least privilege and context-bound RBAC/ABAC for users, merchants, agents and administrators.
- `NFR-02` — Read latency: P95 < 500 ms for internal ordinary reads excluding partner latency
- `NFR-03` — API processing: Payment/cash initiation acknowledgement target < 2 seconds excluding provider confirmation
