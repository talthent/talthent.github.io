/**
 * About — overlay modal with contact, skills, and interests.
 *
 * Builds content from ABOUT_DATA, manages open/close,
 * focus trapping, and Escape key dismissal.
 */
const About = (() => {
  function init() {
    const overlay = document.getElementById('aboutOverlay');
    const content = document.getElementById('aboutContent');
    const btn = document.getElementById('aboutBtn');
    const closeBtn = document.getElementById('aboutClose');

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

    function open() {
      lastFocused = document.activeElement;
      overlay.classList.add('visible');
      overlay.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove('visible');
      overlay.setAttribute('aria-hidden', 'true');
      if (lastFocused) lastFocused.focus();
    }

    function isOpen() {
      return overlay.classList.contains('visible');
    }

    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;

      if (e.key === 'Escape') {
        close();
        return;
      }

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

    return { isOpen };
  }

  return { init };
})();
