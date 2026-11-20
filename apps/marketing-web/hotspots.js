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
