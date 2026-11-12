/* Sell digital cards hero: the clockwise card loop honours the reduced-motion setting (SMIL is not controlled by CSS). */
(function () {
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".dc-orbit").forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
})();
