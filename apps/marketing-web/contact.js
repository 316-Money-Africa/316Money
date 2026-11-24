/* Contact page: the enquiry drop-down, a check of the required fields, then a confirmation. UI walk-through only: the message is not sent anywhere yet (no backend is connected). */
(() => {
  const form = document.querySelector("[data-ct-form]");
  if (!form) return;
  const status = form.querySelector("[data-ct-status]");
  const say = (text, bad) => { status.textContent = text; status.classList.toggle("is-err", !!bad); status.hidden = false; };

  // enquiry drop-down (button + listbox): click, arrow keys, Enter / Space, Escape and click-away
  const dd = form.querySelector("[data-ct-dd]");
  const btn = dd.querySelector("[data-ct-dd-btn]");
  const val = dd.querySelector("[data-ct-dd-val]");
  const hid = dd.querySelector("[data-ct-dd-in]");
  const list = dd.querySelector("[role=listbox]");
  const opts = [...list.querySelectorAll("[role=option]")];
  const placeholder = val.textContent;
  let hot = -1;
  const mark = (i) => { hot = i; opts.forEach((o, n) => o.classList.toggle("is-hot", n === i)); if (i >= 0) opts[i].scrollIntoView({ block: "nearest" }); };
  const open = (on) => { list.hidden = !on; btn.setAttribute("aria-expanded", String(on)); if (on) mark(Math.max(0, opts.findIndex((o) => o.getAttribute("aria-selected") === "true"))); };
  const choose = (i) => {
    opts.forEach((o, n) => o.setAttribute("aria-selected", String(n === i)));
    val.textContent = opts[i].dataset.v; hid.value = opts[i].dataset.v; btn.classList.add("has-val"); btn.setAttribute("aria-invalid", "false");
    open(false); btn.focus();
  };
  btn.addEventListener("click", () => open(list.hidden));
  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (list.hidden) open(true); else mark((hot + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length); }
    else if ((e.key === "Enter" || e.key === " ") && !list.hidden) { e.preventDefault(); if (hot >= 0) choose(hot); }
    else if (e.key === "Escape" && !list.hidden) { e.preventDefault(); open(false); }
    else if (e.key === "Tab" && !list.hidden) open(false);
  });
  opts.forEach((o, i) => { o.addEventListener("click", () => choose(i)); o.addEventListener("mousemove", () => mark(i)); });
  document.addEventListener("click", (e) => { if (!dd.contains(e.target)) open(false); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll("input[required]:not([type=hidden]), textarea[required]")];
    let first = null;
    fields.forEach((f) => {
      const ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "" && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value.trim()));
      f.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !first) first = f;
    });
    const topicOk = hid.value !== "";
    btn.setAttribute("aria-invalid", topicOk ? "false" : "true");
    if (!topicOk && !first) first = btn;
    if (first) { say("Please complete the highlighted fields and agree to the privacy policy.", true); first.focus(); return; }
    say("Thank you. Your message is ready and our team will get back to you soon.", false);
    form.reset(); hid.value = ""; val.textContent = placeholder; btn.classList.remove("has-val"); opts.forEach((o) => o.setAttribute("aria-selected", "false"));
  });
  form.addEventListener("input", (e) => { if (e.target.getAttribute && e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", "false"); });
})();
