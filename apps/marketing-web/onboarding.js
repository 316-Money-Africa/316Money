/* 316 Hotspots onboarding: four screens on one page (#role, #business, #location, #reps). The address hash picks the screen, so Back / Next / the sidebar are plain links.
   UI walk-through only: nothing is validated and nothing is sent. Without JavaScript the first screen shows. */
(() => {
  const screens = [...document.querySelectorAll("[data-screen]")];
  if (!screens.length) return;
  const keys = screens.map((s) => s.dataset.screen);
  const links = [...document.querySelectorAll("[data-nav]")];
  const stepEl = document.querySelector("[data-ob-step]");
  const bar = document.querySelector(".hd__bar");
  let first = true;
  const show = () => {
    const key = location.hash.slice(1);
    const on = keys.includes(key) ? key : keys[0];
    screens.forEach((s) => { s.hidden = s.dataset.screen !== on; });
    links.forEach((a) => {
      const hit = a.dataset.nav.split(" ").includes(on);
      a.classList.toggle("is-on", hit);
      if (hit) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current");
    });
    const cur = screens[keys.indexOf(on)];
    if (stepEl) stepEl.textContent = cur.dataset.step;
    const n = cur.dataset.step.match(/\d+/)[0];
    if (bar) { bar.setAttribute("aria-valuenow", n); bar.firstElementChild.dataset.p = n; }
    if (!first) window.scrollTo({ top: 0, behavior: "auto" });
    first = false;
  };
  // small walk-through touches: an upload toggles, Verify marks the person verified, the service choice renames the requirement list
  document.querySelectorAll("[data-upload]").forEach((b) => b.addEventListener("click", () => {
    const done = !b.classList.contains("is-done");
    b.classList.toggle("is-done", done); b.setAttribute("aria-pressed", String(done)); b.textContent = done ? "Uploaded" : "Upload";
  }));
  document.querySelectorAll("[data-verify]").forEach((b) => b.addEventListener("click", () => { b.classList.add("is-done"); b.textContent = "Verified"; }));
  const svcLabel = document.querySelector("[data-svc-label]");
  document.querySelectorAll("input[name=svc]").forEach((r) => r.addEventListener("change", () => { if (svcLabel) svcLabel.textContent = r.value + " requirements"; }));
  window.addEventListener("hashchange", show);
  show();
})();
