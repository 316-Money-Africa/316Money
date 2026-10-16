// Renders every README.md in the repo into a static site in dist/ for Cloudflare Pages.
// Scope: reads only inside the project root. Never publishes the SRS .docx or non-README files.
// Trace: AFR-CORE-005 (docs reflect gated capabilities), Appendix B (traceability).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join, relative, dirname, sep, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "dist");
const SKIP = new Set(["node_modules", "dist", ".git", ".github", ".claude", ".wrangler", "site"]);
const checkOnly = process.argv.includes("--check");

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (name === "README.md") acc.push(p);
  }
  return acc;
}

const pages = walk(ROOT).map((p) => {
  const rel = relative(ROOT, dirname(p)).split(sep).join("/"); // "" for root
  return { rel, src: p, url: rel ? `/${rel}/` : "/" };
}).sort((a, b) => a.rel.localeCompare(b.rel));

const known = new Set(pages.map((p) => p.url));
const errors = [];

// Rewrite relative README links to clean directory URLs and verify they resolve.
const renderer = new marked.Renderer();
const baseUrl = { v: "/" };
renderer.link = function ({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  let target = href;
  if (href && !/^([a-z]+:|#|\/)/i.test(href)) {
    const clean = href.replace(/README\.md$/, "");
    const resolved = posix.normalize(posix.join(baseUrl.v, clean));
    const url = resolved.endsWith("/") ? resolved : resolved + "/";
    if (!known.has(url)) errors.push(`${baseUrl.v}: broken link ${href}`);
    target = resolved;
  }
  return `<a href="${esc(target)}"${title ? ` title="${esc(title)}"` : ""}>${text}</a>`;
};
// Raw HTML in markdown is dropped; content is plain markdown only.
renderer.html = () => "";
marked.setOptions({ renderer, gfm: true });

const nav = pages.map((p) => {
  const depth = p.rel ? p.rel.split("/").length : 0;
  const label = p.rel ? p.rel.split("/").pop() : "316 Money";
  return `<a class="d${Math.min(depth, 4)}" href="${p.url}">${esc(label)}</a>`;
}).join("\n");

const layout = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(title)} · 316 Money</title>
<style>
:root{--bg:#fff;--fg:#14181f;--mut:#5b6572;--line:#e3e7ec;--acc:#0b6b4f;--code:#f4f6f8}
@media(prefers-color-scheme:dark){:root{--bg:#0f1318;--fg:#e8ecf1;--mut:#9aa5b1;--line:#252c35;--acc:#4cc9a0;--code:#171d24}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,sans-serif;display:flex;min-height:100vh}
nav{width:270px;flex:none;border-right:1px solid var(--line);padding:16px;overflow:auto;position:sticky;top:0;height:100vh}
nav a{display:block;color:var(--mut);text-decoration:none;padding:2px 0;font-size:14px}
nav a:hover{color:var(--acc)}.d1{padding-left:10px!important}.d2{padding-left:20px!important}.d3{padding-left:30px!important}.d4{padding-left:40px!important}
main{flex:1;max-width:860px;padding:24px 32px;min-width:0}
a{color:var(--acc)}code{background:var(--code);padding:1px 5px;border-radius:4px;font-size:.9em}
pre{background:var(--code);padding:12px;overflow:auto;border-radius:6px}
@media(max-width:760px){body{display:block}nav{width:auto;height:auto;position:static;border-right:0;border-bottom:1px solid var(--line);max-height:30vh}main{padding:16px}}
</style></head><body><nav>${nav}</nav><main>${body}</main></body></html>`;

if (!checkOnly) {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
}

for (const p of pages) {
  baseUrl.v = p.url;
  const md = readFileSync(p.src, "utf8");
  const html = marked.parse(md);
  const title = (md.match(/^#\s+(.+)$/m) || [, p.rel || "316 Money"])[1];
  if (checkOnly) continue;
  const dir = join(OUT, p.rel);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), layout(title, html));
}

if (!checkOnly) {
  // Cloudflare Pages headers: harden the site.
  writeFileSync(join(OUT, "_headers"), `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  X-Robots-Tag: noindex, nofollow
`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`${checkOnly ? "checked" : "built"} ${pages.length} pages`);
