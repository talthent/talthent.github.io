function createDeviceFrame(yearData) {
  const { year, device, apps, wallpaper } = yearData;
  const era = device.era;

  const wrapper = document.createElement('div');
  wrapper.className = `device device--${era}${device.material ? ` device--${device.material}` : ''}`;
  wrapper.dataset.year = year;

  // Frame
  const frame = document.createElement('div');
  frame.className = 'device__frame';

  // Notch (for notch & flat eras)
  if (era === 'notch' || era === 'flat') {
    const notch = document.createElement('div');
    notch.className = 'device__notch';
    frame.appendChild(notch);
  }

  // Dynamic Island (for island era)
  if (era === 'island') {
    const island = document.createElement('div');
    island.className = 'device__island';
    frame.appendChild(island);
  }

  // Home button (for classic era)
  if (era === 'classic') {
    const homeBtn = document.createElement('div');
    homeBtn.className = 'device__home-btn';
    frame.appendChild(homeBtn);
  }

  // Screen
  const screen = document.createElement('div');
  screen.className = 'device__screen';

  // Wallpaper background
  const wp = document.createElement('div');
  wp.className = 'device__wallpaper';
  const gradient = WALLPAPER_GRADIENTS[device.ios] || WALLPAPER_GRADIENTS[26];
  wp.style.backgroundImage = gradient;
  // Try loading actual wallpaper image
  if (wallpaper) {
    const img = new Image();
    img.onload = () => {
      wp.style.backgroundImage = `url(${wallpaper})`;
    };
    img.src = wallpaper;
  }
  screen.appendChild(wp);

  // Status bar
  const statusbar = document.createElement('div');
  statusbar.className = 'device__statusbar';
  statusbar.innerHTML = `
    <span class="device__statusbar-left">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><g transform="translate(12,12) rotate(90) translate(-12,-12)"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></g></svg>
    </span>
    <span class="device__statusbar-right">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
      <svg width="14" height="10" viewBox="0 0 28 14" fill="white"><rect x="0" y="1" width="23" height="12" rx="2" ry="2" fill="none" stroke="white" stroke-width="1.5"/><rect x="2" y="3" width="19" height="8" rx="1" ry="1"/><rect x="24.5" y="4.5" width="2.5" height="5" rx="1" ry="1"/></svg>
    </span>
  `;
  screen.appendChild(statusbar);

  // Split apps into grid (side projects) and dock (main apps)
  const dockApps = apps.filter(a => a.dock);
  const gridApps = apps.filter(a => !a.dock);

  // App icons grid (side projects)
  const iconsGrid = document.createElement('div');
  iconsGrid.className = 'device__icons';
  gridApps.forEach(app => {
    const appEl = document.createElement('div');
    appEl.className = 'device__app';

    const icon = document.createElement('img');
    icon.className = 'device__app-icon';
    icon.src = app.icon;
    icon.alt = app.name;
    icon.loading = 'lazy';
    icon.width = 40;
    icon.height = 40;
    appEl.appendChild(icon);

    const label = document.createElement('span');
    label.className = 'device__app-label';
    label.textContent = app.name;
    appEl.appendChild(label);

    iconsGrid.appendChild(appEl);
  });
  screen.appendChild(iconsGrid);

  // Home indicator (for non-classic)
  if (era !== 'classic') {
    const indicator = document.createElement('div');
    indicator.className = 'device__home-indicator';
    screen.appendChild(indicator);
  }

  frame.appendChild(screen);

  // Dock (main company apps) — on the frame, above screen but below bezel
  const dock = document.createElement('div');
  dock.className = 'device__dock';
  dockApps.forEach(app => {
    const appEl = document.createElement('div');
    appEl.className = 'device__app';

    const icon = document.createElement('img');
    icon.className = 'device__app-icon';
    icon.src = app.icon;
    icon.alt = app.name;
    icon.loading = 'lazy';
    icon.width = 40;
    icon.height = 40;
    appEl.appendChild(icon);

    const label = document.createElement('span');
    label.className = 'device__app-label';
    label.textContent = app.name;
    appEl.appendChild(label);

    dock.appendChild(appEl);
  });
  frame.appendChild(dock);

  // Side buttons
  const power = document.createElement('div');
  power.className = 'device__side-btn device__side-btn--power';
  frame.appendChild(power);

  const volUp = document.createElement('div');
  volUp.className = 'device__side-btn device__side-btn--vol-up';
  frame.appendChild(volUp);

  const volDown = document.createElement('div');
  volDown.className = 'device__side-btn device__side-btn--vol-down';
  frame.appendChild(volDown);

  const silent = document.createElement('div');
  silent.className = 'device__side-btn device__side-btn--silent';
  frame.appendChild(silent);

  wrapper.appendChild(frame);

  // Model label below the phone
  const modelLabel = document.createElement('div');
  modelLabel.className = 'device__model-label';
  modelLabel.textContent = device.model;
  wrapper.appendChild(modelLabel);

  return wrapper;
}
