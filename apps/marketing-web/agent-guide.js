/* 316 Hotspots agent resource centre: the address hash picks the article (#getting-started ... #faqs), the left list and the page title follow it;
   the policies article has a category filter, a search box and a "What this policy covers" reveal; the header search jumps to a topic. */
(() => {
  const arts = [...document.querySelectorAll("[data-art]")];
  if (!arts.length) return;
  const keys = arts.map((a) => a.dataset.art);
  const links = [...document.querySelectorAll("[data-nav]")];
  const labels = {};
  links.forEach((l) => { labels[l.dataset.nav] = l.textContent.trim(); });
  let first = true;
  const show = () => {
    const key = location.hash.slice(1);
    const on = keys.includes(key) ? key : keys[0];
    arts.forEach((a) => { a.hidden = a.dataset.art !== on; });
    links.forEach((l) => { const hit = l.dataset.nav === on; l.classList.toggle("is-on", hit); if (hit) l.setAttribute("aria-current", "page"); else l.removeAttribute("aria-current"); });
    document.title = labels[on] + " · Agent resource centre · 316 Hotspots";
    if (!first) { window.scrollTo({ top: 0, behavior: "auto" }); const h = document.querySelector('[data-art="' + on + '"] .ag-h1'); if (h) h.focus({ preventScroll: true }); }
    first = false;
  };
  window.addEventListener("hashchange", show);
  show();

  // header search: choose a topic from the list (or type part of its name and press Enter)
  const gs = document.querySelector("[data-guide-search]");
  if (gs) {
    const go = () => {
      const q = gs.value.trim().toLowerCase();
      if (!q) return;
      const hit = keys.find((k) => labels[k].toLowerCase() === q) || keys.find((k) => labels[k].toLowerCase().includes(q));
      if (hit) { location.hash = "#" + hit; gs.value = ""; gs.blur(); }
    };
    gs.addEventListener("change", go);
    gs.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); go(); } });
  }

  // the picker: General is the Hotspots dashboard (the first flow), Payment agent is this guide, the Collection guide is not written yet
  const role = document.querySelector("[data-role]");
  if (role) role.addEventListener("change", () => {
    if (role.value === "general") { location.href = "hotspots-dashboard.html"; return; }
    role.value = "payment";
  });

  // policies: category chips + search + reveal
  const pols = [...document.querySelectorAll(".ag-pol")];
  const chips = [...document.querySelectorAll(".ag-filters button")];
  const box = document.querySelector("[data-pol-search]");
  const empty = document.querySelector("[data-pol-empty]");
  let cat = "all";
  const filter = () => {
    const q = box ? box.value.trim().toLowerCase() : "";
    let n = 0;
    pols.forEach((p) => {
      const ok = (cat === "all" || p.dataset.cat === cat) && (!q || p.textContent.toLowerCase().includes(q));
      p.hidden = !ok; if (ok) n++;
    });
    if (empty) empty.hidden = n > 0;
  };
  chips.forEach((c) => c.addEventListener("click", () => { cat = c.dataset.cat; chips.forEach((o) => o.classList.toggle("is-on", o === c)); filter(); }));
  if (box) box.addEventListener("input", filter);
  pols.forEach((p) => {
    const btn = p.querySelector("button.ag-more");
    const scope = p.querySelector(".ag-pol__scope");
    btn.addEventListener("click", () => { const open = btn.getAttribute("aria-expanded") !== "true"; btn.setAttribute("aria-expanded", String(open)); scope.hidden = !open; });
  });
})();
