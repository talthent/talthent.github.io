/**
 * Theme — dark/light mode management.
 *
 * Reads system preference, persists to localStorage,
 * and updates the theme-color meta tag dynamically.
 */
const Theme = (() => {
  function init() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const meta = document.getElementById('themeColorMeta');
    const initial = document.documentElement.getAttribute('data-theme');
    meta.setAttribute('content', initial === 'dark' ? '#000000' : '#ffffff');

    document.getElementById('themeToggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      document.documentElement.style.colorScheme = next;
      meta.setAttribute('content', next === 'dark' ? '#000000' : '#ffffff');
      localStorage.setItem('theme', next);
    });
  }

  return { init };
})();
