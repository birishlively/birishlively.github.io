// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const target = document.querySelector(a.getAttribute("href"));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:"smooth"}); }
  });
});

// Reveal on scroll
const targets = document.querySelectorAll(".hero, .card, .info, .section-head");
targets.forEach(el=> el.classList.add("reveal"));
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add("is-in"); });
},{ threshold: .2 });
targets.forEach(el=> io.observe(el));

// Hero pop on load
const hero = document.querySelector(".hero");
if(hero) hero.classList.add("hero-pop");
