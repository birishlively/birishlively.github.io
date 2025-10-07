document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobby nav
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (toggle && navList) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // closes mennu 
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

    // closes menu pt 2
    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // fade-up animation
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
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
