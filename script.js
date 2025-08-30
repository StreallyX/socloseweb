// Menu mobile
const navToggle = document.getElementById('navToggle');
const siteNav   = document.getElementById('siteNav');
if (navToggle && siteNav) navToggle.addEventListener('click', () => siteNav.classList.toggle('open'));

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
