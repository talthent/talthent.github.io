(() => {
  // ── Theme ──
  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const themeColorMeta = document.getElementById('themeColorMeta');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
      localStorage.setItem('theme', theme);
    }

    // Apply initial theme-color
    const initial = document.documentElement.getAttribute('data-theme');
    themeColorMeta.setAttribute('content', initial === 'dark' ? '#000000' : '#ffffff');

    document.getElementById('themeToggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // ── Info Area ──
  let detailsExpanded = false;

  function updateInfo(index, toggleDetails = false) {
    const data = CAREER_DATA[index];
    document.getElementById('infoRole').textContent = data.role;
    document.getElementById('infoCompany').textContent = data.company;
    document.getElementById('infoYear').textContent = `${data.year} \u2014 ${data.device.model}`;

    const details = document.getElementById('infoDetails');
    const highlights = document.getElementById('infoHighlights');

    if (toggleDetails) {
      detailsExpanded = !detailsExpanded;
    } else {
      detailsExpanded = false;
    }

    highlights.innerHTML = '';
    data.highlights.forEach(h => {
      const li = document.createElement('li');
      li.textContent = h;
      highlights.appendChild(li);
    });

    if (detailsExpanded) {
      details.classList.add('expanded');
    } else {
      details.classList.remove('expanded');
    }
  }

  // ── About Overlay ──
  function initAbout() {
    const overlay = document.getElementById('aboutOverlay');
    const content = document.getElementById('aboutContent');
    const btn = document.getElementById('aboutBtn');
    const closeBtn = document.getElementById('aboutClose');

    // Build about content
    content.innerHTML = `
      <div class="about-section">
        <h3 class="about-section-title">About</h3>
        <div class="about-text">
          <p>${ABOUT_DATA.intro}</p>
          <p>${ABOUT_DATA.personal}</p>
        </div>
      </div>

      <div class="about-section about-contact">
        <h3 class="about-section-title">Contact</h3>
        <p>${ABOUT_DATA.contact.location}</p>
        <p><a href="tel:${ABOUT_DATA.contact.phone}">${ABOUT_DATA.contact.phone}</a></p>
        <p><a href="mailto:${ABOUT_DATA.contact.email}">${ABOUT_DATA.contact.email}</a></p>
        <p><a href="${ABOUT_DATA.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a> &middot; <a href="${ABOUT_DATA.contact.github}" target="_blank" rel="noopener">GitHub</a> &middot; <a href="v1.html">Classic CV</a></p>
      </div>

      <div class="about-section">
        <h3 class="about-section-title">Technical Skills</h3>
        ${Object.entries(ABOUT_DATA.skills).map(([category, skills]) => `
          <div class="about-skills-category">
            <div class="about-skills-label">${category}</div>
            <div class="tags">
              ${skills.map(s => `<span class="tag">${s}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="about-section">
        <h3 class="about-section-title">Personal</h3>
        <ul class="about-interests">
          ${ABOUT_DATA.personal_interests.map(i => `<li><span>${i.icon}</span> ${i.label}</li>`).join('')}
        </ul>
      </div>
    `;

    let lastFocused = null;

    function openOverlay() {
      lastFocused = document.activeElement;
      overlay.classList.add('visible');
      overlay.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
    }

    function closeOverlay() {
      overlay.classList.remove('visible');
      overlay.setAttribute('aria-hidden', 'true');
      if (lastFocused) lastFocused.focus();
    }

    btn.addEventListener('click', openOverlay);
    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlay();
    });

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('visible')) return;

      if (e.key === 'Escape') {
        closeOverlay();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusable = overlay.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // ── Keyboard Navigation ──
  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('aboutOverlay').classList.contains('visible')) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          Carousel.prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          Carousel.next();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          updateInfo(Carousel.getCurrentIndex(), true);
          break;
      }
    });
  }

  // ── Global wheel on stage area ──
  function initStageWheel() {
    let scrollAccum = 0;
    const SCROLL_THRESHOLD = 200;

    document.querySelector('.stage').addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      scrollAccum += delta;

      if (scrollAccum >= SCROLL_THRESHOLD) {
        Carousel.next();
        scrollAccum = 0;
      } else if (scrollAccum <= -SCROLL_THRESHOLD) {
        Carousel.prev();
        scrollAccum = 0;
      }
    }, { passive: false });
  }

  // ── Touch Swipe on Stage ──
  function initTouchSwipe() {
    const stage = document.querySelector('.stage');
    let touchStartX = 0;
    let touchStartY = 0;
    let swiping = false;

    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      swiping = true;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (!swiping) return;
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        e.preventDefault();
      }
    }, { passive: false });

    stage.addEventListener('touchend', (e) => {
      if (!swiping) return;
      swiping = false;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) {
          Carousel.next();
        } else {
          Carousel.prev();
        }
      }
    }, { passive: true });
  }

  // ── Init ──
  function boot() {
    initTheme();

    // Carousel
    const carouselEl = document.getElementById('carousel');
    Carousel.init(carouselEl, (index, toggle) => {
      updateInfo(index, toggle);
      Timeline.update(index);
    });

    // Timeline
    const timelineEl = document.getElementById('timeline');
    Timeline.init(timelineEl, (index) => {
      Carousel.goTo(index, true);
      updateInfo(index, false);
      Timeline.update(index);
    });

    // About
    initAbout();

    // Keyboard
    initKeyboard();

    // Stage wheel
    initStageWheel();

    // Touch swipe
    initTouchSwipe();

    // Initial state — start at 2026
    const startIndex = CAREER_DATA.length - 1;
    updateInfo(startIndex);
    Timeline.update(startIndex);

    // Trigger entrance animations
    requestAnimationFrame(() => {
      document.querySelector('.app').classList.add('loaded');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
