# services

Backend domain services. Kept as logical bounded contexts first; ledger, payment-routing, cash-in-out and reconciliation are the first candidates for independent deployment (SRS §4 deployment guidance).

**SRS:** SRS-316-AFR-001 §3, §4

## Contents

- [agent-ops/](agent-ops/README.md) — 316 Hotspots operational domains.
- [edge/](edge/README.md) — Edge layer: CDN/WAF/API gateway plus one BFF per client surface.
- [financial-core/](financial-core/README.md) — Central financial core.
- [identity/](identity/README.md) — Identity, profiles, organisations, agent network and verification.
- [money-movement/](money-movement/README.md) — Consumer money-movement domains for 316 Money.
- [platform/](platform/README.md) — Cross-cutting shared services.
- [provider-adapters/](provider-adapters/README.md) — Managed provider integrations behind one adapter contract.
- [risk-compliance/](risk-compliance/README.md) — Risk and AML controls.
