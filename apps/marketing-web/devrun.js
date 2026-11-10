// Developers "Built for developers": pressing Run sends the sample request; the response is written into the Response panel on the right.
// Pressing Run again plays it again. Everything is on-page sample data: no request is sent anywhere.
(() => {
  const box = document.getElementById("dv-run");
  if (!box) return;
  const btn = box.querySelector(".dv-run__btn");
  btn.addEventListener("click", () => {
    box.classList.remove("is-run");
    void box.offsetWidth;                // restart the animations
    box.classList.add("is-run", "is-ran");
  });
})();
