// Assembles the static pages in apps/marketing-web/ from tools/pages/.
//   tools/pages/*.page.html      page bodies (first line: <!--page title="" description="" preload="" css=""-->)
//   tools/pages/partials/*.html  shared sprite, header, footer and FAQ/download sections
// Run: node tools/build-pages.mjs   (no dependencies). Commit the generated HTML; Cloudflare serves it as-is.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = join(ROOT, "tools", "pages");
const OUT = join(ROOT, "apps", "marketing-web");
const read = (p) => readFileSync(p, "utf8").split("\r\n").join("\n");
const part = (n) => read(join(PAGES, "partials", n + ".html")).trim();
const partials = { sprite: part("sprite"), header: part("header"), footer: part("footer"), faq_download: part("faq-download") };

const OUTPUT_NAMES = { home: "index.html" }; // everything else -> <name>.html

for (const f of readdirSync(PAGES).filter((n) => n.endsWith(".page.html"))) {
  const name = f.replace(".page.html", "");
  const src = read(join(PAGES, f));
  const m = src.match(/^<!--page ([\s\S]*?)-->\n/);
  if (!m) throw new Error(`${f}: missing <!--page ...--> header`);
  const meta = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
  let body = src.slice(m[0].length).trimEnd();
  for (const [k, v] of Object.entries(partials)) body = body.replaceAll(`{{${k}}}`, v);
  if (/\{\{\w+\}\}/.test(body)) throw new Error(`${f}: unresolved placeholder ${body.match(/\{\{\w+\}\}/)[0]}`);

  const css = ["styles.css", "sections.css", ...(meta.css ? meta.css.split(/\s+/).filter(Boolean) : [])]
    .map((c) => `  <link rel="stylesheet" href="${c}">`).join("\n");
  const preload = meta.preload
    ? `  <link rel="preload" as="image" href="${meta.preload}" type="image/webp" fetchpriority="high">\n` : "";

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
<body>
  ${partials.sprite}
  ${partials.header}

  <main>
${body}
  </main>

  ${partials.footer}
  <script src="nav.js" defer></script>
</body>
</html>
`;
  const out = OUTPUT_NAMES[name] ?? `${name}.html`;
  writeFileSync(join(OUT, out), html);
  console.log(`built ${out} (${(html.length / 1024).toFixed(1)} KB)`);
}
