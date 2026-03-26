const Timeline = (() => {
  let svgEl;
  let arcPath;
  let arcActivePath;
  let indicator;
  let container;
  let labels = [];
  let onScrub = null;
  let isDragging = false;
  let totalLength = 0;
  const YEAR_START = 2014;
  const YEAR_END = 2026;
  const YEAR_COUNT = YEAR_END - YEAR_START;

  function init(containerEl, onChange) {
    container = containerEl;
    onScrub = onChange;

    svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('viewBox', '0 0 1000 100');
    svgEl.setAttribute('preserveAspectRatio', 'none');

    // Arc path — more pronounced upward curve
    const arcD = 'M 30,90 Q 500,5 970,90';

    // Background arc
    arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arcPath.setAttribute('d', arcD);
    arcPath.setAttribute('class', 'timeline__arc');
    svgEl.appendChild(arcPath);

    // Active portion arc (will be clipped via dasharray)
    arcActivePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arcActivePath.setAttribute('d', arcD);
    arcActivePath.setAttribute('class', 'timeline__arc-active');
    svgEl.appendChild(arcActivePath);

    totalLength = arcPath.getTotalLength();

    // Create tick marks and labels
    for (let year = YEAR_START; year <= YEAR_END; year++) {
      const t = (year - YEAR_START) / YEAR_COUNT;
      const pt = arcPath.getPointAtLength(t * totalLength);

      // Get tangent for perpendicular tick
      const pt1 = arcPath.getPointAtLength(Math.max(0, t * totalLength - 2));
      const pt2 = arcPath.getPointAtLength(Math.min(totalLength, t * totalLength + 2));
      const angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
      const perpAngle = angle - Math.PI / 2;

      // Major tick
      const tickLen = 8;
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', pt.x + Math.cos(perpAngle) * -2);
      tick.setAttribute('y1', pt.y + Math.sin(perpAngle) * -2);
      tick.setAttribute('x2', pt.x + Math.cos(perpAngle) * tickLen);
      tick.setAttribute('y2', pt.y + Math.sin(perpAngle) * tickLen);
      tick.setAttribute('class', 'timeline__tick--major');
      svgEl.appendChild(tick);

      // Year label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', pt.x);
      label.setAttribute('y', pt.y + tickLen + 14);
      label.setAttribute('class', 'timeline__label');
      label.textContent = year;
      label.dataset.year = year;
      label.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onScrub) onScrub(year - YEAR_START);
      });
      svgEl.appendChild(label);
      labels.push(label);

      // Minor ticks (months) between this year and next
      if (year < YEAR_END) {
        for (let m = 1; m < 4; m++) {
          const mt = ((year - YEAR_START) + m / 4) / YEAR_COUNT;
          const mpt = arcPath.getPointAtLength(mt * totalLength);
          const mpt1 = arcPath.getPointAtLength(Math.max(0, mt * totalLength - 2));
          const mpt2 = arcPath.getPointAtLength(Math.min(totalLength, mt * totalLength + 2));
          const mAngle = Math.atan2(mpt2.y - mpt1.y, mpt2.x - mpt1.x) - Math.PI / 2;

          const minorTick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          minorTick.setAttribute('x1', mpt.x);
          minorTick.setAttribute('y1', mpt.y);
          minorTick.setAttribute('x2', mpt.x + Math.cos(mAngle) * 4);
          minorTick.setAttribute('y2', mpt.y + Math.sin(mAngle) * 4);
          minorTick.setAttribute('class', 'timeline__tick');
          svgEl.appendChild(minorTick);
        }
      }
    }

    // Indicator dot
    indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    indicator.setAttribute('class', 'timeline__indicator');
    indicator.setAttribute('r', '6');
    svgEl.appendChild(indicator);

    container.appendChild(svgEl);

    // Interaction events
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    // Mouse wheel
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

    // Map x position to year index
    const index = Math.round(clampedX * YEAR_COUNT);
    if (onScrub) onScrub(index);
  }

  function handleEnd() {
    isDragging = false;
  }

  function update(index) {
    const t = index / YEAR_COUNT;
    const pt = arcPath.getPointAtLength(t * totalLength);

    // Move indicator
    indicator.setAttribute('cx', pt.x);
    indicator.setAttribute('cy', pt.y);

    // Update active arc portion
    const activeLen = t * totalLength;
    arcActivePath.setAttribute('stroke-dasharray', `${activeLen} ${totalLength}`);

    // Update label styles
    labels.forEach(label => {
      const labelYear = parseInt(label.dataset.year);
      const yearIndex = labelYear - YEAR_START;
      if (yearIndex === index) {
        label.setAttribute('class', 'timeline__label timeline__label--active');
      } else {
        label.setAttribute('class', 'timeline__label');
      }
    });
  }

  return { init, update };
})();
