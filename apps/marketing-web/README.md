# marketing-web

Public 316 Money website (static; Cloudflare Workers serves this folder, see `wrangler.jsonc`). Pages: `index.html` (home), `features.html`, `send-and-receive.html`, `request-money.html` and `currency-wallets.html` and `saving-pots.html`. Page HTML is generated: edit `tools/pages/*.page.html` and the partials, then run `node tools/build-pages.mjs`.

Served assets live in `assets/` (WebP, `logo.png`, `favicon.png`, `flags/*`, `gift/*`). Original design PNGs are in `assets-src/` (not deployed); regenerate with `node tools/optimize-images.mjs`.

Marketing copy only. No balances, rates or transaction data are rendered client-side (AFR-CORE-002).
