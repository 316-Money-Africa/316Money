// Online checkout page: scroll-driven accordion with a light parallax.
// The card stays pinned while the page scrolls through the section; the active item follows the scroll position and the
// illustration drifts slower than the page. Without JavaScript, on phones/tablets or with reduced motion it stays a plain
// click-to-open accordion (radio inputs), so nothing depends on this script.
(() => {
  const root = document.querySelector(".oc-scroll .oc-acc");
  if (!root) return;
  const card = root.querySelector(".oc-acc__card");
  const radios = [...root.querySelectorAll(".oc-acc__r")];
  const mq = window.matchMedia("(min-width: 64rem) and (prefers-reduced-motion: no-preference)");
  const STEP = 0.55; // viewport heights of scrolling per item
  let on = false, lock = 0, raf = 0, current = 0;

  const stickTop = () => (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 80) + 16;
  const fits = () => card.offsetHeight + stickTop() + 16 <= window.innerHeight;
  const enable = () => {
    on = mq.matches && fits();
    root.classList.toggle("is-scroll", on);
    if (on) root.style.setProperty("--oc-track", String(radios.length * STEP));
    else root.style.removeProperty("--oc-track");
    update();
  };
  const travel = () => Math.max(1, root.offsetHeight - card.offsetHeight);
  const progress = () => Math.min(1, Math.max(0, (stickTop() - root.getBoundingClientRect().top) / travel()));
  const select = (i) => {
    if (i === current) return;
    current = i;
    radios[i].checked = true;
  };
  const update = () => {
    raf = 0;
    if (!on) { root.style.setProperty("--oc-p", "0.5"); return; }
    const p = progress();
    root.style.setProperty("--oc-p", p.toFixed(4));
    if (performance.now() > lock) select(Math.min(radios.length - 1, Math.floor(p * radios.length)));
  };
  const request = () => { if (!raf) raf = requestAnimationFrame(update); };

  radios.forEach((radio, i) => {
    radio.addEventListener("change", () => {
      current = i;
      if (!on) return;
      const top = root.getBoundingClientRect().top + window.scrollY - stickTop();
      const target = top + travel() * ((i + 0.5) / radios.length);
      lock = performance.now() + 900;
      window.scrollTo({ top: target, behavior: "smooth" });
    });
  });

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", enable);
  (mq.addEventListener ? mq.addEventListener("change", enable) : mq.addListener(enable));
  enable();
})();
