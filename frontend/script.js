/* =========================================================
   SI Labbz — interactions
   ========================================================= */
(function () {
  'use strict';

  /* ── Backend API ──────────────────────────────────────────
     If the frontend & backend are deployed as SEPARATE Vercel
     projects (recommended), set this to your backend URL,
     e.g. 'https://api.silabbz.com'.
     Leave '' to call same-origin '/api' (single-project setup).
     If the request fails (or no backend yet), the form gracefully
     falls back to opening WhatsApp with the details pre-filled. */
  const API_BASE = '';
  const WHATSAPP_NUMBER = '923174494381';
  const CONTACT_EMAIL = 'silabbz1@gmail.com';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------- Nav scrolled state + scroll progress ---------- */
  const progress = $('.scroll-progress');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    const backTop = $('#backTop');
    if (backTop) backTop.classList.toggle('show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  $('#backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- Cursor glow (fine pointers only) ---------- */
  const glow = $('.cursor-glow');
  if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    window.addEventListener('mousemove', (e) => {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('in'), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('.count');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    const dur = 1600;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Scrollspy (active nav link) ---------- */
  const spyLinks = $$('#navLinks a:not(.btn)');
  const sections = spyLinks
    .map((a) => $(a.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          spyLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => so.observe(s));
  }

  /* ---------- FAQ: single-open accordion ---------- */
  const faqItems = $$('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach((o) => { if (o !== item) o.open = false; });
    });
  });

  /* ---------- Tech stack grid ---------- */
  const techGrid = $('#techGrid');
  if (techGrid) {
    const base = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
    const techs = [
      { name: 'React', icon: 'react/react-original.svg' },
      { name: 'Next.js', icon: 'nextjs/nextjs-original.svg' },
      { name: 'Node.js', icon: 'nodejs/nodejs-original.svg' },
      { name: 'Python', icon: 'python/python-original.svg' },
      { name: 'Django', icon: 'django/django-plain.svg' },
      { name: 'Flutter', icon: 'flutter/flutter-original.svg' },
      { name: 'React Native', icon: 'react/react-original.svg' },
      { name: 'PostgreSQL', icon: 'postgresql/postgresql-original.svg' },
      { name: 'MySQL', icon: 'mysql/mysql-original.svg' },
      { name: 'AWS', icon: 'amazonwebservices/amazonwebservices-original-wordmark.svg' },
      { name: 'Docker', icon: 'docker/docker-original.svg' },
    ];
    const frag = document.createDocumentFragment();
    techs.forEach((t) => {
      const card = document.createElement('div');
      card.className = 'tech-card';
      const logo = document.createElement('div');
      logo.className = 'tech-logo';
      const img = document.createElement('img');
      img.src = base + t.icon;
      img.alt = t.name + ' logo';
      img.loading = 'lazy';
      img.addEventListener('error', () => {
        const fb = document.createElement('span');
        fb.className = 'fallback';
        fb.textContent = t.name.replace(/\.|\s.*/g, '').slice(0, 4);
        logo.replaceChildren(fb);
      });
      logo.appendChild(img);
      const name = document.createElement('span');
      name.className = 'tech-name';
      name.textContent = t.name;
      card.append(logo, name);
      frag.appendChild(card);
    });
    techGrid.appendChild(frag);
  }

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  };

  /* ---------- Contact form → backend API (WhatsApp fallback) ---------- */
  const form = $('#contactForm');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    const openWhatsApp = (data) => {
      const msg =
        `New Project Inquiry — SI Labbz\n\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || '—'}\n` +
        `Company: ${data.company || '—'}\n\n` +
        `Project Details:\n${data.details}`;
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const required = ['name', 'email', 'details'];
      let valid = true;
      required.forEach((id) => {
        const f = $('#' + id);
        const ok = f.value.trim() !== '' && (id !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) { showToast('Please fill in the required fields correctly.'); return; }

      const data = {
        name: $('#name').value.trim(),
        email: $('#email').value.trim(),
        phone: $('#phone').value.trim(),
        company: $('#company').value.trim(),
        details: $('#details').value.trim(),
      };

      const firstName = data.name.split(' ')[0];
      const origLabel = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      try {
        const res = await fetch(API_BASE + '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        showToast(`Thanks, ${firstName}! We'll get back to you within 24 hours.`);
        form.reset();
      } catch (err) {
        // Backend not reachable / not deployed yet → fall back to WhatsApp.
        openWhatsApp(data);
        showToast(`Thanks, ${firstName}! Opening WhatsApp to send your details…`);
        form.reset();
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origLabel; }
      }
    });

    // clear invalid state on input
    $$('#contactForm input, #contactForm textarea').forEach((f) =>
      f.addEventListener('input', () => f.classList.remove('invalid'))
    );
  }

  /* ---------- Career apply buttons ---------- */
  $$('.apply-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role || 'Open Position';
      const subject = encodeURIComponent(`Application: ${role} — SI Labbz`);
      const body = encodeURIComponent(
        `Hi SI Labbz team,\n\nI'd like to apply for the ${role} position.\n\n` +
        `Name:\nLocation:\nPortfolio / GitHub:\nWhy I'm a great fit:\n\n(Attach your CV to this email.)\n\nThanks!`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      showToast(`Opening your email to apply for ${role}…`);
    });
  });
})();
