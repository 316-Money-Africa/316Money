// Builds the rotating-globe artwork for the Cross-border card from the design export:
//   assets-src/Features/world-map.png (grey dome, purple dot map, two pins with cards)
// Outputs (apps/marketing-web/assets/Features/):
//   globe-dots.webp  purple dots only (pins/cards removed and filled), map + mirror, 2728x485, for a seamless pan
//   face-a.webp, face-b.webp  the two avatar circles for the static pins
// Run: node tools/make-globe.mjs   (needs sharp: npm i --no-save sharp, or SHARP_FROM=<dir containing node_modules>)
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(process.env.SHARP_FROM ? join(process.env.SHARP_FROM, "x.js") : import.meta.url);
const sharp = require("sharp");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "assets-src", "Features", "world-map.png");
const OUT = join(ROOT, "apps", "marketing-web", "assets", "Features");

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height; // 1364 x 485
const px = (x, y) => (y * W + x) * 4;

// 1) dots layer: purple-ish pixels keep their strength as alpha
const DOT = [107, 91, 166];
const dots = new Uint8ClampedArray(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = px(x, y); const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
  if (a < 200 || b - g < 18) continue;
  const t = Math.min(1, Math.max(0, (217 - g) / (217 - DOT[1])));
  if (t < 0.08) continue;
  dots[i] = DOT[0]; dots[i + 1] = DOT[1]; dots[i + 2] = DOT[2]; dots[i + 3] = Math.min(255, Math.round(255 * t * 1.7));
}

// 2) remove the pins and cards: anything that is neither ocean grey, a purple dot nor transparent is an occluder.
//    Occluded pixels (plus a small halo) are refilled from the same column a little above/below, so only a few dots differ.
// occluder = white card, dark text/shadow, or coloured non-purple art (green, red, skin tones); NOT grey ocean and NOT purple dots
const isOcc = (i) => { const r = data[i], g = data[i + 1], b = data[i + 2], mn = Math.min(r, g, b), mx = Math.max(r, g, b);
  if (data[i + 3] < 200) return false;
  return mn > 232 || (mx < 172 && b - g < 14) || (b - g < 8 && mx - mn > 28); };
const occ = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = px(x, y); if (isOcc(i)) occ[y * W + x] = 1; }
const grown = new Uint8Array(W * H), R = 4;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (occ[y * W + x])
  for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H) grown[yy * W + xx] = 1; }
const fixed = new Uint8ClampedArray(dots);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (grown[y * W + x]) {
  let sy = y - 64; if (sy < 0 || grown[sy * W + x]) sy = y + 64;
  if (sy < 0 || sy >= H || grown[sy * W + x]) { fixed[px(x, y) + 3] = 0; continue; }
  const i = px(x, y), j = px(x, sy);
  fixed[i] = fixed[j]; fixed[i + 1] = fixed[j + 1]; fixed[i + 2] = fixed[j + 2]; fixed[i + 3] = dots[j + 3];
}
dots.set(fixed);

// 3) seamless horizontal strip: map + its mirror (2W x H). Panned by CSS, the seam is invisible, so the map "revolves" forever.
const SW = W * 2;
const strip = Buffer.alloc(SW * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < SW; x++) {
  const sx = x < W ? x : SW - 1 - x, i = px(sx, y), o = (y * SW + x) * 4;
  strip[o] = dots[i]; strip[o + 1] = dots[i + 1]; strip[o + 2] = dots[i + 2]; strip[o + 3] = dots[i + 3];
}
const tex = await sharp(strip, { raw: { width: SW, height: H, channels: 4 } }).webp({ quality: 68, alphaQuality: 75, effort: 6 }).toFile(join(OUT, "globe-dots.webp"));
console.log("globe-dots.webp", tex.width + "x" + tex.height, (tex.size / 1024).toFixed(0) + "KB");

// 4) avatar faces for the pins
const face = async (name, cxx, cyy, r) => {
  const left = cxx - r, top = cyy - r;
  const out = await sharp(SRC).extract({ left, top, width: 2 * r, height: 2 * r }).resize(112, 112).webp({ quality: 82 }).toFile(join(OUT, name));
  console.log(name, (out.size / 1024).toFixed(1) + "KB");
};
await face("face-a.webp", 612, 207, 24);
await face("face-b.webp", 706, 328, 27);
