// Converts the design-source PNGs in assets-src/ into the small WebP files the site serves from apps/marketing-web/assets/.
// Run: npm i --no-save sharp && node tools/optimize-images.mjs
// Widths are ~2x the largest rendered size (retina) so images stay sharp without shipping multi-megabyte PNGs.
import { createRequire } from "node:module";
import { readdirSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, parse } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(process.env.SHARP_FROM ? join(process.env.SHARP_FROM, "x.js") : import.meta.url);
const sharp = require("sharp");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_ROOT = join(ROOT, "assets-src");
const OUT_ROOT = join(ROOT, "apps", "marketing-web", "assets");

// max output width per file (px); anything not listed keeps its size (capped at 1200)
const WIDTHS = {
  "hero.png": 1100,
  "savings.png": 900,
  "business-owner.png": 800,
  "hotspot-agent.png": 760,
  "app-phone.png": 720,
  "nav-promo.png": 700,
  "flags.png": 1000,
  "savings-cards.png": 1000,
  "world-map.png": 1100,
  "student.png": 800,
  "wallets-usd.png": 900,
  "payment-received-100.png": 640, "payment-sent-50.png": 640, "ngn-100.png": 560, "tuition-fee.png": 520,
  "payment-successful.png": 420, "card-lavender.png": 720, "send-phone.png": 820, "email-form.png": 700,
  "request-man.png": 780, "exchange-man.png": 780, "bills-list.png": 620, "pay-cards.png": 780,
  "uk-phone.png": 560, "split-friends.png": 640, "seal-watermark.png": 300,
};

let before = 0, after = 0;
// every folder in assets-src/ (one per page) maps to the same folder in the served assets
for (const dir of readdirSync(SRC_ROOT).filter((n) => statSync(join(SRC_ROOT, n)).isDirectory())) {
  const SRC = join(SRC_ROOT, dir), OUT = join(OUT_ROOT, dir);
  mkdirSync(OUT, { recursive: true });
  for (const f of readdirSync(SRC).filter((n) => /\.(png|jpe?g)$/i.test(n))) {
    const input = join(SRC, f);
    const meta = await sharp(input).metadata();
    const width = Math.min(meta.width, WIDTHS[f] ?? 1200);
    const out = join(OUT, parse(f).name + ".webp");
    const info = await sharp(input).resize({ width }).webp({ quality: 80, alphaQuality: 75, effort: 6 }).toFile(out);
    before += statSync(input).size; after += info.size;
    console.log(`${dir}/${f.padEnd(24)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${(statSync(input).size / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`);
  }
}
console.log(`total ${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB`);
