/**
 * State — central state manager and event bus.
 *
 * Holds the current index and year range (derived from data).
 * Modules subscribe to changes instead of referencing each other directly.
 *
 * Usage:
 *   State.subscribe(index => { ... })
 *   State.goTo(5)
 *   State.prev()
 *   State.next()
 */
const State = (() => {
  const yearCount = CAREER_DATA.length;
  const yearStart = CAREER_DATA[0].year;
  const yearEnd = CAREER_DATA[yearCount - 1].year;

  let currentIndex = yearCount - 1;
  let detailsExpanded = false;
  const listeners = [];

  function subscribe(fn) {
    listeners.push(fn);
  }

  function notify(toggleDetails) {
    listeners.forEach(fn => fn(currentIndex, toggleDetails));
  }

  function goTo(index, opts = {}) {
    if (index < 0 || index >= yearCount) return;
    const { fromScrub = false, toggleDetails = false } = opts;

    if (toggleDetails) {
      detailsExpanded = !detailsExpanded;
    } else if (index !== currentIndex) {
      detailsExpanded = false;
    }

    currentIndex = index;
    notify(toggleDetails);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function toggleDetails() {
    goTo(currentIndex, { toggleDetails: true });
  }

  function getIndex() {
    return currentIndex;
  }

  function isExpanded() {
    return detailsExpanded;
  }

  function getData(index) {
    return CAREER_DATA[index != null ? index : currentIndex];
  }

  return {
    subscribe,
    goTo,
    prev,
    next,
    toggleDetails,
    getIndex,
    isExpanded,
    getData,
    yearCount,
    yearStart,
    yearEnd,
  };
})();
