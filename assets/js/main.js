/* Avelon Swatches - interactions & animations */
(function () {
  'use strict';

  /* ---- sticky header state ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
    document.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => document.body.classList.remove('nav-open'))
    );
  }

  /* ---- scroll reveal + SVG draw ---- */
  const revealables = document.querySelectorAll('.reveal, .draw');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          if (e.target.dataset.count !== undefined) animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(el => io.observe(el));
    document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('in'));
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = el.dataset.count; });
  }

  /* ---- animated counters ---- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = prefix + val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- normalize SVG dash length for draw animation ---- */
  document.querySelectorAll('.draw').forEach(svg => {
    svg.querySelectorAll('path, line, polyline, circle, rect').forEach(shape => {
      try {
        const len = shape.getTotalLength ? shape.getTotalLength() : 300;
        shape.style.setProperty('--len', Math.ceil(len));
        shape.style.strokeDasharray = Math.ceil(len);
        shape.style.strokeDashoffset = Math.ceil(len);
      } catch (e) { /* non-path shapes */ }
    });
  });

  /* ---- hero subtle parallax on pointer ---- */
  const hero = document.querySelector('.hero-media');
  if (hero && window.matchMedia('(hover:hover)').matches) {
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      hero.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    });
  }

  /* ---- year ---- */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---- contact form (demo, no backend) ---- */
  const form = document.querySelector('#quoteForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = form.querySelector('.form-success');
      if (ok) ok.classList.add('show');
      form.reset();
      if (ok) ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
