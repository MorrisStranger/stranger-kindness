document.addEventListener('DOMContentLoaded', () => {

  // ---- Cursor glow ----
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(updateGlow);
  }
  requestAnimationFrame(updateGlow);

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ---- Mobile nav ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  // ---- Hero particles ----
  const particlesContainer = document.getElementById('particles');
  const colors = [
    'rgba(232,115,74,0.5)',
    'rgba(242,169,59,0.4)',
    'rgba(107,144,128,0.4)',
    'rgba(255,255,255,0.2)',
    'rgba(126,172,193,0.3)'
  ];

  function createParticle() {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 5 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = (Math.random() * 3) + 's';
    particlesContainer.appendChild(p);
    setTimeout(() => p.remove(), 20000);
  }

  for (let i = 0; i < 25; i++) setTimeout(createParticle, i * 200);
  setInterval(createParticle, 600);

  // ---- Counter animation ----
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.target);
    const duration = 2200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  }

  // ---- Ring progress animation ----
  function animateRings(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.ring-progress').forEach(ring => {
        const progress = parseFloat(ring.dataset.progress);
        const circumference = 339.3;
        ring.style.strokeDashoffset = circumference * (1 - progress);
      });
      observer.unobserve(entry.target);
    });
  }

  const ringObserver = new IntersectionObserver(animateRings, { threshold: 0.3 });
  document.querySelectorAll('.impact-grid').forEach(el => ringObserver.observe(el));

  // ---- Reveal on scroll ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---- Stats bar counter ----
  const statsBar = document.querySelector('.hero-stats-bar');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  if (statsBar) statsObserver.observe(statsBar);

  // ---- Timeline progress ----
  const timelineProgress = document.getElementById('timelineProgress');
  if (timelineProgress) {
    const section = document.getElementById('how-it-works');
    window.addEventListener('scroll', () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionH = section.offsetHeight;
      const scrolled = Math.max(0, windowH - rect.top);
      const progress = Math.min(scrolled / (sectionH + windowH * 0.3), 1);
      timelineProgress.style.height = (progress * 100) + '%';
    }, { passive: true });
  }

  // ---- Donate amount buttons ----
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customInput.value = '';
    });
  });

  if (customInput) {
    customInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
    });
  }

  // ---- Form submission ----
  const form = document.getElementById('volunteerForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const originalText = span.textContent;
    span.textContent = 'Thank You!';
    btn.style.background = 'var(--sage)';
    btn.disabled = true;

    setTimeout(() => {
      span.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---- Parallax for photo strip (duplicate for seamless loop) ----
  const photoTrack = document.querySelector('.photo-track');
  if (photoTrack) {
    const cards = photoTrack.innerHTML;
    photoTrack.innerHTML = cards + cards;
  }

  // ---- Tilt effect on hover for cards ----
  document.querySelectorAll('.about-card, .impact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
