/**
 * App — boot orchestration.
 *
 * Wires all modules together through State subscriptions.
 */
(() => {
  function boot() {
    Theme.init();

    Carousel.init(document.getElementById('carousel'));
    Timeline.init(document.getElementById('timeline'));
    CV.init(document.getElementById('cvPanel'));

    const about = About.init();
    Input.init({ aboutIsOpen: about.isOpen });

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
