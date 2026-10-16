# markets

Per-country matrices: currencies, methods, KYC-tier limits, agent cash limits, fees and documents.

**SRS:** SRS-316-AFR-001 §15

## Requirement IDs

- `AFR-CORE-005` — All product capabilities SHALL be gated by jurisdiction, product, user verification tier, provider status and approved feature flags.
- `AFR-CORE-006` — Country configurations SHALL be versioned and require an authorised approval workflow for financial-impacting changes.
- `HOT-REG-005` — Agents SHALL propose cash-in and cash-out charges separately; rates SHALL be validated against country caps, fee disclosures and platform commission policy.

## Notes

Everything is disabled by default until partners, contracts, treasury flows, KYC rules and safeguarding are approved (SRS §1).
