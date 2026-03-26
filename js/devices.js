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
    <span class="device__statusbar-time">9:41</span>
    <span class="device__statusbar-icons">
      <span>&#9679;&#9679;&#9679;&#9679;</span>
    </span>
  `;
  screen.appendChild(statusbar);

  // App icons grid
  const iconsGrid = document.createElement('div');
  iconsGrid.className = 'device__icons';
  apps.forEach(app => {
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

  // Dock
  const dock = document.createElement('div');
  dock.className = 'device__dock';
  screen.appendChild(dock);

  // Home indicator (for non-classic)
  if (era !== 'classic') {
    const indicator = document.createElement('div');
    indicator.className = 'device__home-indicator';
    screen.appendChild(indicator);
  }

  frame.appendChild(screen);

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
