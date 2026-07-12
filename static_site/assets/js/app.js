/* ════════════════════════════════════════════════════════════════
   UNIVENS — context-aware navigation
   Almost invisible, constantly adapting. Background-aware color,
   scroll/section material, narrative progress, behavior-aware CTA,
   150ms state memory. No decoration for its own sake.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav      = document.getElementById('nav');
  const ctaEl    = document.getElementById('navCta');
  const navNode  = document.getElementById('navNode');
  const slides   = Array.from(document.querySelectorAll('.slide'));
  const reveals  = Array.from(document.querySelectorAll('.reveal'));

  /* Executive Insight System */
  const insight     = document.getElementById('insight');
  const insightTag  = document.getElementById('insightTag');
  const insightBody = document.getElementById('insightBody');
  const insightProg = document.getElementById('insightProgress');

  /* behavior-aware CTA, keyed to the 10-section narrative */
  const CTAS     = [
    'Start the Conversation', 'See Our Work', 'See Our Work', 'See Our Work',
    'See Our Work', 'Build With Us', 'Work With Us', 'Founder Insights',
    'Start the Conversation', 'Let’s Build It Together'
  ];
  const CTA_HREF = [
    '#start', '#work', '#work', '#work',
    '#work', '#capabilities', '#start', '#perspective',
    '#start', 'mailto:hello@univens.com'
  ];

  /* Founder's voice — one short, sharp observation per section. Never sells.
     `tag` is the ambient system state, not a heading. */
  const INSIGHTS = {
    hero:        { tag: 'Thinking',  body: 'Most businesses don’t lack ambition. They lack a way to execute it.' },
    reality:     { tag: 'Observing', body: 'Execution is where most growth plans quietly die.' },
    shift:       { tag: 'Insight',   body: 'Vendors sell hours. Owners build momentum.' },
    proof:       { tag: 'Context',   body: 'Global brands, startup discipline. Same standard either way.' },
    work:        { tag: 'Observing', body: 'Every outcome started as a problem someone was tired of.' },
    capabilities:{ tag: 'Context',   body: 'We don’t run departments. We do the work that moves you.' },
    together:    { tag: 'Insight',   body: 'Understand, prioritize, build, improve, repeat. That’s the method.' },
    perspective: { tag: 'Thinking',  body: 'The fastest-growing companies get simpler, not more complicated.' },
    trust:       { tag: 'Live',      body: 'You’ll always know who owns what. That’s the deal.' },
    start:       { tag: 'Live',      body: 'Your next stage of growth deserves more than another agency.' }
  };

  /* calm reveals */
  if (reduce) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const rObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); rObs.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => rObs.observe(el));
  }

  /* ─── context-aware state ─────────────────────────────────── */
  let tick = false, stateTimer = null, idleTimer = null;
  const committed = { active: -1, theme: null };

  function commit(active, theme) {
    nav.classList.toggle('is-ondark', theme === 'dark');
    document.body.classList.toggle('is-ondark', theme === 'dark');
    if (insight) insight.classList.toggle('is-ondark', theme === 'dark');
    if (ctaEl) {
      ctaEl.textContent = CTAS[active] || 'Start the Conversation';
      ctaEl.setAttribute('href', CTA_HREF[active] || '#start');
    }
    revealInsight();
    scheduleInsight(active);
  }

  /* ─── Executive Insight: ambient, founder-led presence ─────
     Types a line the first time a section is seen; later visits show
     it instantly. Holds ~4.5s, then fades to a quiet resting state.
     Hover restores the line. Never fires mid-scroll (reading-gated). */
  let insightReady = false, insightTimer = null, typeTimer = null, minTimer = null;
  const seen = new Set();
  let lastActivity = Date.now();
  function markActivity() { lastActivity = Date.now(); }
  ['scroll', 'wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
    window.addEventListener(ev, markActivity, { passive: true }));

  function revealInsight() {
    if (insightReady || !insight) return;
    insightReady = true;
    requestAnimationFrame(() => insight.classList.add('is-ready'));
  }

  /* gate on a settled reader, then surface the insight */
  function scheduleInsight(active) {
    if (!insight) return;
    clearTimeout(insightTimer);
    const QUIET = 1400;
    const tryShow = () => {
      const since = Date.now() - lastActivity;
      if (since >= QUIET) presentInsight(active);
      else insightTimer = setTimeout(tryShow, QUIET - since + 120);
    };
    insightTimer = setTimeout(tryShow, 320);
  }

  function presentInsight(active) {
    const id = slides[active] ? slides[active].id : null;
    const data = INSIGHTS[id];
    if (!data || !insightBody) return;
    insightTag.textContent = data.tag;
    clearTimeout(typeTimer);
    const firstTime = !seen.has(id);
    seen.add(id);
    insight.classList.add('is-active');
    if (firstTime && !reduce) {
      typeText(insightBody, data.body, holdThenMinimize);
    } else {
      insightBody.textContent = data.body;
      holdThenMinimize();
    }
  }

  function typeText(el, text, done) {
    if (reduce) { el.textContent = text; done && done(); return; }
    el.textContent = '';
    let i = 0;
    (function step() {
      if (i <= text.length) { el.textContent = text.slice(0, i); i++; typeTimer = setTimeout(step, 32); }
      else { done && done(); }
    })();
  }

  function holdThenMinimize() {
    clearTimeout(minTimer);
    minTimer = setTimeout(() => { if (insight) insight.classList.remove('is-active'); }, 4500);
  }

  /* hover restores the line while engaged, then rests again */
  if (insight) {
    insight.addEventListener('mouseenter', () => {
      clearTimeout(minTimer);
      if (insightBody.textContent) insight.classList.add('is-active');
    });
    insight.addEventListener('mouseleave', () => {
      minTimer = setTimeout(() => insight.classList.remove('is-active'), 600);
    });
  }

  function updateInsightProgress(active, y) {
    if (!insightProg) return;
    const s = slides[active];
    if (!s) return;
    const h = s.offsetHeight - window.innerHeight;
    const p = h > 0 ? Math.min(1, Math.max(0, (y - s.offsetTop) / h)) : (active > 0 ? 1 : 0);
    insightProg.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }

  function plan() {
    tick = false;
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);

    const mid = y + window.innerHeight * 0.5;
    let active = 0, theme = 'light';
    slides.forEach((s, i) => {
      const top = s.offsetTop, bottom = top + s.offsetHeight;
      if (mid >= top && mid < bottom) { active = i; theme = s.getAttribute('data-theme') || 'light'; }
    });

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const prog = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
    if (navNode) navNode.style.left = (prog * 100).toFixed(2) + '%';
    updateInsightProgress(active, y);

    /* 150ms state memory — prevent boundary flicker */
    if (active !== committed.active || theme !== committed.theme) {
      clearTimeout(stateTimer);
      stateTimer = setTimeout(() => {
        commit(active, theme);
        committed.active = active;
        committed.theme = theme;
      }, 150);
    }
  }

  function onScroll() {
    if (!tick) { tick = true; requestAnimationFrame(plan); }
    nav.classList.remove('is-reading');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => nav.classList.add('is-reading'), 1200);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  plan();

  /* tactile smooth scroll for in-page anchors */
  if (!reduce) {
    document.querySelectorAll('a[href^="#"]').forEach((el) => {
      el.addEventListener('click', (ev) => {
        const href = el.getAttribute('href');
        if (href && href.length > 1) {
          const dest = document.querySelector(href);
          if (dest) { ev.preventDefault(); dest.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }
      });
    });
  }
})();
