# marketing-web

Public 316 Money website (static, deployed on every push by `.github/workflows/deploy.yml`). Home page: hero, features bento, gift cards, virtual cards, feature grid, savings, steps, business, Hotspots, FAQ, download and footer, with mega-menu navigation.

Served assets live in `assets/` (WebP, `logo.png`, `favicon.png`, `flags/*`, `gift/*`). Original design PNGs are in `assets-src/` (not deployed); regenerate with `node tools/optimize-images.mjs`.

Marketing copy only. No balances, rates or transaction data are rendered client-side (AFR-CORE-002).
