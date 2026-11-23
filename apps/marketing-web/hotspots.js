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

/* Payment Agent page: "The customer experience" steps are buttons; choosing a step shows its picture (arrow keys move between steps). */
(function () {
  var root = document.querySelector("[data-pa-exp]");
  if (!root) return;
  var steps = Array.prototype.slice.call(root.querySelectorAll(".pa-step"));
  var panes = Array.prototype.slice.call(root.querySelectorAll(".pa-exp__pane"));
  var pick = function (i, focus) {
    steps.forEach(function (s, n) { var on = n === i; s.classList.toggle("is-on", on); s.setAttribute("aria-pressed", on ? "true" : "false"); if (on && focus) s.focus(); });
    panes.forEach(function (p, n) { var on = n === i; p.hidden = !on; });
  };
  steps.forEach(function (s, i) {
    s.addEventListener("click", function () { pick(i, false); });
    s.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(i, false); }
      else if (e.key === "ArrowDown") { e.preventDefault(); pick((i + 1) % steps.length, true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); pick((i + steps.length - 1) % steps.length, true); }
    });
  });
})();

/* Collection Agent page: the Pay-outs panel plays its three steps in a loop, only while it is on screen (and restarts when the tab is opened again). */
(function () {
  var po = document.querySelector("[data-hs-po]");
  if (!po) return;
  if (!("IntersectionObserver" in window)) { po.classList.add("is-live"); return; }
  new IntersectionObserver(function (entries) {
    po.classList.toggle("is-live", entries[entries.length - 1].isIntersecting);
  }, { threshold: 0.35 }).observe(po);
})();
