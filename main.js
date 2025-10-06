/* =========================
   Main JS • MAKO
   File: js/main.js
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  // ----- Set current year -----
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Mobile navigation toggle -----
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (toggle && navList) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu if user clicks outside
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

    // Close menu after clicking a link
    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ----- Reveal on scroll (fade-up animation) -----
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
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

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
