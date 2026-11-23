/* Hotspots sidebar drop-downs (dashboard and onboarding): the rows with a chevron open and close a short list of the screens they hold.
   On the dashboard the row only toggles; on the onboarding page it also moves to that section (the link itself), and the row of the current screen opens by itself. */
(() => {
  const set = (grp, open) => {
    const a = grp.querySelector("[data-hd-tog]"), list = grp.querySelector(".hd__sub");
    if (!a || !list) return;
    a.setAttribute("aria-expanded", String(open));
    list.hidden = !open;
  };
  window.hdGroup = { set };
  document.querySelectorAll(".hd__grp").forEach((grp) => {
    const a = grp.querySelector("[data-hd-tog]");
    if (!a) return;
    a.addEventListener("click", (e) => {
      const open = a.getAttribute("aria-expanded") !== "true";
      if (a.dataset.hdTog === "only") e.preventDefault();
      set(grp, open);
    });
  });
})();
