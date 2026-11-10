// Assembles the static pages in apps/marketing-web/ from tools/pages/.
//   tools/pages/*.page.html      page bodies (first line: <!--page title="" description="" preload="" css=""-->)
//   tools/pages/partials/*.html  shared sprite, header, footer and FAQ/download sections
// Run: node tools/build-pages.mjs   (no dependencies). Commit the generated HTML; Cloudflare serves it as-is.
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = join(ROOT, "tools", "pages");
const OUT = join(ROOT, "apps", "marketing-web");
const read = (p) => readFileSync(p, "utf8").split("\r\n").join("\n");
const part = (n) => read(join(PAGES, "partials", n + ".html")).trim();
const partials = { sprite: part("sprite"), header: part("header"), footer: part("footer"), faq_home: part("faq-home"), download: part("download") };
partials.faq_download = [partials.faq_home, partials.download].join("\n\n");


// {{img:Folder/name attr="x" ...}} -> <img> with the real WebP width/height (read from the file header) and lazy loading.
function webpSize(file) {
  const b = readFileSync(file);
  const tag = b.toString("ascii", 12, 16);
  if (tag === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (tag === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (tag === "VP8L") { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
  throw new Error(`${file}: not a WebP`);
}
// {{slot:Folder/name ratio="4/3" class="x" ...}} -> the compressed WebP when assets/Folder/name.webp exists, otherwise an empty
// reserved box with that aspect ratio (CLAUDE.md "Reserved media slots"): dropping the artwork in later changes nothing in the layout.
function expandSlots(html) {
  return html.replace(/\{\{slot:([\w\/-]+)((?:\s+[\w-]+="[^"]*")*)\}\}/g, (_, name, attrs) => {
    const ratio = (attrs.match(/(?:^|\s)ratio="([^"]*)"/) || [])[1];
    const rest = attrs.replace(/(?:^|\s)ratio="[^"]*"/, "");
    if (existsSync(join(OUT, "assets", `${name}.webp`))) return `{{img:${name}${rest}}}`;
    if (!ratio) throw new Error(`slot ${name}: add ratio="w/h" so the empty box reserves its space`);
    const cls = (rest.match(/(?:^|\s)class="([^"]*)"/) || [])[1] || "";
    const [rw, rh] = ratio.split("/").map(Number);   // an empty <svg> reserves the box through its viewBox: no inline style="" (the site CSP blocks it)
    return `<svg class="slot${cls ? " " + cls : ""}" viewBox="0 0 ${rw} ${rh || 1}" data-slot="${name}" aria-hidden="true" focusable="false"></svg>`;
  });
}
function expandImages(html) {
  html = expandSlots(html);
  html = html.replace(/\{\{img:([\w\/-]+)((?:\s+[\w-]+="[^"]*")*)\}\}/g, (_, name, attrs) => {
    const file = join(OUT, "assets", `${name}.webp`);
    if (!existsSync(file)) throw new Error(`missing image: assets/${name}.webp (run tools/optimize-images.mjs)`);
    const [w, h] = webpSize(file);
    const hasAlt = /(^|\s)alt="/.test(attrs);
    const eager = /fetchpriority="high"/.test(attrs) || /(^|\s)loading="/.test(attrs); // the hero image is preloaded and never lazy; an explicit loading attribute wins
    return `<img src="assets/${name}.webp?v=${imgVer(file)}"${hasAlt ? "" : ' alt=""'}${attrs} width="${w}" height="${h}"${eager ? "" : ' loading="lazy"'} decoding="async">`;
  });
  // <image href="assets/x.webp"> inside the animated SVGs: same content-hash version as <img>, so the browser never loads (or caches) an unversioned copy next to the versioned one
  return html.replace(/(<image[^>]*?\shref="assets\/[\w\/-]+\.webp)"/g, (m, head) => {
    const file = join(OUT, head.slice(head.indexOf('assets/')));
    return existsSync(file) ? `${head}?v=${imgVer(file)}"` : m;
  });
}

// stylesheets and scripts carry a content hash, so a browser (or CDN) can never pair new HTML with a stale cached file
// text files are hashed with LF endings so a Windows checkout (CRLF) and CI (LF) produce the same version string
const ver = (f) => createHash("sha1").update(readFileSync(join(OUT, f), "utf8").replace(/\r\n/g, "\n")).digest("hex").slice(0, 8);
// images keep their file name but carry a content hash too: /assets/* is cached for a week, so a replaced image would otherwise never reach returning visitors
const imgVer = (file) => createHash("sha1").update(readFileSync(file)).digest("hex").slice(0, 8);

const OUTPUT_NAMES = { home: "index.html" }; // everything else -> <name>.html

for (const f of readdirSync(PAGES).filter((n) => n.endsWith(".page.html"))) {
  const name = f.replace(".page.html", "");
  const src = read(join(PAGES, f));
  const m = src.match(/^<!--page ([\s\S]*?)-->\n/);
  if (!m) throw new Error(`${f}: missing <!--page ...--> header`);
  const meta = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
  let body = src.slice(m[0].length).trimEnd();
  for (const [k, v] of Object.entries(partials)) body = body.replaceAll(`{{${k}}}`, v);
  body = expandImages(body);
  if (/\{\{\w+\}\}/.test(body)) throw new Error(`${f}: unresolved placeholder ${body.match(/\{\{\w+\}\}/)[0]}`);

  const css = ["styles.css", "sections.css", ...(meta.css ? meta.css.split(/\s+/).filter(Boolean) : []), "mobile.css"]
    .map((c) => `  <link rel="stylesheet" href="${c}?v=${ver(c)}">`).join("\n");
  const scripts = (meta.js ? meta.js.split(/\s+/).filter(Boolean) : []).map((j) => `
  <script src="${j}?v=${ver(j)}" defer></script>`).join("");
  const preload = meta.preload
    ? `  <link rel="preload" as="image" href="${meta.preload}?v=${imgVer(join(OUT, meta.preload))}" type="image/webp" fetchpriority="high">\n` : "";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  <link rel="icon" type="image/png" sizes="131x131" href="assets/favicon.png">
  <link rel="apple-touch-icon" href="assets/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap">
${preload}${css}
</head>
<body${meta.bodyclass ? ` class="${meta.bodyclass}"` : ""}>
  ${partials.sprite}
  ${meta.wordmark ? partials.header.replace('<span class="nav__wordmark">MONEY</span>', `<span class="nav__wordmark">${meta.wordmark}</span>`) : partials.header}

  <main>
${body}
  </main>

  ${partials.footer}
  <script src="nav.js?v=${ver("nav.js")}" defer></script>${scripts}
</body>
</html>
`;
  const out = OUTPUT_NAMES[name] ?? `${name}.html`;
  writeFileSync(join(OUT, out), html);
  console.log(`built ${out} (${(html.length / 1024).toFixed(1)} KB)`);
}
