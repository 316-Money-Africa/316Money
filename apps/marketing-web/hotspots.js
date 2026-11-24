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

/* "The customer experience" steps are buttons; choosing a step shows its picture (arrow keys move between steps).
   With data-pa-auto (Collection Agent overview) the steps also play in order by themselves: the active step's progress bar runs and, when it ends, the next step opens. Hovering, focusing or scrolling the section out of view pauses it; reduced motion turns it off. */
(function () {
  var root = document.querySelector("[data-pa-exp]");
  if (!root) return;
  var steps = Array.prototype.slice.call(root.querySelectorAll(".pa-step"));
  var panes = Array.prototype.slice.call(root.querySelectorAll(".pa-exp__pane"));
  var rail = Array.prototype.slice.call(root.querySelectorAll(".co-rail li"));
  var cur = 0;
  var pick = function (i, focus) {
    cur = i;
    steps.forEach(function (s, n) { var on = n === i; s.classList.toggle("is-on", on); s.setAttribute("aria-pressed", on ? "true" : "false"); if (on && focus) s.focus(); });
    panes.forEach(function (p, n) { var on = n === i; p.hidden = !on; p.classList.toggle("is-on", on); });
    rail.forEach(function (r, n) { r.classList.toggle("is-cur", n === i); r.classList.toggle("is-done", n < i); });
  };
  steps.forEach(function (s, i) {
    s.addEventListener("click", function () { pick(i, false); });
    s.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(i, false); }
      else if (e.key === "ArrowDown") { e.preventDefault(); pick((i + 1) % steps.length, true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); pick((i + steps.length - 1) % steps.length, true); }
    });
  });
  if (root.hasAttribute("data-pa-auto") && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    var hold = { hover: false, focus: false, out: false };
    var sync = function () { root.classList.toggle("is-paused", hold.hover || hold.focus || hold.out); };
    root.addEventListener("mouseenter", function () { hold.hover = true; sync(); });
    root.addEventListener("mouseleave", function () { hold.hover = false; sync(); });
    root.addEventListener("focusin", function () { hold.focus = true; sync(); });
    root.addEventListener("focusout", function () { hold.focus = false; sync(); });
    if ("IntersectionObserver" in window) {
      hold.out = true; sync();
      new IntersectionObserver(function (entries) { hold.out = !entries[entries.length - 1].isIntersecting; sync(); }, { threshold: 0.4 }).observe(root);
    }
    steps.forEach(function (s) {
      var bar = s.querySelector(".pa-steps__bar");
      if (bar) bar.addEventListener("animationend", function () { if (s.classList.contains("is-on")) pick((cur + 1) % steps.length, false); });
    });
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
