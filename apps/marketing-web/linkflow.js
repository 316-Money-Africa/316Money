// Payment links "Simple by design": while the page scrolls through the section the three steps stay pinned, the picture of each step comes in from the
// right (scroll-linked, so it reads as parallax) and only when the third one is in does the page move on to the next section. The line under a step shows
// only for the active step. Without JavaScript, on phones/tablets or with reduced motion nothing is pinned and the section is a plain stack.
(() => {
  document.querySelectorAll(".pl-flow").forEach(init);   // a page can hold more than one pinned steps section
  function init(root) {
  const pin = root.querySelector(".pl-flow__pin");
  const stage = root.querySelector(".pl-flow__stage");
  const runway = root.querySelector(".pl-flow__runway");
  const stepsEl = [...root.querySelectorAll(".pl-step")];
  const layers = [...root.querySelectorAll(".pl-flow__layer")];
  const custs = layers.map((l) => l.querySelector(".pl-cust"));
  const mq = window.matchMedia("(min-width: 64rem) and (prefers-reduced-motion: no-preference)");
  const TRACK = 3.2;                        // viewport heights of scrolling for the three steps
  const SEG = [null, [0.16, 0.46], [0.54, 0.84]]; // scroll progress at which picture 2 and 3 come in
  const ease = (t) => t * t * (3 - 2 * t);
  let on = false, raf = 0;

  const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const stickTop = () => (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 80) + 8;
  const enable = () => {
    const top = stickTop();
    root.classList.toggle("is-pin", mq.matches);                 // measure the steps in their pinned (compact) layout
    const side = root.classList.contains("pl-flow--side");     // list and picture side by side: the card padding is all that sits around the picture
    const stepsH = side ? 5 * rem() : pin.offsetHeight - stage.offsetHeight;
    const h = Math.min(46 * rem(), Math.max(window.innerHeight - top - stepsH - 0.5 * rem(), 0.68 * window.innerHeight));   // roomy stage: never smaller than about two thirds of the screen
    on = mq.matches && h >= 17 * rem();
    root.classList.toggle("is-pin", on);
    if (on) {
      root.style.setProperty("--pf-top", top + "px");
      root.style.setProperty("--pf-track", String(TRACK));
      root.style.setProperty("--pf-stage", Math.round(h) + "px");
    } else { ["--pf-top", "--pf-track", "--pf-stage"].forEach((v) => root.style.removeProperty(v)); layers.forEach((el) => { el.style.translate = ""; }); custs.forEach((el) => { if (el) el.style.translate = ""; }); }
    stepsEl.forEach((el) => el.classList.remove("is-on"));
    layers.forEach((el, i) => { el.classList.toggle("is-cur", i === 0); el.classList.toggle("is-off", i > 0); });
    update();
  };
  const progress = () => {
    const travel = runway.offsetHeight || 1;
    return Math.min(1, Math.max(0, (stickTop() + pin.offsetHeight - runway.getBoundingClientRect().top) / travel));
  };
  // the scroll sets a target for each picture; the picture glides to it (eased every frame), so a wheel click or a fast swipe still moves smoothly
  const cur = [1, 0, 0], tgt = [1, 0, 0];
  const compute = () => {
    const p = progress();
    for (let i = 1; i < 3; i++) tgt[i] = ease(Math.min(1, Math.max(0, (p - SEG[i][0]) / (SEG[i][1] - SEG[i][0]))));
  };
  const apply = () => {
    // positions are written straight onto the three pictures (no inherited CSS variable), so moving them never restyles the busy animated art inside
    layers[0].style.translate = (-14 * cur[1]).toFixed(2) + "% 0";
    layers[1].style.translate = ((1 - cur[1]) * 101 - 14 * cur[2]).toFixed(2) + "% 0";
    layers[2].style.translate = ((1 - cur[2]) * 101).toFixed(2) + "% 0";
    // the art of an incoming picture leads its panel (it arrives before the panel has fully slid in), then settles in the middle
    const w = stage.offsetWidth;
    [1, 2].forEach((i) => { if (custs[i]) custs[i].style.translate = (-(1 - cur[i]) * 0.38 * w).toFixed(1) + "px 0"; });
    let active = 0;
    cur.forEach((v, i) => { if (v >= 0.5) active = i; layers[i].classList.toggle("is-cur", i === 0 || v > 0.02); layers[i].classList.toggle("is-off", i > 0 && v < 0.002); });
    stepsEl.forEach((el, i) => el.classList.toggle("is-on", i === active));
  };
  const tick = () => {
    raf = 0;
    let moving = false;
    for (let i = 1; i < 3; i++) {
      const d = tgt[i] - cur[i];
      if (Math.abs(d) > 0.0007) { cur[i] += d * 0.14; moving = true; } else cur[i] = tgt[i];
    }
    apply();
    if (moving) raf = requestAnimationFrame(tick);
  };
  const request = () => { if (!on) return; compute(); if (!raf) raf = requestAnimationFrame(tick); };
  const update = () => { if (!on) return; compute(); cur[1] = tgt[1]; cur[2] = tgt[2]; apply(); };

  const goto = (i) => {
    if (!on) return;
    const travel = runway.offsetHeight;
    const startY = runway.getBoundingClientRect().top + window.scrollY - (stickTop() + pin.offsetHeight); // page scroll at which progress is 0
    const targets = [0.04, (SEG[1][1] + SEG[2][0]) / 2, 0.94];
    window.scrollTo({ top: startY + travel * targets[i], behavior: "smooth" });
  };
  stepsEl.forEach((el, i) => {
    el.addEventListener("click", () => goto(i));
    el.addEventListener("keydown", (e) => { if (on && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); goto(i); } });
  });
  const tab = () => stepsEl.forEach((el) => { if (on) el.setAttribute("tabindex", "0"); else el.removeAttribute("tabindex"); });

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", () => { enable(); tab(); });
  (mq.addEventListener ? mq.addEventListener("change", () => { enable(); tab(); }) : mq.addListener(enable));
  enable(); tab();
  }
})();
