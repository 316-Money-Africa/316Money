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
  const mq = window.matchMedia("(min-width: 64rem) and (prefers-reduced-motion: no-preference)");
  const TRACK = 2.6;                        // viewport heights of scrolling for the three steps
  const SEG = [null, [0.2, 0.42], [0.6, 0.82]]; // scroll progress at which picture 2 and 3 come in
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  let on = false, raf = 0;

  const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const stickTop = () => (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 80) + 8;
  const enable = () => {
    const top = stickTop();
    root.classList.toggle("is-pin", mq.matches);                 // measure the steps in their pinned (compact) layout
    const side = root.classList.contains("pl-flow--side");     // list and picture side by side: the card padding is all that sits around the picture
    const stepsH = side ? 5 * rem() : pin.offsetHeight - stage.offsetHeight;
    const h = Math.min(36 * rem(), window.innerHeight - top - stepsH - 1.25 * rem());
    on = mq.matches && h >= 17 * rem();
    root.classList.toggle("is-pin", on);
    if (on) {
      root.style.setProperty("--pf-top", top + "px");
      root.style.setProperty("--pf-track", String(TRACK));
      root.style.setProperty("--pf-stage", Math.round(h) + "px");
    } else ["--pf-top", "--pf-track", "--pf-stage", "--s2", "--s3"].forEach((v) => root.style.removeProperty(v));
    stepsEl.forEach((el) => el.classList.remove("is-on"));
    layers.forEach((el, i) => el.classList.toggle("is-cur", i === 0));
    update();
  };
  const progress = () => {
    const travel = runway.offsetHeight || 1;
    return Math.min(1, Math.max(0, (stickTop() + pin.offsetHeight - runway.getBoundingClientRect().top) / travel));
  };
  const update = () => {
    raf = 0;
    if (!on) return;
    const p = progress();
    const s = [1, 0, 0];
    for (let i = 1; i < 3; i++) s[i] = ease(Math.min(1, Math.max(0, (p - SEG[i][0]) / (SEG[i][1] - SEG[i][0]))));
    root.style.setProperty("--s2", s[1].toFixed(3));
    root.style.setProperty("--s3", s[2].toFixed(3));
    let active = 0;
    s.forEach((v, i) => { if (v >= 0.5) active = i; layers[i].classList.toggle("is-cur", i === 0 || v > 0.02); });
    stepsEl.forEach((el, i) => el.classList.toggle("is-on", i === active));
  };
  const request = () => { if (!raf) raf = requestAnimationFrame(update); };

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
