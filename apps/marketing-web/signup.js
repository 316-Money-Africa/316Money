/* Sign-up modal: every a[href="#sign-up"] opens it. Steps: 1 details -> 2 phone code -> 3 account ready.
   Marketing UI only: nothing is sent anywhere and no account is created (the real sign-up lives in the 316 app). */
(function () {
  var dlg = document.getElementById("sign-up");
  if (!dlg || typeof dlg.showModal !== "function") return;

  var steps = Array.prototype.slice.call(dlg.querySelectorAll("[data-su-step]"));
  var form = document.getElementById("su-form");
  var codeForm = document.getElementById("su-code-form");
  var digits = Array.prototype.slice.call(dlg.querySelectorAll(".su__digit"));
  var codeErr = document.getElementById("su-code-err");
  var resend = document.getElementById("su-resend");
  var note = document.getElementById("su-note");
  var sent = document.getElementById("su-sent");
  var root = document.documentElement;
  var timer = null;

  function show(n, focus) {
    steps.forEach(function (s) { s.hidden = s.getAttribute("data-su-step") !== String(n); });
    if (focus === false) return;
    var title = document.getElementById("su-title-" + n);
    dlg.setAttribute("aria-labelledby", "su-title-" + n);
    var first = n === 1 ? document.getElementById("su-name") : n === 2 ? digits[0] : title;
    if (first) first.focus();
  }

  function setErr(id, msg, input) {
    var el = document.getElementById(id);
    if (el) { el.textContent = msg || ""; el.hidden = !msg; }
    if (input) { if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid"); }
  }

  function reset() {
    form.reset();
    ["name", "phone", "email", "pass", "agree"].forEach(function (k) {
      setErr("su-" + k + "-err", "", document.getElementById("su-" + k));
    });
    digits.forEach(function (d) { d.value = ""; d.removeAttribute("aria-invalid"); });
    setErr("su-code-err", "");
    note.hidden = true;
    stopCooldown();
    show(1, false);
  }

  function open() {
    if (!dlg.open) { reset(); dlg.showModal(); root.classList.add("su-lock"); }
    show(1);
  }
  function close() { if (dlg.open) dlg.close(); }

  dlg.addEventListener("close", function () { root.classList.remove("su-lock"); stopCooldown(); if (location.hash === "#sign-up") history.replaceState(null, "", location.pathname + location.search); });
  // a click on the dimmed area (the dialog element itself, outside the card) closes it
  dlg.addEventListener("mousedown", function (e) { if (e.target === dlg) close(); });
  Array.prototype.forEach.call(dlg.querySelectorAll("[data-su-close]"), function (b) { b.addEventListener("click", close); });

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="#sign-up"]');
    if (!a) return;
    e.preventDefault();
    var toggle = document.getElementById("nav-toggle"); // close the phone menu first
    if (toggle) toggle.checked = false;
    open();
  });
  // "Sign in?" inside the modal goes to the sign-in link, so the modal gets out of the way
  dlg.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest('a[href="#sign-in"]'); if (a) close(); });
  if (location.hash === "#sign-up") open();

  /* ---------- step 1 ---------- */
  var phoneInput = document.getElementById("su-phone");
  phoneInput.addEventListener("input", function () { phoneInput.value = phoneInput.value.replace(/[^\d\s]/g, ""); });

  function validate() {
    var f = { name: document.getElementById("su-name"), phone: phoneInput, email: document.getElementById("su-email"), pass: document.getElementById("su-pass"), agree: document.getElementById("su-agree") };
    var digitsOnly = f.phone.value.replace(/\D/g, "").replace(/^0/, "");
    var bad = null;
    function check(key, msg) { setErr("su-" + key + "-err", msg, f[key]); if (msg && !bad) bad = f[key]; }
    check("name", f.name.value.trim().split(/\s+/).filter(Boolean).length >= 2 ? "" : "Enter your first and last name.");
    check("phone", digitsOnly.length === 10 ? "" : "Enter a valid 10-digit phone number.");
    check("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()) ? "" : "Enter a valid email address.");
    check("pass", f.pass.value.length >= 8 ? "" : "Use at least 8 characters.");
    check("agree", f.agree.checked ? "" : "Please accept the terms to continue.");
    if (bad) bad.focus();
    return bad ? null : digitsOnly;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var phone = validate();
    if (!phone) return;
    sent.textContent = "+234 " + phone.slice(0, 2) + "X XXX XXXX"; // the number is never shown in full
    digits.forEach(function (d) { d.value = ""; d.removeAttribute("aria-invalid"); });
    setErr("su-code-err", "");
    show(2);
    startCooldown();
  });
  form.addEventListener("input", function (e) { if (e.target.getAttribute("aria-invalid")) { var k = e.target.id.replace("su-", ""); setErr("su-" + k + "-err", "", e.target); } });

  /* ---------- step 2 ---------- */
  digits.forEach(function (d, i) {
    d.addEventListener("input", function () {
      var v = d.value.replace(/\D/g, "");
      if (v.length > 1) { fill(v, i); return; }
      d.value = v;
      d.removeAttribute("aria-invalid");
      setErr("su-code-err", "");
      if (v && digits[i + 1]) digits[i + 1].focus();
    });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !d.value && digits[i - 1]) { digits[i - 1].focus(); digits[i - 1].value = ""; e.preventDefault(); }
      if (e.key === "ArrowLeft" && digits[i - 1]) { digits[i - 1].focus(); e.preventDefault(); }
      if (e.key === "ArrowRight" && digits[i + 1]) { digits[i + 1].focus(); e.preventDefault(); }
    });
    d.addEventListener("paste", function (e) {
      var text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
      if (text) { e.preventDefault(); fill(text, i); }
    });
    d.addEventListener("focus", function () { d.select(); });
  });
  function fill(text, from) {
    for (var k = 0; k < text.length && from + k < digits.length; k++) digits[from + k].value = text.charAt(k);
    digits[Math.min(from + text.length, digits.length - 1)].focus();
    setErr("su-code-err", "");
  }

  codeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var code = digits.map(function (d) { return d.value; }).join("");
    if (code.length < digits.length) {
      digits.forEach(function (d) { if (!d.value) d.setAttribute("aria-invalid", "true"); });
      setErr("su-code-err", "Enter the 5-digit code.");
      (digits.filter(function (d) { return !d.value; })[0] || digits[0]).focus();
      return;
    }
    stopCooldown();
    show(3);
  });

  // "Resend" waits 30 seconds between codes
  function startCooldown() {
    var left = 30;
    resend.disabled = true;
    resend.textContent = "Resend in " + left + "s";
    stopTimer();
    timer = window.setInterval(function () {
      left -= 1;
      if (left <= 0) { stopCooldown(); return; }
      resend.textContent = "Resend in " + left + "s";
    }, 1000);
  }
  function stopTimer() { if (timer) { window.clearInterval(timer); timer = null; } }
  function stopCooldown() { stopTimer(); resend.disabled = false; resend.textContent = "Resend"; }
  resend.addEventListener("click", function () {
    digits.forEach(function (d) { d.value = ""; });
    setErr("su-code-err", "");
    note.textContent = "A new code is on its way.";
    note.hidden = false;
    digits[0].focus();
    startCooldown();
  });
})();
