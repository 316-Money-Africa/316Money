/* 316 Hotspots agent dashboard: below 64rem the sidebar is a slide-out drawer (menu button, scrim, Escape or a link closes it); the chart tabs only switch the highlighted tab (sample screen). */
(() => {
  const root = document.querySelector(".ad");
  if (!root) return;
  const side = root.querySelector(".ad__side");
  const open = root.querySelector("[data-ad-open]");
  const set = (on) => {
    root.classList.toggle("is-open", on);
    if (open) open.setAttribute("aria-expanded", String(on));
    if (on) { const first = side.querySelector("a, button"); if (first) first.focus(); } else if (document.activeElement && side.contains(document.activeElement) && open) open.focus();
  };
  if (open) open.addEventListener("click", () => set(true));
  root.querySelectorAll("[data-ad-close], [data-ad-scrim]").forEach((el) => el.addEventListener("click", () => set(false)));
  side.querySelectorAll(".ad__link").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); set(false); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && root.classList.contains("is-open")) set(false); });
  const tabs = [...root.querySelectorAll(".ad__tabs button")];
  tabs.forEach((t) => t.addEventListener("click", () => tabs.forEach((o) => { const on = o === t; o.classList.toggle("is-on", on); o.setAttribute("aria-selected", String(on)); })));
})();
