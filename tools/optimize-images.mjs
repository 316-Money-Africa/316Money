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
  "Cards/virtual-card-tilt.png": 900, "Cards/gift-grid.png": 1100, "Cards/spending-limits.png": 1228, "Cards/lock-card.png": 998, "Cards/change-pin.png": 744, "Cards/card-status.png": 993, "Cards/cards-fan.png": 1111, "Cards/purchases.png": 926, "Cards/gift-phone.png": 768, "Cards/woman-phone.png": 872,
  "Cards/gift-family.png": 1400, "Cards/gift-browse.png": 332, "Cards/man-yellow.png": 977,
  "Cards/gift-ps4.png": 1100, "Cards/gift-xbox.png": 1058, "Cards/gift-eth.png": 300, "Cards/gift-btc.png": 420, "Cards/gift-ton.png": 420, "Cards/gift-sol.png": 420, "Cards/gift-shop.png": 1240, "Cards/gift-music.png": 974, "Cards/gift-headset.png": 529,
  "Cards/logo-mastercard.png": 294, "Cards/logo-visa.png": 294, "Cards/logo-netflix.png": 294, "Cards/logo-switch.png": 294,
  "Cards/vc-lock.png": 1084, "Cards/vc-security.png": 1016, "Cards/vc-manage.png": 747, "Cards/vc-verified.png": 664, "Cards/vc-woman.png": 1245,
  "Cards/pin-ng.png": 278, "Cards/pin-ke.png": 320, "Cards/pin-uk.png": 199, "Cards/pin-cm.png": 226, "Cards/pin-us.png": 342,
  "Cards/gift-tile-amazon.png": 405, "Cards/gift-tile-binance.png": 405, "Cards/gift-tile-apple.png": 405, "Cards/gift-tile-shein.png": 405, "Cards/gift-tile-ea.png": 405, "Cards/gift-tile-mastercard.png": 405, "Cards/gift-tile-netflix.png": 405,
  "Airtime/networks.png": 1300, "Airtime/woman.png": 1200, "Airtime/net-mtn.png": 385, "Airtime/net-safaricom.png": 360, "Airtime/net-airtel.png": 335, "Airtime/amount-input.png": 836, "Airtime/phone-input.png": 918,
  "Bills/map-tablet.png": 914, "Bills/invoice-woman.png": 1481, "Bills/momo.png": 554, "Bills/water-bill.png": 575,
  "Bills/bulb.png": 900, "Bills/couple.png": 940, "Bills/arch.png": 800, "Bills/cable-success.png": 765, "Bills/man.png": 800, "Bills/phone-input.png": 920, "Bills/data-tiers.png": 760, "Bills/panel.png": 1300, "Bills/util-list.png": 900, "Bills/school.png": 900, "Bills/txn-card.png": 751, "Bills/bill-amount.png": 710, "Bills/history.png": 1254,
  "Pay/speaker.png": 572,
  "Pay/cap.png": 875, "Pay/watch.png": 565, "Pay/methods.png": 401, "Pay/payment-made.png": 904, "Pay/pay-confirm.png": 943, "Pay/headphones.png": 477, "Pay/man.png": 1200, "Pay/phone.png": 587, "Pay/step-method.png": 656,
  "Pots/pot-progress-woman.png": 1120, "Pots/pot-success.png": 560, "Pots/pot-slider.png": 820, "Pots/pot-goals.png": 1320,
};
const QUALITY = 86;
const FOLDER_QUALITY = { Cards: 92, Airtime: 92, Bills: 92, Pay: 92 }; // card artwork carries small UI text, so it keeps more detail // high enough that small UI text baked into the artwork stays crisp

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
    const info = await sharp(input).resize({ width }).webp({ quality: FOLDER_QUALITY[dir] ?? QUALITY, alphaQuality: 90, effort: 6 }).toFile(out);
    before += statSync(input).size; after += info.size;
    console.log(`${dir}/${f.padEnd(24)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${(statSync(input).size / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`);
  }
}
console.log(`total ${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB`);
