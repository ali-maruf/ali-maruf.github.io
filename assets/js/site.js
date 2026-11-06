/* Ali Maruf. — site behaviour. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  /* ---------- Theme ---------- */
  function stored() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function apply(theme) { root.setAttribute("data-theme", theme); }

  media.addEventListener && media.addEventListener("change", function (e) {
    if (!stored()) apply(e.matches ? "dark" : "light");
  });

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      toggle.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  /* ---------- Nav shrink ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 40); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Project hover preview ---------- */
  var preview = document.querySelector(".preview");
  var canHover = window.matchMedia("(hover: hover) and (min-width: 861px)");
  if (preview) {
    var shot = preview.querySelector(".shot");
    var x = 0, y = 0, tx = 0, ty = 0, raf = 0, on = false;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var place = function (cx, cy) {
      var w = preview.offsetWidth, h = preview.offsetHeight;
      tx = Math.min(cx + 28, window.innerWidth - w - 16);
      ty = Math.max(16, Math.min(cy - h / 2, window.innerHeight - h - 16));
    };
    var tick = function () {
      x += (tx - x) * (still ? 1 : 0.18);
      y += (ty - y) * (still ? 1 : 0.18);
      preview.style.setProperty("--x", x.toFixed(1) + "px");
      preview.style.setProperty("--y", y.toFixed(1) + "px");
      raf = on && (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) ? requestAnimationFrame(tick) : 0;
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(tick); };

    var show = function (row) {
      var src = row.querySelector(".row-shot");
      if (!src) return;
      shot.style.setProperty("--tint", src.style.getPropertyValue("--tint"));
      shot.setAttribute("data-label", src.getAttribute("data-label") || "");
      shot.innerHTML = src.innerHTML;
      if (!on) { x = tx; y = ty; }
      on = true;
      preview.classList.add("is-on");
      kick();
    };
    var hide = function () { on = false; preview.classList.remove("is-on"); };

    document.querySelectorAll(".row").forEach(function (row) {
      row.addEventListener("mouseenter", function (e) {
        if (!canHover.matches) return;
        place(e.clientX, e.clientY);
        show(row);
      });
      row.addEventListener("mousemove", function (e) {
        if (!canHover.matches) return;
        place(e.clientX, e.clientY);
        if (on) kick(); else show(row);
      });
      row.addEventListener("mouseleave", hide);
      row.addEventListener("focus", function () {
        if (!canHover.matches) return;
        var r = row.getBoundingClientRect();
        place(r.right - preview.offsetWidth - 48, r.top + r.height / 2);
        show(row);
      });
      row.addEventListener("blur", hide);
    });
    window.addEventListener("scroll", function () { if (on) hide(); }, { passive: true });
  }

  /* ---------- Bit, the tiny robot ---------- */
  (function () {
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var wrap = document.createElement("div");
    wrap.className = "bot";
    wrap.innerHTML =
      '<span class="bot-say" role="status" aria-live="polite"></span>' +
      '<span class="bot-z" aria-hidden="true">z</span><span class="bot-z" aria-hidden="true">z</span>' +
      '<button class="bot-btn" type="button" aria-label="Say hi to Bit, the robot">' +
        '<svg viewBox="0 0 64 74" aria-hidden="true">' +
          '<g class="b-body">' +
            '<line x1="32" y1="8" x2="32" y2="17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
            '<circle class="b-light" cx="32" cy="6" r="4.2"/>' +
            '<rect x="5" y="29" width="5" height="11" rx="2.5" fill="currentColor"/>' +
            '<rect x="54" y="29" width="5" height="11" rx="2.5" fill="currentColor"/>' +
            '<rect x="9" y="16" width="46" height="36" rx="13" fill="currentColor"/>' +
            '<rect class="b-plate" x="15" y="22" width="34" height="23" rx="8.5"/>' +
            '<g class="b-eyes">' +
              '<rect class="b-eye" x="22.5" y="28.5" width="5.5" height="9" rx="2.75" fill="currentColor"/>' +
              '<rect class="b-eye" x="36" y="28.5" width="5.5" height="9" rx="2.75" fill="currentColor"/>' +
            '</g>' +
            '<path class="b-mouth" d="M28.5 40.5 Q32 43.5 35.5 40.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '<rect class="b-arm b-arm--l" x="12" y="55" width="6" height="12" rx="3" fill="currentColor"/>' +
            '<rect class="b-arm b-arm--r" x="46" y="55" width="6" height="12" rx="3" fill="currentColor"/>' +
            '<rect x="20" y="54" width="24" height="16" rx="7" fill="currentColor"/>' +
            '<rect class="b-plate" x="27" y="59" width="10" height="3" rx="1.5"/>' +
          '</g>' +
        '</svg>' +
      '</button>';
    document.body.appendChild(wrap);

    var btn = wrap.querySelector(".bot-btn");
    var say = wrap.querySelector(".bot-say");
    var lines = [
      "Hi. I'm Bit, the intern.",
      "Ali is shipping something. Again.",
      "Try the moon button up top.",
      "I run on coffee and TypeScript.",
      "Built in Dhaka. Rendered everywhere.",
      "This page is lighter than your selfie.",
      "Click me less. I'm working.",
      "Hire Ali. I need a raise."
    ];
    var n = 0, sayTimer = 0, hopTimer = 0;

    function talk(text, ms) {
      say.textContent = text;
      say.classList.add("is-on");
      clearTimeout(sayTimer);
      sayTimer = setTimeout(function () { say.classList.remove("is-on"); }, ms || 2800);
    }
    function hop() {
      if (still) return;
      wrap.classList.remove("is-hop");
      void wrap.offsetWidth;
      wrap.classList.add("is-hop");
      clearTimeout(hopTimer);
      hopTimer = setTimeout(function () { wrap.classList.remove("is-hop"); }, 650);
    }

    btn.addEventListener("click", function () {
      wake();
      hop();
      talk(lines[n % lines.length]);
      n++;
    });

    /* Reacts to the theme toggle */
    var tgl = document.querySelector(".theme-toggle");
    if (tgl) tgl.addEventListener("click", function () {
      wake();
      talk(root.getAttribute("data-theme") === "dark" ? "Lights off. Nice." : "Lights on. My eyes.", 2200);
    });

    /* Says hi once per visit */
    var seen = false;
    try { seen = sessionStorage.getItem("bit-hi") === "1"; sessionStorage.setItem("bit-hi", "1"); } catch (e) {}
    if (!seen) setTimeout(function () { hop(); talk(lines[0], 3200); n = 1; }, 2400);

    /* Notices when you reach the end */
    var ended = false;
    window.addEventListener("scroll", function () {
      if (ended) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        ended = true;
        talk("You made it to the end. Say hi?", 3200);
      }
    }, { passive: true });

    /* Eyes follow the pointer */
    if (window.matchMedia("(pointer: fine)").matches) {
      var raf = 0, px = 0, py = 0;
      window.addEventListener("mousemove", function (e) {
        px = e.clientX; py = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = btn.getBoundingClientRect();
          var dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height * 0.4);
          var d = Math.max(1, Math.hypot(dx, dy));
          wrap.style.setProperty("--ex", (dx / d * 3).toFixed(2) + "px");
          wrap.style.setProperty("--ey", (dy / d * 2.2).toFixed(2) + "px");
        });
      }, { passive: true });
    }

    /* Dozes off when left alone */
    var idle = 0;
    function wake() {
      wrap.classList.remove("is-asleep");
      clearTimeout(idle);
      idle = setTimeout(function () { wrap.classList.add("is-asleep"); }, 25000);
    }
    ["mousemove", "keydown", "scroll", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, wake, { passive: true });
    });
    wake();
  })();

  /* ---------- Copy email ---------- */
  var copy = document.querySelector("[data-copy]");
  if (copy) {
    copy.addEventListener("click", function () {
      var text = copy.getAttribute("data-copy");
      var done = function () {
        copy.textContent = "Copied.";
        setTimeout(function () { copy.textContent = "Copy"; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  }
})();
