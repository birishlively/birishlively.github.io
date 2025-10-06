// footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
function setOpen(open){
  if (!navToggle || !primaryNav) return;
  navToggle.setAttribute("aria-expanded", String(open));
  primaryNav.classList.toggle("open", open);
}
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });
  primaryNav.addEventListener("keydown", e => {
    if (e.key === "Escape") setOpen(false);
  });
}
