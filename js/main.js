(function () {
  'use strict';

  /* ---- Page transition ---- */
  function initPageTransition() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);

    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || link.target === '_blank') return;
      if (href.startsWith('http') && !href.includes(location.hostname)) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.remove('active');
        overlay.classList.add('exit');
        overlay.style.pointerEvents = 'all';

        setTimeout(() => {
          window.location.href = href;
        }, 280);
      });
    });

    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 350);
  }

  /* ---- Filter (works & notes) ---- */
  function initFilter(containerSelector, itemSelector, attrName) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const items = container.querySelectorAll(itemSelector);
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        items.forEach((item) => {
          if (filter === 'all' || item.dataset[attrName] === filter || item.dataset[attrName]?.includes(filter)) {
            item.classList.remove('hidden');
            item.style.animation = 'pageEnter 0.4s ease-out';
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---- Active nav highlight ---- */
  function initActiveNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a, .mobile-nav a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ---- Video autoplay fallback ---- */
  function initVideo() {
    const videos = document.querySelectorAll('.video-bg video, .crt-scene-video');
    if (!videos.length) return;

    const playAll = () => {
      videos.forEach((video) => {
        video.muted = true;
        video.playsInline = true;
        video.play().catch(() => {});
      });
    };

    playAll();
    document.addEventListener('click', playAll, { once: true });
  }

  /* ---- CRT zone keyboard access ---- */
  function initCrtZones() {
    document.querySelectorAll('.crt-zone').forEach((zone) => {
      zone.setAttribute('tabindex', '0');
    });
  }

  /* ---- Homepage random glitch ---- */
  function initHomeGlitch() {
    const home = document.querySelector('.home');
    if (!home) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const effects = [
      'is-glitch-slice',
      'is-glitch-rgb',
      'is-glitch-shake',
      'is-glitch-text',
      'is-glitch-flash',
      'is-glitch-static',
      'is-glitch-scan',
    ];

    function clearGlitch() {
      effects.forEach((cls) => home.classList.remove(cls));
    }

    function triggerGlitch() {
      clearGlitch();
      const effect = effects[Math.floor(Math.random() * effects.length)];
      home.classList.add(effect);

      const duration = 120 + Math.random() * 100;
      setTimeout(clearGlitch, duration);
      scheduleNext();
    }

    function scheduleNext() {
      const delay = 1800 + Math.random() * 5500;
      setTimeout(triggerGlitch, delay);
    }

    setTimeout(triggerGlitch, 1500 + Math.random() * 2000);
  }

  /* ---- Yellow pointer random glitch ---- */
  function initPointerGlitch() {
    const pointers = document.querySelectorAll('.crt-pointer');
    if (!pointers.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const effects = [
      'is-pointer-glitch-jolt',
      'is-pointer-glitch-flash',
      'is-pointer-glitch-rgb',
      'is-pointer-glitch-wobble',
      'is-pointer-glitch-vanish',
    ];

    function clearPointerGlitch(pointer) {
      effects.forEach((cls) => pointer.classList.remove(cls));
    }

    pointers.forEach((pointer, index) => {
      function trigger() {
        clearPointerGlitch(pointer);
        const effect = effects[Math.floor(Math.random() * effects.length)];
        pointer.classList.add(effect);

        const duration = 90 + Math.random() * 130;
        setTimeout(() => clearPointerGlitch(pointer), duration);
        setTimeout(trigger, 1200 + Math.random() * 4500 + index * 350);
      }

      setTimeout(trigger, 600 + Math.random() * 1800 + index * 500);
    });
  }

  /* ---- Flowing glitch ASCII (home corners) ---- */
  function initAsciiStream() {
    const streams = document.querySelectorAll('.ascii-stream');
    if (!streams.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const CHARS = '01アイウエオカキクケコサシスセソ0123<>[]{}|/\\#@$%&*~:;+=_?！？夢核VOIDNULLWAKEERR404SYS';
    const FRAGMENTS = ['DREAM', 'NULL', 'WAKE', '404', 'SYS', 'ERR', 'LIM', 'CORE', 'NOTE'];

    function randomChar() {
      if (Math.random() < 0.1) {
        const word = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
        return word[Math.floor(Math.random() * word.length)];
      }
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function buildColumn() {
      const col = document.createElement('div');
      col.className = 'ascii-col';
      col.style.setProperty('--flow-speed', (5 + Math.random() * 5).toFixed(2) + 's');
      col.style.setProperty('--flow-delay', (-Math.random() * 8).toFixed(2) + 's');

      const track = document.createElement('div');
      track.className = 'ascii-col-track';

      const rowCount = 26 + Math.floor(Math.random() * 12);
      const buildRows = () => {
        for (let i = 0; i < rowCount; i++) {
          const span = document.createElement('span');
          span.className = 'ascii-char';
          if (Math.random() < 0.08) span.classList.add('is-hot');
          span.textContent = randomChar();
          track.appendChild(span);
        }
      };

      buildRows();
      buildRows();
      col.appendChild(track);
      return col;
    }

    streams.forEach((stream) => {
      const inner = stream.querySelector('.ascii-stream-inner');
      if (!inner) return;

      const colCount = 10 + Math.floor(Math.random() * 4);
      for (let i = 0; i < colCount; i++) {
        inner.appendChild(buildColumn());
      }
    });

    function tickChars() {
      document.querySelectorAll('.ascii-char').forEach((char) => {
        if (Math.random() < 0.06) {
          char.textContent = randomChar();
          char.classList.toggle('is-hot', Math.random() < 0.25);
          if (Math.random() < 0.35) {
            char.classList.add('is-glitch');
            setTimeout(() => char.classList.remove('is-glitch'), 60 + Math.random() * 80);
          }
        }
      });
    }

    function tickStreamGlitch() {
      const stream = streams[Math.floor(Math.random() * streams.length)];
      stream.classList.add('is-stream-glitch');
      setTimeout(() => stream.classList.remove('is-stream-glitch'), 100 + Math.random() * 80);
      setTimeout(tickStreamGlitch, 900 + Math.random() * 2200);
    }

    setInterval(tickChars, 110);
    setTimeout(tickStreamGlitch, 1200);
  }

  /* ---- Door EXIT? / 禁止驶入 ---- */
  function initDoorMarkings() {
    const exits = document.querySelectorAll('.door-exit');
    if (!exits.length) return;

    const closeBtn = document.querySelector('.door-exit--close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.close();
        window.location.replace('about:blank');
      });
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const backGlitches = ['EXIT?', 'EX1T?', 'EX|T?', 'EXIT', 'EXIT??', 'EXI7?'];
    const closeGlitches = ['EXIT!', 'EX1T!', 'EX|T!', 'EXIT', 'EXIT!!', 'EXI7!'];

    function setExitText(el, text) {
      el.textContent = text;
      el.setAttribute('data-text', text);
    }

    function defaultExitText(el) {
      return el.classList.contains('door-exit--close') ? 'EXIT!' : 'EXIT?';
    }

    function glitchExit() {
      if (Math.random() < 0.22) {
        exits.forEach((el) => {
          const pool = el.classList.contains('door-exit--close') ? closeGlitches : backGlitches;
          setExitText(el, pool[Math.floor(Math.random() * pool.length)]);
        });
        setTimeout(() => {
          exits.forEach((el) => setExitText(el, defaultExitText(el)));
        }, 70 + Math.random() * 90);
      }
      setTimeout(glitchExit, 400 + Math.random() * 1200);
    }

    setTimeout(glitchExit, 800);
  }

  /* ---- Silhouette → Win95 popups ---- */
  function initSilhouettePopups() {
    const hit = document.querySelector('.silhouette-hit');
    const errorPopup = document.getElementById('popup-error');
    const warningPopup = document.getElementById('popup-warning');
    if (!hit || !errorPopup || !warningPopup) return;

    function openPopup(el) {
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
    }

    function closePopup(el) {
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
    }

    hit.addEventListener('click', () => {
      openPopup(errorPopup);
      openPopup(warningPopup);
    });

    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-close');
        const popup = id ? document.getElementById(id) : null;
        if (popup) closePopup(popup);
      });
    });

    [errorPopup, warningPopup].forEach((popup) => {
      popup.setAttribute('aria-hidden', 'true');
    });
  }

  /* ---- Orbit pages (Works / Notes / Lab): scatter + filter + drag ---- */
  function layoutContentOrbit() {
    const board = document.querySelector('.content-orbit');
    if (!board) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const items = [...board.querySelectorAll('.win-work:not(.hidden)')];

    if (isMobile) {
      items.forEach((item, i) => {
        const rot = ((i * 13 + 5) % 9) - 4;
        item.style.setProperty('--orbit-rot', `${rot}deg`);
      });
      return;
    }

    const centerX = 50;
    const centerY = 52;
    const minR = 36;
    const maxR = 50;
    const manClearR = 24;
    const itemGap = 22;
    const placed = [];

    function overlaps(x, y) {
      if (Math.hypot(x - centerX, y - centerY) < manClearR) return true;
      for (const p of placed) {
        if (Math.hypot(x - p.x, y - p.y) < itemGap) return true;
      }
      return false;
    }

    const toLayout = items.filter((item) => item.dataset.userPositioned !== 'true');

    toLayout.forEach((item, i) => {
      const baseAngle = (i / Math.max(toLayout.length, 1)) * Math.PI * 2 - Math.PI / 2;
      let x;
      let y;
      let attempts = 0;

      do {
        const angle = baseAngle + (Math.random() - 0.5) * 0.55;
        const radius = minR + Math.random() * (maxR - minR);
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius * 0.92;
        attempts += 1;
      } while (overlaps(x, y) && attempts < 50);

      placed.push({ x, y });

      const rot = (Math.random() - 0.5) * 22;
      const scale = 0.8 + Math.random() * 0.12;
      const cardW = 13;

      item.style.left = `${Math.max(1, Math.min(100 - cardW, x - cardW / 2))}%`;
      item.style.top = `${Math.max(6, Math.min(88, y - 6))}%`;
      item.style.transform = `rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
      item.style.setProperty('--orbit-rot', `${rot.toFixed(1)}deg`);
      item.style.zIndex = String(Math.floor(Math.random() * 18) + 6);
    });
  }

  function itemMatchesFilter(item, filter, mode) {
    if (filter === 'all') return true;
    if (mode === 'tags') {
      const tags = (item.dataset.tags || '').split(/\s+/);
      return tags.includes(filter);
    }
    return item.dataset[mode] === filter;
  }

  function initOrbitPage(filterMode) {
    const board = document.querySelector('.content-orbit');
    if (!board) return;

    const items = board.querySelectorAll('.win-work');
    const buttons = document.querySelectorAll('.orbit-filter .filter-btn');

    function applyFilter(filter) {
      items.forEach((item) => {
        const match = itemMatchesFilter(item, filter, filterMode);
        item.classList.toggle('hidden', !match);
        if (match) {
          item.style.animation = 'pageEnter 0.45s ease-out';
        }
      });
      layoutContentOrbit();
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });

    layoutContentOrbit();
    initOrbitDrag();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutContentOrbit, 180);
    });
  }

  function initOrbitDrag(options = {}) {
    const useWholeWindow =
      options.useWholeWindow ?? document.body.classList.contains('about-page');
    const board = document.querySelector('.content-orbit');
    if (!board) return;

    board.querySelectorAll('.win-work').forEach((card) => {
      const handle = useWholeWindow
        ? card.querySelector('.win-work__frame') || card
        : card.querySelector('.win-work__titlebar');
      if (!handle || handle.dataset.dragBound === 'true') return;
      handle.dataset.dragBound = 'true';

      let dragging = false;
      let moved = false;
      let startX = 0;
      let startY = 0;
      let originLeft = 0;
      let originTop = 0;

      function applyBoardPosition(leftPx, topPx) {
        const maxLeft = Math.max(0, board.clientWidth - card.offsetWidth);
        const maxTop = Math.max(0, board.clientHeight - card.offsetHeight);
        const x = Math.max(0, Math.min(maxLeft, leftPx));
        const y = Math.max(0, Math.min(maxTop, topPx));
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
        card.dataset.userPositioned = 'true';
      }

      function syncPixelPosition() {
        const boardRect = board.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        originLeft = cardRect.left - boardRect.left;
        originTop = cardRect.top - boardRect.top;
        card.style.left = `${originLeft}px`;
        card.style.top = `${originTop}px`;
      }

      function shouldIgnoreDragStart(e) {
        if (e.button !== 0) return true;
        if (e.target.closest('.win-work__chrome')) return true;
        if (useWholeWindow && e.target.closest('a')) return true;
        return false;
      }

      handle.addEventListener('pointerdown', (e) => {
        if (shouldIgnoreDragStart(e)) return;

        dragging = true;
        moved = false;
        syncPixelPosition();
        startX = e.clientX;
        startY = e.clientY;
        card.classList.add('is-dragging');
        card.style.zIndex = '200';
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
        e.stopPropagation();
      });

      handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;

        applyBoardPosition(originLeft + dx, originTop + dy);
        e.preventDefault();
      });

      function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('is-dragging');

        if (handle.hasPointerCapture(e.pointerId)) {
          handle.releasePointerCapture(e.pointerId);
        }

        if (moved) {
          card.dataset.dragJustEnded = 'true';
          setTimeout(() => {
            delete card.dataset.dragJustEnded;
          }, 120);
        }
      }

      handle.addEventListener('pointerup', endDrag);
      handle.addEventListener('pointercancel', endDrag);

      card.addEventListener('click', (e) => {
        if (card.dataset.dragJustEnded === 'true') {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });
  }

  function initOrbitGlitch() {
    const cards = document.querySelectorAll('.win-work:not(.hidden)');
    if (!cards.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function trigger() {
      const visible = document.querySelectorAll('.win-work:not(.hidden)');
      if (!visible.length) return;
      const card = visible[Math.floor(Math.random() * visible.length)];
      card.classList.add('is-glitch');
      setTimeout(() => card.classList.remove('is-glitch'), 160 + Math.random() * 100);
      setTimeout(trigger, 1800 + Math.random() * 3500);
    }

    setTimeout(trigger, 1200);
  }

  /* ---- Content page TV glitch ---- */
  function initContentTvGlitch() {
    const units = document.querySelectorAll('.tv-unit');
    if (!units.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function triggerGlitch() {
      const unit = units[Math.floor(Math.random() * units.length)];
      unit.classList.add('is-tv-glitch');
      setTimeout(() => unit.classList.remove('is-tv-glitch'), 120 + Math.random() * 80);
      setTimeout(triggerGlitch, 2000 + Math.random() * 4000);
    }

    setTimeout(triggerGlitch, 1500 + Math.random() * 2000);
  }

  function initAboutOrbit() {
    layoutContentOrbit();
    initOrbitDrag({ useWholeWindow: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutContentOrbit, 180);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPageTransition();
    initActiveNav();
    initVideo();
    initCrtZones();
    initHomeGlitch();
    initPointerGlitch();
    initDoorMarkings();
    initSilhouettePopups();
    initAsciiStream();
    initContentTvGlitch();
    if (document.body.classList.contains('works-page')) {
      initOrbitPage('category');
    }
    if (document.body.classList.contains('notes-page')) {
      initOrbitPage('tags');
    }
    if (document.body.classList.contains('lab-page')) {
      initOrbitPage('status');
    }
    if (document.body.classList.contains('about-page')) {
      initAboutOrbit();
    }
    initOrbitGlitch();
  });
})();
