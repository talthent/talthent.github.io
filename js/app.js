/**
 * App — boot orchestration.
 *
 * Wires all modules together through State subscriptions.
 */
(() => {
  function boot() {
    Theme.init();

    Device.init(document.getElementById('carousel'));
    Timeline.init(document.getElementById('timeline'));
    CV.init(document.getElementById('cvPanel'));

    const about = About.init();
    Input.init({ aboutIsOpen: about.isOpen });

    // Wallpaper toggle (restore from localStorage)
    const wpBtn = document.getElementById('wallpaperToggle');
    const wpSaved = localStorage.getItem('wallpapers');
    const wpOn = wpSaved !== 'off';
    wpBtn.classList.toggle('active', wpOn);
    Device.setWallpapers(wpOn);

    wpBtn.addEventListener('click', () => {
      const on = !wpBtn.classList.contains('active');
      wpBtn.classList.toggle('active', on);
      Device.setWallpapers(on);
      localStorage.setItem('wallpapers', on ? 'on' : 'off');
    });

    // Set initial state (triggers all subscribers)
    State.goTo(State.yearCount - 1);

    // Entrance animation
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
