/**
 * Carousel — 3D coverflow device display.
 *
 * Subscribes to State for index changes.
 * Creates device frames from CAREER_DATA and positions them in 3D space.
 */
const Carousel = (() => {
  let track;
  let items = [];
  let scrubbing = false;

  const POSITIONS = {
    '-2': { x: -580, z: -320, ry: 35, scale: 0.48, opacity: 0.2 },
    '-1': { x: -300, z: -100, ry: 18, scale: 0.78, opacity: 0.75 },
    '0':  { x: 0,    z: 0,    ry: 0,  scale: 1.0,  opacity: 1.0 },
    '1':  { x: 0,    z: -120, ry: 0,  scale: 0.7,  opacity: 0.0 },
    '2':  { x: 0,    z: -200, ry: 0,  scale: 0.5,  opacity: 0.0 }
  };

  function init(container) {
    track = document.createElement('div');
    track.className = 'carousel__track';
    container.appendChild(track);

    CAREER_DATA.forEach((data, index) => {
      const item = document.createElement('div');
      item.className = 'carousel__item';
      item.dataset.index = index;
      item.appendChild(createDeviceFrame(data));

      item.addEventListener('click', () => {
        if (parseInt(item.dataset.pos) === 0) {
          State.toggleDetails();
        } else {
          State.goTo(index);
        }
      });

      track.appendChild(item);
      items.push(item);
    });

    State.subscribe(() => update());
    update();
  }

  function update() {
    const currentIndex = State.getIndex();

    items.forEach((item, index) => {
      const relPos = index - currentIndex;
      item.dataset.pos = relPos;

      item.classList.toggle('scrubbing', scrubbing);

      if (Math.abs(relPos) > 2) {
        item.classList.add('hidden');
        item.style.transform = `translateX(${relPos > 0 ? 800 : -800}px) translateZ(-500px) scale(0.3)`;
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

    scrubbing = false;
  }

  return { init };
})();
