/* ════════════════════════════════════════════════════════════════
   UNIVENS — context-aware navigation
   Almost invisible, constantly adapting. Background-aware color,
   scroll/section material, narrative progress, behavior-aware CTA,
   150ms state memory. No decoration for its own sake.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');
  const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav      = document.getElementById('nav');
  const ctaEl    = document.getElementById('navCta');
  const slides   = Array.from(document.querySelectorAll('.slide'));
  const reveals  = Array.from(document.querySelectorAll('.reveal'));

  /* ─── Content-Aware Presentation Engine ────────────────────────
     Each viewport declares its intent + composition + density. The
     engine maps that to a layout class and tunes typography scale and
     spacing rhythm via CSS variables — the layout is generated from
     the content's meaning, not a fixed template. */
  const COMP = {
    convergence: 'screen--convergence', fragments: 'screen--fragments', clients: 'screen--clients',
    industries: 'screen--industries', authority: 'screen--authority', outcomes: 'screen--outcomes',
    voices: 'screen--voices', console: 'screen--console'
  };
  const DENSITY = {
    low:  { scale: 1.06, rhythm: 'var(--sp-7)' },
    mid:  { scale: 1.0,  rhythm: 'var(--sp-6)' },
    high: { scale: 0.94, rhythm: 'var(--sp-5)' }
  };
  function presentEngine() {
    slides.forEach((s) => {
      const screen = s.querySelector('.screen');
      const comp = s.dataset.comp;
      if (screen && comp && COMP[comp]) screen.classList.add(COMP[comp]);
      const d = DENSITY[s.dataset.density] || DENSITY.mid;
      s.style.setProperty('--comp-scale', d.scale);
      s.style.setProperty('--comp-rhythm', d.rhythm);
    });
  }
  presentEngine();

  /* Gliding active-rule for the precision toolbar */
  const navLinksEl   = document.getElementById('navLinks');
  const navIndicator = document.getElementById('navIndicator');
  function syncNav(active) {
    const id = slides[active] && slides[active].id;
    if (!id || !navLinksEl) return;
    let target = null;
    navLinksEl.querySelectorAll('.nav-link').forEach((l) => {
      const on = l.getAttribute('href') === '#' + id;
      l.classList.toggle('is-active', on);
      if (on) target = l;
    });
    if (!navIndicator) return;
    if (target) {
      navIndicator.style.width = target.offsetWidth + 'px';
      navIndicator.style.transform = 'translateX(' + target.offsetLeft + 'px)';
    } else {
      navIndicator.style.width = '0px';
    }
  }
  function placeIndicator() { syncNav(committed.active); }

  /* ─── Founder Conversation Engine ───────────────────────────
     Not a set of section notes — a single, stateful dialogue that
     only ever moves forward. Each beat is written as the *next
     sentence* after the one before it: it remembers what was said,
     reacts to what's now on screen, and sets up what comes next.
     The relationship deepens through fixed stages and never rewinds. */
  const insight     = document.getElementById('insight');
  const insightBody = document.getElementById('insightBody');

  const STAGES = ['Stranger', 'Recognition', 'SharedReality', 'Curiosity',
                  'MutualUnderstanding', 'Credibility', 'Collaboration', 'Invitation'];

  /* The dialogue, in order. `at` = the section that brings this thought to
     mind (conceptually, not literally). Read straight down: it's one talk. */
   const CONVERSATION = [
    { at: 'hero',         stage: 'Recognition',         line: 'Oh — hey. Good timing. You\u2019re looking for execution, not another proposal. You\u2019re in the right place.' },
    { at: 'introduction', stage: 'SharedReality',       line: 'The problem is rarely skill. It\u2019s five vendors, five timelines, nobody owning the whole. We just become that one owner.' },
    { at: 'capabilities', stage: 'Curiosity',           line: 'Notice these aren\u2019t departments? They\u2019re outcomes — Acquire, Build, Automate, Scale. You tell us the result.' },
    { at: 'clients',      stage: 'Curiosity',           line: 'Same standard, very different problems. A global brand and a seed-stage team get the same discipline.' },
    { at: 'experience',   stage: 'MutualUnderstanding', line: 'Where\u2019d the standard come from? Years inside Disney, Amazon, Viacom18. We bring that bar to your work.' },
    { at: 'industries',   stage: 'MutualUnderstanding', line: 'Different industry, same operating model. We learn how you run, then decide how you should grow.' },
    { at: 'voices',       stage: 'Collaboration',       line: 'These aren\u2019t testimonials we chased. Just messages people sent after. That\u2019s the part I care about.' },
    { at: 'start',        stage: 'Invitation',          line: 'Anyway — I\u2019ve enjoyed this. Tell me what you\u2019re building; I suspect we\u2019d get along.' }
  ];
  const BEAT_OF = {};
  CONVERSATION.forEach((b, i) => { BEAT_OF[b.at] = i; });

  /* ─── Scroll-Driven Background Transition System ─────────────
     One fixed canvas interpolates between per-section "states". Most
     states stay light (a subtle drift); only the finale goes dark, so
     progression is felt, never announced. The whole environment — bg,
     atmosphere, nav, insight, typography colors, borders, glass — is
     driven by the same live --bg / --c-* variables, so it moves as one. */
  const STATES = {
    hero:         { bg: '#FFFFFF', mode: 'light' },  /* clean white — opening */
    introduction: { bg: '#FAF8F5', mode: 'light' },  /* soft warm white */
    capabilities: { bg: '#F4F4F2', mode: 'light' },  /* light neutral gray */
    clients:      { bg: '#EDEEF0', mode: 'light' },  /* soft graphite tint */
    experience:   { bg: '#FFFFFF', mode: 'light' },  /* clean white — structure */
    industries:   { bg: '#F2F2F0', mode: 'light' },  /* light neutral gray */
    voices:       { bg: '#F8F6F2', mode: 'light' },  /* soft warm white — momentum */
    start:        { bg: '#0E0E10', mode: 'dark'  }   /* deep black — confidence */
  };
  const PALETTE = {
    light: {
      cFg: '#0E0E10', cFgSoft: '#6B6B70', cFgFaint: '#9A9A9F',
      cLine: '#E8E8EA', cSurface: '#F6F6F7', cSurface2: '#ECECED',
      cGlass: 'rgba(255,255,255,0.72)', cGlassBorder: 'rgba(255,255,255,0.55)',
      atmos1: 'rgba(14,14,16,0.030)', atmos2: 'rgba(14,14,16,0.020)',
      atmosLine: '#E8E8EA', atmosPat: '0.6'
    },
    dark: {
      cFg: '#F7F7F8', cFgSoft: '#C7C7CC', cFgFaint: '#6B6B70',
      cLine: 'rgba(255,255,255,0.10)', cSurface: '#161618', cSurface2: '#1E1E21',
      cGlass: 'rgba(14,14,16,0.55)', cGlassBorder: 'rgba(255,255,255,0.16)',
      atmos1: 'rgba(247,247,248,0.050)', atmos2: 'rgba(247,247,248,0.030)',
      atmosLine: 'rgba(255,255,255,0.06)', atmosPat: '0.9'
    }
  };
  const root = document.documentElement;
  function applyState(id) {
    const st = STATES[id];
    if (!st) return;
    const p = PALETTE[st.mode];
    root.style.setProperty('--bg', st.bg);
    root.style.setProperty('--atmos-1', p.atmos1);
    root.style.setProperty('--atmos-2', p.atmos2);
    root.style.setProperty('--atmos-line', p.atmosLine);
    root.style.setProperty('--atmos-pat', p.atmosPat);
    root.style.setProperty('--c-fg', p.cFg);
    root.style.setProperty('--c-fg-soft', p.cFgSoft);
    root.style.setProperty('--c-fg-faint', p.cFgFaint);
    root.style.setProperty('--c-line', p.cLine);
    root.style.setProperty('--c-surface', p.cSurface);
    root.style.setProperty('--c-surface-2', p.cSurface2);
    root.style.setProperty('--c-glass', p.cGlass);
    root.style.setProperty('--c-glass-border', p.cGlassBorder);
  }

  /* calm reveals */
  if (reduce) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const rObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); rObs.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => rObs.observe(el));
  }

  /* Timeline proof rows: numbers count up when read — information
     organising itself, not decoration. */
  const counters = Array.from(document.querySelectorAll('.tl__year[data-count]'));
  function runCounters() {
    counters.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = target + suffix; return; }
      const dur = 900, t0 = performance.now();
      (function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }
  if (counters.length) {
    const tlSection = document.getElementById('experience');
    if (tlSection) {
      const cObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { runCounters(); cObs.disconnect(); } });
      }, { threshold: 0.4 });
      cObs.observe(tlSection);
    } else { runCounters(); }
  }

  /* Voices: a horizontal conversation you can drag through — like reading
     a thread, not a row of testimonial cards. */
  const voicesEl = document.querySelector('.voices');
  if (voicesEl && !reduce) {
    let down = false, startX = 0, startScroll = 0, moved = false;
    voicesEl.style.cursor = 'grab';
    voicesEl.addEventListener('pointerdown', (e) => {
      down = true; moved = false; startX = e.clientX;
      startScroll = voicesEl.scrollLeft; voicesEl.style.cursor = 'grabbing';
    });
    voicesEl.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      voicesEl.scrollLeft = startScroll - dx;
    });
    const end = () => { down = false; voicesEl.style.cursor = 'grab'; };
    voicesEl.addEventListener('pointerup', end);
    voicesEl.addEventListener('pointerleave', end);
    voicesEl.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* ─── context-aware state ─────────────────────────────────── */
  let tick = false, stateTimer = null, idleTimer = null;
  const committed = { active: -1, theme: null, bg: -1 };

  function commit(active, theme) {
    if (ctaEl) {
      ctaEl.setAttribute('href', '#start');
    }
    syncNav(active);
    revealInsight();
    scheduleInsight(active);
  }

  /* ─── Founder Conversation: a forward-only dialogue ────────
     The engine holds one piece of state — how far the conversation
     has progressed (`convoCursor`). Reaching a new section advances
     the talk to that beat and the founder speaks the next thought.
     Scrolling back never rewinds it: the relationship only moves
     forward, so he never reintroduces himself or repeats a point.
     Gated on a settled reader so he never talks over your scrolling. */
  let insightReady = false, insightTimer = null, typeTimer = null, minTimer = null;
  let convoCursor = -1;            /* furthest beat the founder has reached */
  let stageReached = 0;            /* furthest relationship stage (never regresses) */
  let lastLine = '';               /* what he last actually said (for hover) */
  let lastActivity = Date.now();
  function markActivity() { lastActivity = Date.now(); }
  ['scroll', 'wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
    window.addEventListener(ev, markActivity, { passive: true }));

  function revealInsight() {
    if (insightReady || !insight) return;
    insightReady = true;
    requestAnimationFrame(() => insight.classList.add('is-ready'));
  }

  /* gate on a settled reader, then let the conversation advance */
  function scheduleInsight(active) {
    if (!insight) return;
    clearTimeout(insightTimer);
    const QUIET = 1400;
    const tryShow = () => {
      const since = Date.now() - lastActivity;
      if (since >= QUIET) advanceConversation(active);
      else insightTimer = setTimeout(tryShow, QUIET - since + 120);
    };
    insightTimer = setTimeout(tryShow, 320);
  }

  /* The heart of it: given where the visitor now is, decide the next
     natural thing to say — and only ever move the conversation forward. */
  function advanceConversation(active) {
    const id = slides[active] ? slides[active].id : null;
    if (id == null || !insightBody) return;
    const target = BEAT_OF[id];
    if (target == null) return;

    if (target > convoCursor) {
      /* new ground — the relationship steps forward one (or more) beats.
         If sections were skipped, catch up silently to the latest beat so
         the last thing said still fits what's on screen. */
      convoCursor = target;
      const beat = CONVERSATION[target];
      /* the relationship stage only ever climbs — never steps back */
      const si = STAGES.indexOf(beat.stage);
      if (si > stageReached) stageReached = si;
      insight.setAttribute('data-stage', STAGES[stageReached]);
      speak(beat.line, true);
    }
    /* target <= convoCursor: revisiting earlier ground. He doesn't rewind
       or repeat — the conversation simply rests where it got to. Hover
       still restores his most recent thought. */
  }

  /* Say a line. New thoughts type in; a restored thought appears at once. */
  function speak(line, isNew) {
    clearTimeout(typeTimer);
    lastLine = line;
    insight.classList.add('is-active');
    if (isNew && !reduce) {
      typeText(insightBody, line, holdThenMinimize);
    } else {
      insightBody.textContent = line;
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

  /* hover restores his most recent thought, then rests again */
  if (insight) {
    insight.addEventListener('mouseenter', () => {
      clearTimeout(minTimer);
      if (lastLine) {
        if (insightBody.textContent !== lastLine) insightBody.textContent = lastLine;
        insight.classList.add('is-active');
      }
    });
    insight.addEventListener('mouseleave', () => {
      minTimer = setTimeout(() => insight.classList.remove('is-active'), 600);
    });
  }

  function plan() {
    tick = false;
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 120);

    const mid = y + window.innerHeight * 0.5;
    let active = 0, theme = 'light';
    slides.forEach((s, i) => {
      const top = s.offsetTop, bottom = top + s.offsetHeight;
      if (mid >= top && mid < bottom) { active = i; theme = s.getAttribute('data-theme') || 'light'; }
    });
    nav.classList.toggle('is-dark', theme === 'dark');

    /* Predictive background — begin interpolating when the next section
       is ~28% visible (its top has crossed 72% of the viewport). The
       650ms ease then resolves as that section becomes the active one. */
    const predY = y + window.innerHeight * 0.72;
    let bgIdx = 0;
    slides.forEach((s, i) => {
      const top = s.offsetTop, bottom = top + s.offsetHeight;
      if (predY >= top && predY < bottom) bgIdx = i;
    });
    if (bgIdx !== committed.bg) {
      applyState(slides[bgIdx].id);
      committed.bg = bgIdx;
    }

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
  window.addEventListener('resize', () => { onScroll(); placeIndicator(); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeIndicator);
  window.addEventListener('load', placeIndicator);
  plan();

   /* ─── UI-first interactions ───────────────────────────────── */
  /* Contact console — minimal, validating interaction */
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      const ok = email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
      if (!ok) { if (status) status.textContent = 'Enter a valid email to continue.'; if (email) email.focus(); return; }
      if (status) status.textContent = 'Thanks — we’ll be in touch shortly.';
      form.reset();
    });
  }

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

  /* ─── Intelligent navigation: active-section awareness ───────
      The primary nav mirrors exactly where the reader is in the 10-screen
      narrative — a quiet compass, not a menu. (syncNav is defined near the
      Presentation Engine and drives the gliding .nav-indicator rule.) */

  /* ─── Custom guide cursor — a quiet, knowledgeable companion ──
     A precise dot plus a soft ring that lags to feel calm. It grows and
     names interactive intent, and hides on touch / reduced-motion. */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    const dot = document.createElement('div');
    dot.className = 'cursor';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    const label = document.createElement('span');
    label.className = 'cursor-ring__label';
    ring.appendChild(label);
    document.body.append(dot, ring);
    document.documentElement.classList.add('has-cursor');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, raf = null;
     const hoverSel = 'a, button, input, [data-magnetic]';
     const labelFor = (el) => {
       if (el.closest('[data-magnetic]')) return 'Go';
       if (el.closest('a[href^="#"]')) return 'View';
       return '';
     };

    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      const t = e.target.closest(hoverSel);
      if (t) {
        ring.classList.add('is-hover');
        label.textContent = labelFor(t);
      } else {
        ring.classList.remove('is-hover');
      }
      if (!raf) raf = requestAnimationFrame(follow);
    }, { passive: true });

    window.addEventListener('pointerdown', () => { dot.classList.add('is-down'); ring.classList.add('is-down'); });
    window.addEventListener('pointerup', () => { dot.classList.remove('is-down'); ring.classList.remove('is-down'); });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = ''; ring.style.opacity = ''; });

    function follow() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      if (Math.abs(mx - rx) > 0.4 || Math.abs(my - ry) > 0.4) raf = requestAnimationFrame(follow);
      else raf = null;
    }
  }

  /* ─── Magnetic targets — controls that lean toward intent ─── */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 0.28;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* keep nav compass in sync on every scroll frame */

  /* ─── System initialization preloader ───────────────────────
     A calm boot sequence: background holds, wordmark fades upward,
     a micro status line appears, a 1px rule fills with spring easing,
     then the whole interface dissolves into the homepage. The preloader
     background matches the first Scroll-Driven Background state, so the
     handoff is seamless. Cached visitors get a minimal 450ms pass. */
  function runPreloader() {
    const pre = document.getElementById('preloader');
    if (!pre) { document.querySelector('#hero .screen--convergence')?.classList.add('is-live'); return; }
    const statusEl = document.getElementById('preloaderStatus');
    const fill = document.getElementById('preloaderFill');
    const STATES = [
      'Initializing workspace…', 'Building environment…', 'Preparing execution…',
      'Establishing context…', 'Loading experience…'
    ];
    if (statusEl) statusEl.textContent = STATES[Math.floor(Math.random() * STATES.length)];
    document.body.classList.add('is-booting');

    /* As the boot dissolves, the opening scene begins: fragments
       converge, the word lands, then the sentence completes it. */
    const startHero = () => {
      const scene = document.querySelector('#hero .screen--convergence');
      if (scene) scene.classList.add('is-live');
    };
    const finish = () => {
      pre.classList.add('is-done');
      setTimeout(() => {
        if (pre.parentNode) pre.remove();
        document.body.classList.remove('is-booting');
        startHero();
      }, 650);
    };

    if (reduce) { pre.classList.add('is-active'); setTimeout(finish, 200); return; }

    let visited = false;
    try { visited = !!localStorage.getItem('univens_visited'); } catch (e) {}
    if (visited) {
      pre.classList.add('is-active');
      setTimeout(finish, 450);
      return;
    }
    try { localStorage.setItem('univens_visited', '1'); } catch (e) {}

    pre.classList.add('is-active');
    const fillStart = 620, fillDur = 1100;
    setTimeout(() => {
      if (fill) fill.style.transition = 'transform ' + fillDur + 'ms cubic-bezier(.34,1.56,.64,1)';
      pre.classList.add('is-filling');
    }, fillStart);

    let done = false;
    const complete = () => { if (done) return; done = true; finish(); };
    if (document.readyState === 'complete') setTimeout(complete, Math.min(fillStart + fillDur, 1500));
    else {
      window.addEventListener('load', () => setTimeout(complete, 350), { once: true });
      setTimeout(complete, fillStart + fillDur + 60);
    }
  }
  runPreloader();
})();
