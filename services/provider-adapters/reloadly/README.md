# reloadly

Reloadly digital catalogue and gift-card/airtime fulfilment adapter.

**SRS:** SRS-316-AFR-001 §6.4, §14

## Requirement IDs

- `MON-EXT-001` — Digital product catalogue SHALL reflect live provider availability and pricing for the customer market.
- `MON-EXT-002` — Reloadly gift-card/airtime orders SHALL maintain fulfilment state, provider reference, delivery details and dispute/refund exceptions.
- `MON-EXT-003` — Virtual gift cards SHALL not be represented as general-purpose payment cards unless the issuer/provider supports that capability.
- `INT-001` — Each provider adapter SHALL declare supported countries, currencies, methods, limits, refund capabilities and callback semantics.
- `INT-003` — Provider webhooks SHALL be authenticated and replay protected.
