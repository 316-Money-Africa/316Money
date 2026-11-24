/* Contact page: checks the required fields, then shows a confirmation. UI walk-through only: the message is not sent anywhere yet (no backend is connected). */
(() => {
  const form = document.querySelector("[data-ct-form]");
  if (!form) return;
  const status = form.querySelector("[data-ct-status]");
  const say = (text, bad) => { status.textContent = text; status.classList.toggle("is-err", !!bad); status.hidden = false; };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll("input[required], select[required], textarea[required]")];
    let first = null;
    fields.forEach((f) => {
      const ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "" && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value.trim()));
      f.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !first) first = f;
    });
    if (first) { say("Please complete the highlighted fields and agree to the privacy policy.", true); first.focus(); return; }
    say("Thank you. Your message is ready and our team will get back to you soon.", false);
    form.reset();
  });
  form.addEventListener("input", (e) => { if (e.target.getAttribute && e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", "false"); });
})();
