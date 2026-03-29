/**
 * Input — keyboard, wheel, and touch swipe handlers.
 *
 * All navigation delegates to State. Requires About.isOpen
 * to suppress navigation while the overlay is visible.
 */
const Input = (() => {
  let aboutIsOpen = () => false;

  function init(opts = {}) {
    if (opts.aboutIsOpen) aboutIsOpen = opts.aboutIsOpen;

    initKeyboard();
    initStageWheel();
    initTouchSwipe();
  }

  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (aboutIsOpen()) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          State.prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          State.next();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          State.toggleDetails();
          break;
      }
    });
  }

  function initStageWheel() {
    const THRESHOLD = 200;
    let accum = 0;

    document.querySelector('.stage').addEventListener('wheel', (e) => {
      if (e.target.closest('.cv-panel')) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      accum += delta;

      if (accum >= THRESHOLD) {
        State.next();
        accum = 0;
      } else if (accum <= -THRESHOLD) {
        State.prev();
        accum = 0;
      }
    }, { passive: false });
  }

  function initTouchSwipe() {
    const stage = document.querySelector('.stage');
    let startX = 0;
    let startY = 0;
    let swiping = false;

    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      swiping = true;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (!swiping) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        e.preventDefault();
      }
    }, { passive: false });

    stage.addEventListener('touchend', (e) => {
      if (!swiping) return;
      swiping = false;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? State.next() : State.prev();
      }
    }, { passive: true });
  }

  return { init };
})();
