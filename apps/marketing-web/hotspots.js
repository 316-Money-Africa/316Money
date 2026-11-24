/* 316 Hotspots page: the journey tabs (Cash-out / Cash-in / Remittance payout) switch the picture shown; the kiosks-to-banking section is a pinned parallax flow handled by linkflow.js. Sample marketing content only. */
(function () {
  Array.prototype.slice.call(document.querySelectorAll("[data-hs-tabs]")).forEach(function (tabs) {
    var btns = Array.prototype.slice.call(tabs.querySelectorAll(".hs-tab"));
    var panes = Array.prototype.slice.call(tabs.querySelectorAll(".hs-pane"));
    var show = function (key, focus) {
      btns.forEach(function (b) {
        var on = b.getAttribute("data-tab") === key;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      panes.forEach(function (p) {
        var on = p.id === "hs-pane-" + key;
        p.hidden = !on;
        p.classList.toggle("is-on", on);
        if (on) { var im = p.querySelector("img"); if (im) im.loading = "eager"; }
      });
    };
    btns.forEach(function (b, i) {
      b.tabIndex = i === 0 ? 0 : -1;
      b.addEventListener("click", function () { show(b.getAttribute("data-tab"), false); });
      b.addEventListener("keydown", function (e) {
        var n = btns.indexOf(b);
        if (e.key === "ArrowRight") { show(btns[(n + 1) % btns.length].getAttribute("data-tab"), true); e.preventDefault(); }
        if (e.key === "ArrowLeft") { show(btns[(n + btns.length - 1) % btns.length].getAttribute("data-tab"), true); e.preventDefault(); }
      });
    });
  });
})();

/* "The customer experience" steps are buttons; choosing a step shows its picture, which plays that step as a short process (arrow keys move between steps).
   Clicking the picture itself (or pressing Enter / Space on it) moves on to the next step, and after the last step it starts again from step 1. */
(function () {
  var root = document.querySelector("[data-pa-exp]");
  if (!root) return;
  var steps = Array.prototype.slice.call(root.querySelectorAll(".pa-step"));
  var panes = Array.prototype.slice.call(root.querySelectorAll(".pa-exp__pane"));
  var stage = root.querySelector("[data-pa-stage]");
  var cur = 0;
  var pick = function (i, focus) {
    cur = i;
    steps.forEach(function (s, n) { var on = n === i; s.classList.toggle("is-on", on); s.setAttribute("aria-pressed", on ? "true" : "false"); if (on && focus) s.focus(); });
    panes.forEach(function (p, n) { var on = n === i; p.hidden = !on; p.classList.toggle("is-on", on); });
  };
  steps.forEach(function (s, i) {
    s.addEventListener("click", function () { pick(i, false); });
    s.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(i, false); }
      else if (e.key === "ArrowDown") { e.preventDefault(); pick((i + 1) % steps.length, true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); pick((i + steps.length - 1) % steps.length, true); }
    });
  });
  if (stage) {
    stage.addEventListener("click", function () { pick((cur + 1) % steps.length, false); });
    stage.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick((cur + 1) % steps.length, false); } });
  }
})();

/* Collection Agent page: each journey panel (Pay-outs, Pay-ins, Remittance payout) plays its three steps in a loop, only while it is on screen, and starts again from step 1 each time its tab is opened. */
(function () {
  var pos = Array.prototype.slice.call(document.querySelectorAll("[data-hs-po]"));
  if (!pos.length) return;
  var restart = function (po) { po.classList.add("is-reset"); void po.offsetWidth; po.classList.remove("is-reset"); };
  pos.forEach(function (po) {
    if (!("IntersectionObserver" in window)) { po.classList.add("is-live"); return; }
    var seen = false;
    new IntersectionObserver(function (entries) {
      var on = entries[entries.length - 1].isIntersecting;
      if (on && !seen) restart(po);
      seen = on;
      po.classList.toggle("is-live", on);
    }, { threshold: 0.35 }).observe(po);
  });
})();

/* "A simple experience" (Collection overview and Payment agent), driven by scrolling: the step descriptions appear one after another as the section scrolls into view (--rv on each step), and the panel on the right has a parallax (--py): its picture layers move by different amounts while the section passes through the screen. */
(function () {
  var root = document.querySelector("[data-pa-exp]");
  if (!root) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var steps = Array.prototype.slice.call(root.querySelectorAll(".pa-step"));
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var busy = false;
  var update = function () {
    busy = false;
    var r = root.getBoundingClientRect(), vh = window.innerHeight || 1;
    var through = (vh - r.top) / (vh + r.height);                      // 0 as the section's top edge enters the screen, 1 as its bottom edge leaves
    var mid = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
    root.style.setProperty("--py", Math.max(-1, Math.min(1, -mid)).toFixed(3));
    steps.forEach(function (s, i) { s.style.setProperty("--rv", clamp((through - (0.14 + i * 0.07)) / 0.1).toFixed(3)); });
  };
  var queue = function () { if (!busy) { busy = true; window.requestAnimationFrame(update); } };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();
})();
