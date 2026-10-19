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
const SRC = join(ROOT, "assets-src", "Home");
const OUT = join(ROOT, "apps", "marketing-web", "assets", "Home");
mkdirSync(OUT, { recursive: true });

// max output width per file (px); anything not listed keeps its size
const WIDTHS = {
  "hero.png": 1100,
  "savings.png": 900,
  "business-owner.png": 800,
  "hotspot-agent.png": 760,
  "app-phone.png": 720,
  "nav-promo.png": 700,
};

let before = 0, after = 0;
for (const f of readdirSync(SRC).filter((n) => n.endsWith(".png"))) {
  const input = join(SRC, f);
  const meta = await sharp(input).metadata();
  const width = Math.min(meta.width, WIDTHS[f] ?? meta.width);
  const out = join(OUT, parse(f).name + ".webp");
  const info = await sharp(input).resize({ width }).webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(out);
  before += statSync(input).size; after += info.size;
  console.log(`${f.padEnd(24)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${(statSync(input).size / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`);
}
console.log(`total ${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB`);
