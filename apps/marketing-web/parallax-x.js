// Sideways parallax for the wide product bands (.pl-visual__box, or any element marked data-parallax-x).
// While a band crosses the viewport this sets --px on it: +1 as it enters from the bottom, 0 when it is centred, -1 as it leaves at the top.
// The stylesheet turns --px into a slow background drift and a faster drift of the artwork, so the picture slides sideways as the page scrolls
// (the horizontal counterpart of the Online checkout parallax). Only bands that are on screen are updated; with reduced motion nothing runs.
(() => {
  const bands = [...document.querySelectorAll(".pl-visual__box, [data-parallax-x]")];
  if (!bands.length || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
  const live = new Set();
  let raf = 0;
  const update = () => {
    raf = 0;
    const half = window.innerHeight / 2;
    live.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - half) / (half + r.height / 2);
      el.style.setProperty("--px", Math.max(-1, Math.min(1, p)).toFixed(3));
    });
  };
  const request = () => { if (!raf) raf = requestAnimationFrame(update); };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? live.add(e.target) : live.delete(e.target)));
      request();
    }, { rootMargin: "10% 0px" });
    bands.forEach((el) => io.observe(el));
  } else bands.forEach((el) => live.add(el));
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  request();
})();
