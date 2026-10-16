# 316 Money

Monorepo for 316 Money Africa, 316 Pay Africa, 316 Hotspots and the shared financial core, structured from `316_Africa_Master_SRS.docx` (SRS-316-AFR-001 v1.0).

Each folder's README lists the SRS requirement IDs it owns. An ID can appear in more than one folder when a client surface and a backend service share it; the backend service is the authority for anything monetary.

## Layout

- [apps/](apps/README.md) — Client surfaces / experience layer.
- [services/](services/README.md) — Backend domain services.
- [packages/](packages/README.md) — Shared libraries used by services, so every service applies the same cross-cutting rules.
- [contracts/](contracts/README.md) — API and event contracts.
- [config/](config/README.md) — Country policy and feature-flag layer.
- [infra/](infra/README.md) — Deployment, environments, secrets and runtime platform.
- [tests/](tests/README.md) — Cross-service test suites.
- [docs/](docs/README.md) — Engineering documentation.
