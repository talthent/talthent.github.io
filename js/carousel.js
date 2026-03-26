const Carousel = (() => {
  let track;
  let items = [];
  let currentIndex = CAREER_DATA.length - 1; // Start at 2026
  let targetIndex = currentIndex;
  let animating = false;
  let scrubbing = false;
  let onYearChange = null;

  const POSITIONS = {
    '-2': { x: -480, z: -280, ry: 42, scale: 0.55, opacity: 0.35 },
    '-1': { x: -240, z: -100, ry: 25, scale: 0.78, opacity: 0.85 },
    '0':  { x: 0,    z: 0,    ry: 0,  scale: 1.0,  opacity: 1.0  },
    '1':  { x: 240,  z: -100, ry: -25, scale: 0.78, opacity: 0.85 },
    '2':  { x: 480,  z: -280, ry: -42, scale: 0.55, opacity: 0.35 }
  };

  function init(container, onChange) {
    onYearChange = onChange;

    track = document.createElement('div');
    track.className = 'carousel__track';
    container.appendChild(track);

    // Create all device items
    CAREER_DATA.forEach((data, index) => {
      const item = document.createElement('div');
      item.className = 'carousel__item';
      item.dataset.index = index;

      const device = createDeviceFrame(data);
      item.appendChild(device);

      item.addEventListener('click', () => {
        if (parseInt(item.dataset.pos) === 0) {
          // Center phone clicked — toggle details
          if (onYearChange) onYearChange(currentIndex, true);
        } else {
          goTo(index);
        }
      });

      track.appendChild(item);
      items.push(item);
    });

    updatePositions(false);
  }

  function updatePositions(animate = true) {
    items.forEach((item, index) => {
      const relPos = index - currentIndex;
      item.dataset.pos = relPos;

      if (scrubbing) {
        item.classList.add('scrubbing');
      } else {
        item.classList.remove('scrubbing');
      }

      if (Math.abs(relPos) > 2) {
        item.classList.add('hidden');
        item.style.transform = `translateX(${relPos > 0 ? 600 : -600}px) translateZ(-400px) scale(0.3)`;
        item.style.opacity = '0';
        return;
      }

      item.classList.remove('hidden');
      const pos = POSITIONS[relPos.toString()];
      if (pos) {
        item.style.transform = `translateX(${pos.x}px) translateZ(${pos.z}px) rotateY(${pos.ry}deg) scale(${pos.scale})`;
        item.style.opacity = pos.opacity.toString();
      }
    });
  }

  function goTo(index, fromScrub = false) {
    if (index < 0 || index >= CAREER_DATA.length) return;
    if (index === currentIndex && !fromScrub) return;

    currentIndex = index;
    scrubbing = fromScrub;
    updatePositions(!fromScrub);

    if (onYearChange) {
      onYearChange(currentIndex, false);
    }
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function getCurrentIndex() {
    return currentIndex;
  }

  function getCurrentYear() {
    return CAREER_DATA[currentIndex].year;
  }

  return { init, goTo, prev, next, getCurrentIndex, getCurrentYear, updatePositions };
})();
