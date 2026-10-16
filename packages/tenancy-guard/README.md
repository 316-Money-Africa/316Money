# tenancy-guard

Context-bound authorisation and cross-tenant protection for APIs, object IDs, caches and background workers.

**SRS:** SRS-316-AFR-001 §9

## Requirement IDs

- `LINK-003` — Workspace switching SHALL mint or validate context-bound access tokens with tenant, product, role and scope claims.
- `LINK-004` — Pay permissions SHALL not imply Hotspots permissions and vice versa.
- `LINK-007` — The system SHALL prevent cross-tenant access through API, object ID manipulation, cached queries and background workers.
- `SEC-001` — The platform SHALL enforce least privilege and context-bound RBAC/ABAC for users, merchants, agents and administrators.
