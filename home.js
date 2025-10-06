/* Main shared JS: nav toggle + current year + motion helpers */
(function () {
  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (toggle && navList) {
    toggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      // Close on outside click
      const onDocClick = (e) => {
        if (!navList.contains(e.target) && !toggle.contains(e.target)) {
          navList.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          document.removeEventListener("click", onDocClick);
        }
      };
      if (isOpen) document.addEventListener("click", onDocClick);
    });

    // Close menu when a link is chosen
    navList.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      navList.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  // Motion preference utility
  window.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
})();
