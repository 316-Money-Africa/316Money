/* 316 Hotspots page: the journey tabs (Cash-out / Cash-in / Remittance payout) and the kiosks-to-banking list switch the picture shown. Sample marketing content only. */
(function () {
  var tabs = document.querySelector("[data-hs-tabs]");
  if (tabs) {
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
  }
  var kio = document.querySelector("[data-hs-kio]");
  if (kio) {
    var items = Array.prototype.slice.call(kio.querySelectorAll(".hs-kio__item"));
    var figs = Array.prototype.slice.call(kio.querySelectorAll(".hs-kio__fig"));
    items.forEach(function (li) {
      li.querySelector(".hs-kio__btn").addEventListener("click", function () {
        var key = li.getAttribute("data-kio");
        items.forEach(function (x) {
          var on = x === li;
          x.classList.toggle("is-on", on);
          x.querySelector(".hs-kio__btn").setAttribute("aria-expanded", on ? "true" : "false");
        });
        figs.forEach(function (f) {
          var on = f.getAttribute("data-view") === key;
          f.hidden = !on;
          f.classList.toggle("is-on", on);
          if (on) { var im = f.querySelector("img"); if (im) im.loading = "eager"; }
        });
      });
    });
  }
})();
