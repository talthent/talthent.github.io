/**
 * Timeline — curved arc timeline with year labels and draggable indicator.
 *
 * Subscribes to State for index changes.
 * Derives year range from State instead of hardcoding.
 */
const Timeline = (() => {
  let svgEl, arcPath, container, inner, indicatorEl;
  let labelEls = [];
  let tickEls = [];
  let yearPoints = [];
  let isDragging = false;
  let totalLength = 0;

  const YEAR_START = State.yearStart;
  const YEAR_END = State.yearEnd;
  const YEAR_COUNT = YEAR_END - YEAR_START;

  function init(containerEl) {
    container = containerEl;

    inner = document.createElement('div');
    inner.className = 'timeline__inner';
    container.appendChild(inner);

    // SVG arc
    svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('viewBox', '0 0 1000 100');
    svgEl.setAttribute('preserveAspectRatio', 'none');
    svgEl.classList.add('timeline__svg');

    arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arcPath.setAttribute('d', 'M 30,85 Q 500,10 970,85');
    arcPath.setAttribute('class', 'timeline__arc');
    svgEl.appendChild(arcPath);
    inner.appendChild(svgEl);

    totalLength = arcPath.getTotalLength();

    // Major ticks and labels
    for (let year = YEAR_START; year <= YEAR_END; year++) {
      const t = (year - YEAR_START) / YEAR_COUNT;

      const tick = document.createElement('div');
      tick.className = 'timeline__tick-el timeline__tick-el--major';
      inner.appendChild(tick);
      tickEls.push({ el: tick, t, major: true });

      const label = document.createElement('div');
      label.className = 'timeline__label-el';
      label.textContent = year;
      label.dataset.year = year;
      label.addEventListener('click', (e) => {
        e.stopPropagation();
        State.goTo(year - YEAR_START);
      });
      inner.appendChild(label);
      labelEls.push(label);
    }

    // Fixed indicator dot (child of container, not inner)
    indicatorEl = document.createElement('div');
    indicatorEl.className = 'timeline__dot';
    container.appendChild(indicatorEl);

    layoutElements();
    positionDot();

    window.addEventListener('resize', () => {
      layoutElements();
      positionDot();
      scrollToIndex(State.getIndex());
    });

    initInteractions();

    // Subscribe to state changes
    State.subscribe((index) => update(index));
  }

  // ── Geometry helpers ──

  function getPointRelativeToInner(t) {
    const svgPt = arcPath.getPointAtLength(t * totalLength);
    const rect = svgEl.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    return {
      x: rect.left - innerRect.left + (svgPt.x / 1000) * rect.width,
      y: rect.top - innerRect.top + (svgPt.y / 100) * rect.height
    };
  }

  function getTangentAngle(t) {
    const len = t * totalLength;
    const pt1 = arcPath.getPointAtLength(Math.max(0, len - 2));
    const pt2 = arcPath.getPointAtLength(Math.min(totalLength, len + 2));
    const rect = svgEl.getBoundingClientRect();
    const dx = (pt2.x - pt1.x) / 1000 * rect.width;
    const dy = (pt2.y - pt1.y) / 100 * rect.height;
    return Math.atan2(dy, dx);
  }

  // ── Layout ──

  function layoutElements() {
    inner.style.transition = 'none';
    inner.style.transform = 'none';
    inner.offsetHeight; // force reflow

    yearPoints = [];

    tickEls.forEach(({ el, t, major }) => {
      const pt = getPointRelativeToInner(t);
      const angle = getTangentAngle(t);
      const perpAngle = angle - Math.PI / 2;
      const len = major ? 8 : 5;
      el.style.left = pt.x + 'px';
      el.style.top = pt.y + 'px';
      el.style.width = len + 'px';
      el.style.transform = `translate(-50%, -50%) rotate(${perpAngle + Math.PI}rad)`;
      el.style.transformOrigin = 'center center';
    });

    labelEls.forEach(label => {
      const year = parseInt(label.dataset.year);
      const t = (year - YEAR_START) / YEAR_COUNT;
      const pt = getPointRelativeToInner(t);
      const angle = getTangentAngle(t);
      const degrees = angle * (180 / Math.PI);
      label.style.left = pt.x + 'px';
      label.style.top = (pt.y + 10) + 'px';
      label.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
      yearPoints.push({ x: pt.x, y: pt.y, angle });
    });

    requestAnimationFrame(() => {
      inner.style.transition = '';
    });
  }

  function positionDot() {
    indicatorEl.style.left = (container.offsetWidth / 2) + 'px';
    indicatorEl.style.top = (container.offsetHeight * 0.4) + 'px';
  }

  function scrollToIndex(index) {
    if (yearPoints.length === 0) return;
    const cx = container.offsetWidth / 2;
    const cy = container.offsetHeight * 0.4;
    const pt = yearPoints[index];
    const angleDeg = pt.angle * (180 / Math.PI);
    inner.style.transform =
      `translate(${cx}px, ${cy}px) rotate(${-angleDeg}deg) translate(${-pt.x}px, ${-pt.y}px)`;
  }

  // ── Interactions ──

  function initInteractions() {
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY > 0 || e.deltaX > 0) {
        State.goTo(Math.min(State.getIndex() + 1, YEAR_COUNT));
      } else {
        State.goTo(Math.max(State.getIndex() - 1, 0));
      }
    }, { passive: false });
  }

  function handleStart(e) {
    isDragging = true;
    handleMove(e);
  }

  function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relX = (clientX - rect.left) / rect.width;
    const currentIdx = State.getIndex();
    const offset = (relX - 0.5) * 6;
    const index = Math.round(Math.max(0, Math.min(YEAR_COUNT, currentIdx + offset)));
    if (index !== currentIdx) State.goTo(index);
  }

  function handleEnd() {
    isDragging = false;
  }

  // ── State subscriber ──

  function update(index) {
    scrollToIndex(index);

    labelEls.forEach(label => {
      const yearIndex = parseInt(label.dataset.year) - YEAR_START;
      label.classList.toggle('timeline__label-el--active', yearIndex === index);
    });
  }

  return { init };
})();
