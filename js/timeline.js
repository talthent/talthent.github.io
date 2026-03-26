const Timeline = (() => {
  let svgEl;
  let arcPath;
  let container;
  let indicatorEl, ring1El, ring2El, ring3El;
  let labelEls = [];
  let tickEls = [];
  let onScrub = null;
  let isDragging = false;
  let totalLength = 0;
  const YEAR_START = 2014;
  const YEAR_END = 2026;
  const YEAR_COUNT = YEAR_END - YEAR_START;

  function init(containerEl, onChange) {
    container = containerEl;
    onScrub = onChange;

    // SVG only for the arc path (stretched)
    svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('viewBox', '0 0 1000 100');
    svgEl.setAttribute('preserveAspectRatio', 'none');
    svgEl.classList.add('timeline__svg');

    const arcD = 'M 30,85 Q 500,10 970,85';

    arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arcPath.setAttribute('d', arcD);
    arcPath.setAttribute('class', 'timeline__arc');
    svgEl.appendChild(arcPath);

    container.appendChild(svgEl);

    totalLength = arcPath.getTotalLength();

    // Create HTML tick marks and labels
    for (let year = YEAR_START; year <= YEAR_END; year++) {
      // Major tick
      const tick = document.createElement('div');
      tick.className = 'timeline__tick-el timeline__tick-el--major';
      container.appendChild(tick);
      tickEls.push({ el: tick, t: (year - YEAR_START) / YEAR_COUNT, major: true });

      // Label
      const label = document.createElement('div');
      label.className = 'timeline__label-el';
      label.textContent = year;
      label.dataset.year = year;
      label.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onScrub) onScrub(year - YEAR_START);
      });
      container.appendChild(label);
      labelEls.push(label);

      // Minor ticks
      if (year < YEAR_END) {
        for (let m = 1; m < 4; m++) {
          const mt = ((year - YEAR_START) + m / 4) / YEAR_COUNT;
          const minorTick = document.createElement('div');
          minorTick.className = 'timeline__tick-el';
          container.appendChild(minorTick);
          tickEls.push({ el: minorTick, t: mt, major: false });
        }
      }
    }

    // Indicator rings + dot (HTML)
    ring3El = document.createElement('div');
    ring3El.className = 'timeline__ring timeline__ring--3';
    container.appendChild(ring3El);

    ring2El = document.createElement('div');
    ring2El.className = 'timeline__ring timeline__ring--2';
    container.appendChild(ring2El);

    ring1El = document.createElement('div');
    ring1El.className = 'timeline__ring timeline__ring--1';
    container.appendChild(ring1El);

    indicatorEl = document.createElement('div');
    indicatorEl.className = 'timeline__dot';
    container.appendChild(indicatorEl);

    // Position everything
    positionElements();
    window.addEventListener('resize', positionElements);

    // Interaction events
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const currentIdx = Carousel.getCurrentIndex();
      if (e.deltaY > 0 || e.deltaX > 0) {
        if (onScrub) onScrub(Math.min(currentIdx + 1, YEAR_COUNT));
      } else {
        if (onScrub) onScrub(Math.max(currentIdx - 1, 0));
      }
    }, { passive: false });
  }

  function getScreenPoint(t) {
    const svgPt = arcPath.getPointAtLength(t * totalLength);
    const rect = svgEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left + (svgPt.x / 1000) * rect.width,
      y: rect.top - containerRect.top + (svgPt.y / 100) * rect.height
    };
  }

  function getTangentAngle(t) {
    const len = t * totalLength;
    const pt1 = arcPath.getPointAtLength(Math.max(0, len - 2));
    const pt2 = arcPath.getPointAtLength(Math.min(totalLength, len + 2));
    const rect = svgEl.getBoundingClientRect();
    // Scale to screen coords
    const dx = (pt2.x - pt1.x) / 1000 * rect.width;
    const dy = (pt2.y - pt1.y) / 100 * rect.height;
    return Math.atan2(dy, dx);
  }

  function positionElements() {
    // Position ticks
    tickEls.forEach(({ el, t, major }) => {
      const pt = getScreenPoint(t);
      const angle = getTangentAngle(t);
      const perpAngle = angle - Math.PI / 2;
      const len = major ? 8 : 5;
      const tickX = pt.x + Math.cos(perpAngle + Math.PI) * len;
      const tickY = pt.y + Math.sin(perpAngle + Math.PI) * len;
      el.style.left = pt.x + 'px';
      el.style.top = pt.y + 'px';
      el.style.width = len + 'px';
      el.style.transform = `translate(0, 0) rotate(${perpAngle + Math.PI}rad)`;
      el.style.transformOrigin = '0 0';
    });

    // Position labels
    labelEls.forEach(label => {
      const year = parseInt(label.dataset.year);
      const t = (year - YEAR_START) / YEAR_COUNT;
      const pt = getScreenPoint(t);
      const angle = getTangentAngle(t);
      const degrees = angle * (180 / Math.PI);
      label.style.left = pt.x + 'px';
      label.style.top = (pt.y + 10) + 'px';
      label.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
    });

    // Position indicator at current index
    positionIndicator(Carousel.getCurrentIndex());
  }

  function positionIndicator(index) {
    const t = index / YEAR_COUNT;
    const pt = getScreenPoint(t);

    [indicatorEl, ring1El, ring2El, ring3El].forEach(el => {
      el.style.left = pt.x + 'px';
      el.style.top = pt.y + 'px';
    });
  }

  function handleStart(e) {
    isDragging = true;
    handleMove(e);
  }

  function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const rect = svgEl.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relX = (clientX - rect.left) / rect.width;
    const clampedX = Math.max(0, Math.min(1, relX));

    const index = Math.round(clampedX * YEAR_COUNT);
    if (onScrub) onScrub(index);
  }

  function handleEnd() {
    isDragging = false;
  }

  function update(index) {
    positionIndicator(index);

    // Update label styles
    labelEls.forEach(label => {
      const labelYear = parseInt(label.dataset.year);
      const yearIndex = labelYear - YEAR_START;
      if (yearIndex === index) {
        label.classList.add('timeline__label-el--active');
      } else {
        label.classList.remove('timeline__label-el--active');
      }
    });
  }

  return { init, update };
})();
