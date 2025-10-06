/* =========================
   Main JS • MAKO
   File: js/main.js
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------
  // Footer year auto-update
  // ------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ------------------------------
  // Mobile nav toggle
  // ------------------------------
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (toggle && navList) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close nav if clicked outside
    document.addEventListener("click", (e) => {
      if (
        navList.classList.contains("open") &&
        !navList.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close when selecting a link
    navList.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ------------------------------
  // Reveal animations (used site-wide)
  // ------------------------------
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) =>
      el.classList.add("is-visible")
    );
  }
});
