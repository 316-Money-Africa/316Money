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

// max output width per image, keyed "Folder/file.png": ~2x the largest rendered CSS width (measured at a 2560px-wide
// screen, where the 90rem container is at its widest) so images stay sharp on retina screens; never upscaled past the source.
// Anything not listed keeps its size (capped at 1200).
const WIDTHS = {
  "Home/nav-promo.png": 976, "Home/hero.png": 1664, "Home/app-phone.png": 1060, "Home/savings.png": 1320, "Home/business-owner.png": 1320, "Home/hotspot-agent.png": 1240,
  "Features/send-phone.png": 1128, "Features/payment-received-100.png": 1020, "Features/payment-sent-50.png": 1020, "Features/split-friends.png": 731, "Features/email-form.png": 796,
  "Features/request-man.png": 840, "Features/uk-phone.png": 627, "Features/savings-cards.png": 1320, "Features/wallets-usd.png": 1190, "Features/ngn-100.png": 760,
  "Features/student.png": 960, "Features/tuition-fee.png": 790, "Features/exchange-man.png": 887, "Features/telco-mtn.png": 420, "Features/telco-airtel.png": 370, "Features/telco-safaricom.png": 390,
  "Features/bills-list.png": 684, "Features/payment-successful.png": 502, "Features/pay-cards.png": 960, "Features/card-lavender.png": 850, "Features/flags.png": 1320, "Features/seal-watermark.png": 300,
  "SendReceive/send-money.png": 1320, "SendReceive/receive-money.png": 1320, "SendReceive/uk-man.png": 1320, "SendReceive/uk-payment.png": 620, "SendReceive/map.png": 2784,
  "CurrencyWallets/money-woman.png": 1190, "CurrencyWallets/wallets-card.png": 710, "CurrencyWallets/exchange-man.png": 1320,
  "Pots/request-status.png": 1320, "Pots/split-people.png": 1320, "Pots/reminder-woman.png": 1320, "Pots/reminder-bubble.png": 342,
  "Cards/virtual-card-tilt.png": 600, "Cards/gift-grid.png": 640, "Cards/spending-limits.png": 640, "Cards/lock-card.png": 640, "Cards/change-pin.png": 460, "Cards/card-status.png": 720, "Cards/cards-fan.png": 720, "Cards/purchases.png": 620, "Cards/gift-phone.png": 560, "Cards/woman-phone.png": 480,
  "Cards/vc-lock.png": 640, "Cards/vc-security.png": 640, "Cards/vc-manage.png": 440, "Cards/vc-verified.png": 400, "Cards/vc-woman.png": 640, "Cards/vc-arch.png": 640,
  "Cards/pin-ng.png": 200, "Cards/pin-ke.png": 200, "Cards/pin-uk.png": 160, "Cards/pin-cm.png": 160, "Cards/pin-us.png": 200,
  "Cards/gift-family.png": 1000, "Cards/gift-browse.png": 336, "Cards/man-yellow.png": 640,
  "Cards/logo-mastercard.png": 200, "Cards/logo-visa.png": 200, "Cards/logo-netflix.png": 200, "Cards/logo-switch.png": 200,
  "Features/virtual-card-3d.png": 1000, "Features/gift-logos.png": 1000, "Features/wallet-cards.png": 1000, "Features/wallet-phone.png": 900, "Features/checkout.png": 1320, "Features/save-smarter.png": 1320,
  "Pots/pot-progress-woman.png": 1120, "Pots/pot-success.png": 560, "Pots/pot-slider.png": 820, "Pots/pot-goals.png": 1320,
};
const QUALITY = 86; // high enough that small UI text baked into the artwork stays crisp

let before = 0, after = 0;
// every folder in assets-src/ (one per page) maps to the same folder in the served assets
for (const dir of readdirSync(SRC_ROOT).filter((n) => !n.startsWith("_") && statSync(join(SRC_ROOT, n)).isDirectory())) { // folders starting with "_" hold supplied-but-unused originals and are skipped
  const SRC = join(SRC_ROOT, dir), OUT = join(OUT_ROOT, dir);
  mkdirSync(OUT, { recursive: true });
  for (const f of readdirSync(SRC).filter((n) => /\.(png|jpe?g)$/i.test(n))) {
    const input = join(SRC, f);
    const meta = await sharp(input).metadata();
    const width = Math.min(meta.width, WIDTHS[`${dir}/${f}`] ?? 1200);
    const out = join(OUT, parse(f).name + ".webp");
    const info = await sharp(input).resize({ width }).webp({ quality: QUALITY, alphaQuality: 90, effort: 6 }).toFile(out);
    before += statSync(input).size; after += info.size;
    console.log(`${dir}/${f.padEnd(24)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${(statSync(input).size / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`);
  }
}
console.log(`total ${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB`);
