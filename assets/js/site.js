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

  /* ---------- Mascot looks toward the pointer ---------- */
  var mascot = document.querySelector(".mascot svg");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (mascot && !calm && window.matchMedia("(pointer: fine)").matches) {
    var pending = 0, mx = 0, my = 0;
    var look = function () {
      pending = 0;
      var r = mascot.getBoundingClientRect();
      if (r.bottom < 0) return;
      var nx = Math.max(-1, Math.min(1, (mx - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      var ny = Math.max(-1, Math.min(1, (my - (r.top + r.height * 0.5)) / (window.innerHeight / 2)));
      mascot.style.setProperty("--tilt", (nx * 4).toFixed(2) + "deg");
      mascot.style.setProperty("--hx", (nx * 3).toFixed(1) + "px");
      mascot.style.setProperty("--px", (nx * 3.5).toFixed(1) + "px");
      mascot.style.setProperty("--py", (ny * 2.5).toFixed(1) + "px");
    };
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!pending) pending = requestAnimationFrame(look);
    }, { passive: true });
  }

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
