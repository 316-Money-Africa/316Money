# edge

Edge layer: CDN/WAF/API gateway plus one BFF per client surface.

**SRS:** SRS-316-AFR-001 §3

## Requirement IDs

- `NFR-02` — Read latency: P95 < 500 ms for internal ordinary reads excluding partner latency
- `NFR-03` — API processing: Payment/cash initiation acknowledgement target < 2 seconds excluding provider confirmation

## Contents

- [api-gateway/](api-gateway/README.md) — Gateway: WAF integration, request IDs, scope checks, throttling and strict schema validation.
- [bff-admin/](bff-admin/README.md) — BFF for admin-web: masked records, case history and scoped admin views.
- [bff-hotspots/](bff-hotspots/README.md) — BFF for hotspots-web-mobile: agent and operator views.
- [bff-money/](bff-money/README.md) — BFF for money-mobile: session handling and orchestration views for consumer flows.
- [bff-pay/](bff-pay/README.md) — BFF for pay-web-mobile: merchant dashboard, POS and developer views.
