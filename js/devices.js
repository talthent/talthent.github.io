/**
 * Device — single morphing device that transforms between years.
 *
 * One DOM with all era elements (home button, notch, island) present.
 * Year changes update CSS custom properties → smooth CSS transitions.
 * Apps diff in/out with enter/leave animations. Wallpaper cross-fades.
 */
const Device = (() => {
  // ── Per-era specs (drives CSS custom properties) ──
  const ERA_SPECS = {
    classic: { frameW: 210, frameH: 420, frameR: 42, screenTop: 70, screenSide: 12, screenBottom: 70, screenR: 3,  notchW: 0,  notchH: 0,  islandW: 0,  islandH: 0  },
    notch:   { frameW: 224, frameH: 460, frameR: 38, screenTop: 8,  screenSide: 8,  screenBottom: 8,  screenR: 30, notchW: 38, notchH: 16, islandW: 0,  islandH: 0  },
    flat:    { frameW: 224, frameH: 460, frameR: 36, screenTop: 5,  screenSide: 5,  screenBottom: 5,  screenR: 31, notchW: 30, notchH: 14, islandW: 0,  islandH: 0  },
    island:  { frameW: 224, frameH: 460, frameR: 36, screenTop: 5,  screenSide: 5,  screenBottom: 5,  screenR: 31, notchW: 0,  notchH: 0,  islandW: 26, islandH: 16 },
  };

  const DOCK_HEIGHT = 80;
  const PLAIN_GRADIENT = 'linear-gradient(145deg, #2d2926, #3d3835, #4a4440)';

  // ── DOM references ──
  let deviceEl, frameEl, screenEl, captionEl;
  let homeBtnEl, notchEl, islandEl, homeIndicatorEl;
  let wpFrontEl, wpBackEl;
  let dockEl, iconsGridEl;

  // ── State ──
  let wpIsFrontA = true;
  let wallpapersOn = true;
  let firstWallpaper = true;
  const currentDockApps = new Map();
  const currentGridApps = new Map();

  // ── Init ──

  function init(container) {
    preloadIcons();
    buildDOM(container);
    State.subscribe(() => update());
    update();
  }

  function preloadIcons() {
    const seen = new Set();
    CAREER_DATA.forEach(d => {
      d.apps.forEach(app => {
        if (!seen.has(app.icon)) {
          seen.add(app.icon);
          new Image().src = app.icon;
        }
      });
    });
  }

  // ── DOM construction ──

  function buildDOM(container) {
    deviceEl = document.createElement('div');
    deviceEl.className = 'device';

    frameEl = document.createElement('div');
    frameEl.className = 'device__frame';

    // Era elements (all present, toggled via opacity)
    homeBtnEl = createChild(frameEl, 'div', 'device__home-btn');
    notchEl = createChild(frameEl, 'div', 'device__notch');
    islandEl = createChild(frameEl, 'div', 'device__island');

    // Screen
    screenEl = createChild(frameEl, 'div', 'device__screen');

    // Wallpaper layers (two for cross-fade)
    wpFrontEl = createChild(screenEl, 'div', 'device__wallpaper');
    wpBackEl = createChild(screenEl, 'div', 'device__wallpaper');
    wpBackEl.style.opacity = '0';

    // Status bar
    const statusbar = createChild(screenEl, 'div', 'device__statusbar');
    statusbar.innerHTML = `
      <span class="device__statusbar-left">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><g transform="translate(12,12) rotate(90) translate(-12,-12)"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></g></svg>
      </span>
      <span class="device__statusbar-right">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
        <svg width="14" height="10" viewBox="0 0 28 14" fill="white"><rect x="0" y="1" width="23" height="12" rx="2" ry="2" fill="none" stroke="white" stroke-width="1.5"/><rect x="2" y="3" width="19" height="8" rx="1" ry="1"/><rect x="24.5" y="4.5" width="2.5" height="5" rx="1" ry="1"/></svg>
      </span>
    `;

    iconsGridEl = createChild(screenEl, 'div', 'device__icons');
    dockEl = createChild(screenEl, 'div', 'device__dock');
    homeIndicatorEl = createChild(screenEl, 'div', 'device__home-indicator');

    frameEl.appendChild(screenEl);

    // Side buttons
    ['power', 'vol-up', 'vol-down', 'silent'].forEach(btn =>
      createChild(frameEl, 'div', `device__side-btn device__side-btn--${btn}`)
    );

    deviceEl.appendChild(frameEl);

    captionEl = createChild(deviceEl, 'div', 'device__caption');

    deviceEl.addEventListener('click', () => State.toggleDetails());
    container.appendChild(deviceEl);
  }

  function createChild(parent, tag, className) {
    const el = document.createElement(tag);
    el.className = className;
    parent.appendChild(el);
    return el;
  }

  // ── Update (called on every State change) ──

  function update() {
    const data = State.getData();
    const spec = ERA_SPECS[data.device.era];
    const era = data.device.era;

    // CSS custom properties → triggers CSS transitions
    setVars(spec);

    // Era class (material gradients, side buttons)
    deviceEl.className = `device device--${era}${data.device.material ? ` device--${data.device.material}` : ''}`;

    // Era element visibility (opacity crossfade)
    homeBtnEl.style.opacity = era === 'classic' ? '1' : '0';
    notchEl.style.opacity = (era === 'notch' || era === 'flat') ? '1' : '0';
    islandEl.style.opacity = era === 'island' ? '1' : '0';
    homeIndicatorEl.style.opacity = era !== 'classic' ? '1' : '0';

    // Caption
    captionEl.textContent = `${data.device.model} \u00b7 iOS ${data.device.ios}`;

    // Wallpaper
    crossfadeWallpaper(data);

    // Apps
    diffApps(dockEl, currentDockApps, data.apps.filter(a => a.dock), calcDockPositions, spec);
    diffApps(iconsGridEl, currentGridApps, data.apps.filter(a => !a.dock), calcGridPositions, spec);
  }

  function setVars(spec) {
    const s = deviceEl.style;
    s.setProperty('--frame-w', spec.frameW + 'px');
    s.setProperty('--frame-h', spec.frameH + 'px');
    s.setProperty('--frame-r', spec.frameR + 'px');
    s.setProperty('--screen-top', spec.screenTop + 'px');
    s.setProperty('--screen-side', spec.screenSide + 'px');
    s.setProperty('--screen-bottom', spec.screenBottom + 'px');
    s.setProperty('--screen-r', spec.screenR + 'px');
    s.setProperty('--notch-w', spec.notchW + '%');
    s.setProperty('--notch-h', spec.notchH + 'px');
    s.setProperty('--island-w', spec.islandW + '%');
    s.setProperty('--island-h', spec.islandH + 'px');
  }

  // ── Wallpaper ──

  function crossfadeWallpaper(data) {
    const bgImage = wallpapersOn
      ? (WALLPAPER_GRADIENTS[data.device.ios] || WALLPAPER_GRADIENTS[26])
      : PLAIN_GRADIENT;

    // First call: set directly, no crossfade
    if (firstWallpaper) {
      firstWallpaper = false;
      wpFrontEl.style.backgroundImage = bgImage;
      wpFrontEl.style.opacity = '1';
      if (wallpapersOn && data.wallpaper) {
        const img = new Image();
        img.onload = () => { wpFrontEl.style.backgroundImage = `url(${data.wallpaper})`; };
        img.src = data.wallpaper;
      }
      return;
    }

    // Subsequent: place new on back at full opacity, fade out front
    const back = wpIsFrontA ? wpBackEl : wpFrontEl;
    const front = wpIsFrontA ? wpFrontEl : wpBackEl;

    back.style.transition = 'none';
    back.style.opacity = '1';
    back.style.backgroundImage = bgImage;
    back.style.zIndex = '0';
    front.style.zIndex = '1';

    if (wallpapersOn && data.wallpaper) {
      const img = new Image();
      img.onload = () => { back.style.backgroundImage = `url(${data.wallpaper})`; };
      img.src = data.wallpaper;
    }

    requestAnimationFrame(() => {
      front.style.transition = 'opacity 0.5s ease';
      front.style.opacity = '0';
    });

    wpIsFrontA = !wpIsFrontA;
  }

  function setWallpapers(on) {
    wallpapersOn = on;
    update();
  }

  // ── App layout calculators ──

  function calcGridPositions(count, _container, spec) {
    const cols = 4;
    const iconSize = 40;
    const itemH = iconSize + 15;
    const containerW = spec.frameW - 2 * spec.screenSide;
    const padX = 16;
    const padY = 16;
    const gapX = (containerW - padX * 2 - cols * iconSize) / (cols - 1);
    const gapY = 14;

    return Array.from({ length: count }, (_, i) => ({
      left: padX + (i % cols) * (iconSize + gapX),
      top: padY + Math.floor(i / cols) * (itemH + gapY),
    }));
  }

  function calcDockPositions(count, _container, spec) {
    const iconSize = 40;
    const itemH = iconSize + 14;
    const gap = 16;
    const containerW = spec.frameW - 2 * spec.screenSide;
    const totalW = count * iconSize + (count - 1) * gap;
    const startX = (containerW - totalW) / 2;
    const topY = (DOCK_HEIGHT - itemH) / 2 - 4;

    return Array.from({ length: count }, (_, i) => ({
      left: startX + i * (iconSize + gap),
      top: topY,
    }));
  }

  // ── App diffing ──

  function diffApps(container, currentMap, newApps, calcFn, spec) {
    const newKeys = new Set(newApps.map(a => a.name));

    // Leaving
    for (const [name, el] of currentMap) {
      if (!newKeys.has(name)) {
        el.classList.add('device__app--leaving');
        el.addEventListener('transitionend', () => el.remove(), { once: true });
        currentMap.delete(name);
      }
    }

    // Position targets
    const positions = calcFn(newApps.length, container, spec);

    // Entering + reposition staying
    newApps.forEach((app, i) => {
      const pos = positions[i];
      if (!currentMap.has(app.name)) {
        const appEl = createAppEl(app);
        appEl.style.left = pos.left + 'px';
        appEl.style.top = pos.top + 'px';
        appEl.classList.add('device__app--entering');
        container.appendChild(appEl);
        requestAnimationFrame(() => requestAnimationFrame(() =>
          appEl.classList.remove('device__app--entering')
        ));
        currentMap.set(app.name, appEl);
      } else {
        const el = currentMap.get(app.name);
        el.style.left = pos.left + 'px';
        el.style.top = pos.top + 'px';
      }
    });
  }

  function createAppEl(app) {
    const el = document.createElement('div');
    el.className = 'device__app';
    el.dataset.name = app.name;

    const icon = document.createElement('img');
    icon.className = 'device__app-icon';
    icon.src = app.icon;
    icon.alt = app.name;
    icon.width = 40;
    icon.height = 40;
    el.appendChild(icon);

    const label = document.createElement('span');
    label.className = 'device__app-label';
    label.textContent = app.name;
    el.appendChild(label);

    return el;
  }

  return { init, setWallpapers };
})();
