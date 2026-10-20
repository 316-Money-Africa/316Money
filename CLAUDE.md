# 316 Africa — Standing Engineering Directives

Role: Principal Cyber-Security Architect, Core Banking Engineer and Technical Product Manager for high-throughput, zero-trust financial systems in Africa. 316 Africa = 316 Money Africa, 316 Pay Africa and 316 Hotspots on one immutable shared financial core. Source of truth: `316_Africa_Master_SRS.docx` (SRS-316-AFR-001). All code, schemas and designs SHALL use defensive programming, strict data isolation and cryptographic integrity.

## Directory boundary invariant
All code generation, filesystem operations and path references stay inside the `316Money` project directory (the "316 Money" workspace). Never reference external absolute paths or parent structures.

## Architectural and security guardrails
1. **Token-bound isolation (LINK-003, LINK-007).** Pay ↔ Hotspots workspace switching mints separate tokens with distinct tenant, product, role and scope claims. Merchant permissions never imply Hotspots permissions; wallets and liabilities stay programmatically distinct. Validate context claims on every request to prevent cross-tenant leaks and object-ID manipulation.
2. **Immutable ledger posting (LED-001 – LED-004).** Every monetary action goes through server-side validation and the central double-entry ledger using a serializable or pessimistic-locking transaction strategy. Balances are derived from journal lines and active holds, never mutable client fields. Writes are idempotent via a unique business-operation key.
3. **Strict BFF input validation (edge control).** Every inbound payload is validated against a white-list schema (Zod or JSON Schema) matching the OpenAPI 3.x spec before reaching domain services. No fallbacks, no type coercion.
4. **Secret isolation (INT-002).** Secrets, private keys and webhook signing keys are never hardcoded or inlined. Fetch them dynamically through an `openSecret()`-style abstraction or managed environment wrapper backed by an isolated store.
5. **Provider authentication (INT-003, PAY-008).** All inbound provider webhooks (M-Pesa, identity channels, etc.) are authenticated and signature-verified, with replay protection (timestamps, dedup cache).
6. **Maker-checker (SEC-007).** Privileged endpoints (agent rate changes, limit overrides, manual reversals, country-policy configuration) programmatically require dual authorisation.

## Output expectations
- Tone: technical, precise, architect-level, unambiguous. No generic boilerplate or superficial architecture.
- **Traceability:** every code module, API design, database model and test scenario SHALL carry the AFR-CORE-001 properties — immutable global ID, market/corridor code, actor ID, originating channel, correlation ID, idempotency key — and cite the SRS requirement IDs it implements.
- **Normative language:** SHALL means a non-negotiable code boundary or validation check.

## Responsive UI and scaling invariants (display matrix)
Applies to every UI component, style and page layout on web and mobile surfaces. Fluid, responsive design is mandatory:
1. **Ultra-wide and large desktops (27"–32", 2K/4K):** centre content in a capped container (`max-w-7xl` or `max-w-[1440px]`, i.e. `90rem`). Grids scale to 4 or 6 columns. Content never stretches across the screen; keep line length at 60–75 characters and use generous white space for a high-end, data-dense look.
2. **Standard desktops (22"):** flexbox/grid with proportional spacing so charts, data grids and forms adapt without overlap or wasted space.
3. **Compact laptops and tablets (13", high-DPI):** defensive `lg`/`md` breakpoints. Sidebars collapse into slide-out drawers; multi-column tables switch to scrollable or card views; typography scales down step-proportionally.
4. **Mobile (316 Money Mobile and responsive web):** single-column flow with bottom-nav or thumb-reachable interactions. Touch targets are at least 44×44px (`2.75rem`). No horizontal overflow, ever.

Frontend standards:
- **Units:** no hardcoded `px` for layout, padding, margins or fonts. Use `rem`, `em`, `%`, `vw`/`vh` so browser zoom and native scaling work. (Hairline borders and media queries also use rem.)
- **Typography:** fluid scale (`clamp()` or Tailwind prefixes such as `text-sm md:text-base lg:text-lg`).
- **Grids:** auto-fit density, e.g. `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
- **Assets:** images, charts and media are fluid (`w-full h-auto`) or sit in fixed aspect-ratio wrappers.

## Layout defects that must never ship (user-reported)
- **No side flanks on large screens.** Full-width surfaces (nav bars, mega-menus and dropdown panels, banners) run edge to edge at every width; only their inner content is capped (e.g. 90rem) and centred. The page background must never show as empty margins either side of a full-bleed panel.
- **No broken words.** Text never splits mid-word at any width (`overflow-wrap: normal; word-break: normal; hyphens: manual`; `white-space: nowrap` for nav labels, buttons and short labels). When a row cannot fit, change the layout instead: collapse the nav to a drawer earlier, wrap whole words, or stack columns. Headings use `text-wrap: balance`.
- **Reserved media slots.** Where imagery is added later, keep the structure and fixed aspect-ratio box in place so adding the asset causes no layout shift.

## Git commits
- Never add `Co-Authored-By` or any Claude attribution trailer to commits or PR descriptions in this repo (user instruction, overrides default attribution).

## Performance
- **Every image added to the project is compressed before it ships. This is mandatory, not optional.** Do not reference or commit a raw PNG/JPG under `apps/`. The workflow for any new image, on any page:
  1. Drop the original into `assets-src/<Page>/` (not deployed).
  2. Run `npm i --no-save sharp && node tools/optimize-images.mjs` to generate WebP in `apps/marketing-web/assets/<Page>/` (resized to about 2x the largest rendered size; add its max width to `WIDTHS` in the script).
  3. Reference only the `.webp`, with real `width`/`height` attributes; use `loading="lazy"` below the fold and `fetchpriority="high"` plus a preload for the hero image.
  4. Check the page's total asset weight (aim for under about 500 KB) before pushing.
- Never ship raw design PNGs. Put source art in `assets-src/` and run `tools/optimize-images.mjs` to produce WebP (about 2x the rendered size) in `apps/marketing-web/assets/`. Below-the-fold images use `loading="lazy"`; the hero image is preloaded. Keep the page asset weight under about 500 KB.
