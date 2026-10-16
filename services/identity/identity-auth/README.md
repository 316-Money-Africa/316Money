# identity-auth

Accounts, MFA, sessions, recovery, step-up auth, workspace-switch tokens and merchant API credentials.

**SRS:** SRS-316-AFR-001 §4, §9

## Requirement IDs

- `MON-006` — Sensitive actions SHALL require risk-based step-up authentication.
- `PAY-007` — Merchants SHALL access API credentials with environment separation, secret rotation and scoped permissions.
- `LINK-001` — The platform SHALL maintain a global identity ID and distinct merchant_org_id and agent_org_id records.
- `LINK-003` — Workspace switching SHALL mint or validate context-bound access tokens with tenant, product, role and scope claims.
- `LINK-004` — Pay permissions SHALL not imply Hotspots permissions and vice versa.
- `LINK-008` — Revocation or suspension of one workspace SHALL not automatically expose or erase another workspace; policy-driven related restrictions SHALL be explicit.
- `LINK-009` — All workspace switches SHALL generate security audit events and invalidate inappropriate cached data.
- `LINK-010` — Users SHALL be able to see linked workspaces and unlink them only when no legal, financial or operational hold prevents it.
- `SEC-001` — The platform SHALL enforce least privilege and context-bound RBAC/ABAC for users, merchants, agents and administrators.
- `SEC-002` — Financially sensitive operations SHALL use MFA/step-up verification, velocity limits and anomaly detection.

## Notes

Linking identities never merges wallets, permissions, liabilities or approvals (SRS §1, §9).
