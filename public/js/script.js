// public/js/script.js
// Frontend JavaScript for AI Help Desk Expert System

// ── Mobile Nav Toggle ────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ── Auto-dismiss Flash Messages ──────────────────────────
const flashes = document.querySelectorAll('.flash');
flashes.forEach(flash => {
  setTimeout(() => {
    flash.style.opacity = '0';
    flash.style.transition = 'opacity 0.5s ease';
    setTimeout(() => flash.remove(), 500);
  }, 5000); // auto-dismiss after 5 seconds
});

// ── Form Validation for Ticket Form ─────────────────────
const ticketForm = document.getElementById('ticketForm');
if (ticketForm) {
  ticketForm.addEventListener('submit', function (e) {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const problem = document.getElementById('problem').value.trim();

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      alert('Please enter your full name.');
      e.preventDefault(); return;
    }

    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      e.preventDefault(); return;
    }

    if (!problem || problem.length < 10) {
      alert('Please describe your problem in at least 10 characters.');
      e.preventDefault(); return;
    }
  });
}

// ── Animate Cards on Scroll ──────────────────────────────
// Simple intersection observer for fade-in effect
if ('IntersectionObserver' in window) {
  const animatedEls = document.querySelectorAll(
    '.feature-card, .query-card, .cat-card, .component-card, .tech-card, .stat-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

// ── Highlight active nav link ────────────────────────────
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.classList.add('active');
  }
});

// ── Admin: Confirm Status Change ─────────────────────────
document.querySelectorAll('.status-select').forEach(sel => {
  sel.addEventListener('change', function () {
    // The form auto-submits on change (via onchange="this.form.submit()")
    // Update visual class immediately
    this.className = 'status-select ' + this.value.toLowerCase().replace(' ', '-');
  });
});

console.log('🧠 AI Help Desk Expert System — Frontend Loaded');
console.log('📚 SPPU TE Artificial Intelligence Project');
