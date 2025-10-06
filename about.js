/* =========================
   About JS • MAKO
   File: about.js
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const statBox = document.querySelector(".stat");
  if (!statBox) return;

  const statEls = Array.from(statBox.querySelectorAll("strong")).map((el) => {
    const original = el.textContent.trim();
    const match = original.match(/[\d.]+/);
    const num = match ? parseFloat(match[0]) : 0;

    // Keep any prefix or suffix like "★" or "+"
    const prefix = original.slice(0, original.indexOf(match ? match[0] : ""));
    const suffix = original.slice(original.indexOf(match ? match[0] : "") + (match ? match[0].length : 0));

    // Decide decimal places: if original had a decimal, keep one
    const decimals = /\./.test(match ? match[0] : "") ? 1 : 0;

    return { el, original, prefix, suffix, target: num, decimals };
  });

  const animate = () => {
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      statEls.forEach(({ el, prefix, suffix, target, decimals }) => {
        const value = (target * t).toFixed(decimals);
        el.textContent = `${prefix}${value}${suffix}`;
      });
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (prefersReduced) {
    // Respect user setting; no animation
    return;
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    io.observe(statBox);
  } else {
    animate();
  }
});
