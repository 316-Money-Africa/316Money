/* Sell digital cards: the clockwise card loop honours the reduced-motion setting (SMIL is not controlled by CSS),
   and the Choose card list can be searched; choosing a card shows it on the right. Sample data only. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".dc-orbit").forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
  }
  var root = document.querySelector("[data-dc-pick]");
  if (!root) return;
  var search = root.querySelector("[data-dc-search]");
  var empty = root.querySelector("[data-dc-empty]");
  var items = Array.prototype.slice.call(root.querySelectorAll(".dc-pick__list li"));
  var rows = Array.prototype.slice.call(root.querySelectorAll(".dc-pick__row"));
  var views = Array.prototype.slice.call(root.querySelectorAll(".dc-pick__card"));
  function filter() {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (li) {
      var hide = q !== "" && li.getAttribute("data-name").indexOf(q) === -1;
      li.hidden = hide;
      if (!hide) shown++;
    });
    empty.hidden = shown > 0;
  }
  function choose(key) {
    rows.forEach(function (b) {
      var on = b.getAttribute("data-card") === key;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("is-sel", on);
      b.querySelector(".dc-pick__act").textContent = on ? "Activated" : "Activate";
    });
    views.forEach(function (f) {
      var show = f.getAttribute("data-view") === key;
      f.hidden = !show;
      f.classList.remove("is-on");
      if (show) { void f.offsetWidth; f.classList.add("is-on"); }
    });
  }
  search.addEventListener("input", filter);
  rows.forEach(function (b) { b.addEventListener("click", function () { choose(b.getAttribute("data-card")); }); });
})();
