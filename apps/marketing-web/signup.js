/* Sign-up / sign-in modal: every a[href="#sign-up"] opens the "Create your account" choice, every a[href="#sign-in"] opens "Welcome back".
   Sign up: 0 choose (316 Pay or Email) -> 1 details -> 2 phone code -> 3 account ready -> Continue opens the Hotspots dashboard. Sign in: Login moves on to the "Create your account" choice screen.
   A walk-through of the screens only: "Create account" always moves to the next step (no checks, nothing blocks the flow), nothing is sent
   anywhere and no account is created (the real sign-up lives in the 316 app). */
(function () {
  var dlg = document.getElementById("sign-up");
  if (!dlg || typeof dlg.showModal !== "function") return;

  var steps = Array.prototype.slice.call(dlg.querySelectorAll("[data-su-step]"));
  var card = document.getElementById("su-card");
  var form = document.getElementById("su-form");
  var loginForm = document.getElementById("su-login-form");
  var codeForm = document.getElementById("su-code-form");
  var digits = Array.prototype.slice.call(dlg.querySelectorAll(".su__digit"));
  var resend = document.getElementById("su-resend");
  var note = document.getElementById("su-note");
  var sent = document.getElementById("su-sent");
  var root = document.documentElement;
  var timer = null;

  function show(n, focus) {
    card.setAttribute("data-view", String(n) === "login" ? "login" : "signup"); // the sign-in screen has its own purple picture panel
    steps.forEach(function (s) { s.hidden = s.getAttribute("data-su-step") !== String(n); });
    if (focus === false) return;
    var title = document.getElementById("su-title-" + n);
    dlg.setAttribute("aria-labelledby", "su-title-" + n);
    var first = String(n) === "1" ? document.getElementById("su-name") : String(n) === "2" ? digits[0] : String(n) === "login" ? document.getElementById("su-login-id") : title;
    if (first) first.focus();
  }

  function reset() {
    form.reset();
    loginForm.reset();
    digits.forEach(function (d) { d.value = ""; });
    note.hidden = true;
    stopCooldown();
    show(0, false);
  }

  function open(start) {
    if (!dlg.open) { reset(); dlg.showModal(); root.classList.add("su-lock"); }
    show(start);
  }
  function close() { if (dlg.open) dlg.close(); }

  dlg.addEventListener("close", function () { root.classList.remove("su-lock"); stopCooldown(); if (location.hash === "#sign-up" || location.hash === "#sign-in") history.replaceState(null, "", location.pathname + location.search); });
  // a click on the dimmed area (the dialog element itself, outside the card) closes it
  dlg.addEventListener("mousedown", function (e) { if (e.target === dlg) close(); });
  Array.prototype.forEach.call(dlg.querySelectorAll("[data-su-close]"), function (b) { b.addEventListener("click", close); });

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="#sign-up"], a[href="#sign-in"]');
    if (!a || dlg.contains(a)) return;
    e.preventDefault();
    var toggle = document.getElementById("nav-toggle"); // close the phone menu first
    if (toggle) toggle.checked = false;
    open(a.getAttribute("href") === "#sign-in" ? "login" : 0);
  });
  // links and buttons inside the modal that move between its screens (data-su-go="0|1|3|login")
  dlg.addEventListener("click", function (e) {
    var go = e.target.closest && e.target.closest("[data-su-go]");
    if (!go) return;
    e.preventDefault();
    show(go.getAttribute("data-su-go"));
  });
  if (location.hash === "#sign-up") open(0);
  if (location.hash === "#sign-in") open("login");

  // Login: no checks, nothing is sent; the next page is the "Create your account" choice screen
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    show(0);
  });

  /* ---------- step 1 ---------- */
  var phoneInput = document.getElementById("su-phone");
  phoneInput.addEventListener("input", function () { phoneInput.value = phoneInput.value.replace(/[^\d\s]/g, ""); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var typed = phoneInput.value.replace(/\D/g, "").replace(/^0/, "");
    // the number is never shown in full; with nothing typed the example shape is shown
    sent.textContent = "+234 " + (typed.length >= 2 ? typed.slice(0, 2) : "80") + "X XXX XXXX";
    digits.forEach(function (d) { d.value = ""; });
    show(2);
    startCooldown();
  });

  /* ---------- step 2 ---------- */
  digits.forEach(function (d, i) {
    d.addEventListener("input", function () {
      var v = d.value.replace(/\D/g, "");
      if (v.length > 1) { fill(v, i); return; }
      d.value = v;
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
  }

  codeForm.addEventListener("submit", function (e) {
    e.preventDefault();
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
    note.textContent = "A new code is on its way.";
    note.hidden = false;
    digits[0].focus();
    startCooldown();
  });
})();
