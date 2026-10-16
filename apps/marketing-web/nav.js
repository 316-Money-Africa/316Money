// Mega-menu behaviour: click/keyboard/touch toggle with aria-expanded. Hover on desktop is handled in CSS.
(() => {
  const items = [...document.querySelectorAll(".nav__item")].filter((li) => li.querySelector(".mega"));
  const set = (li, open) => {
    li.classList.toggle("is-open", open);
    li.querySelector(".nav__trigger").setAttribute("aria-expanded", String(open));
  };
  const closeAll = (except) => items.forEach((li) => li !== except && set(li, false));
  items.forEach((li) => {
    li.querySelector(".nav__trigger").addEventListener("click", () => {
      const open = !li.classList.contains("is-open");
      closeAll(li);
      set(li, open);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeAll(); }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav__item")) closeAll();
  });
})();
