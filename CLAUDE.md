# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Interactive CV/portfolio for Tal Cohen — a single morphing iPhone device that transforms across career years (2014–2026), with a career timeline and CV panel. Deployed as a static GitHub Pages site at talthent.github.io.

## Development

No build step, no dependencies, no package manager. Open `index.html` directly in a browser or use any static server. Push to `main` to deploy.

## Architecture

**State-driven vanilla JS with IIFE modules.** All UI modules subscribe to a central `State` event bus — they never call each other directly.

Script load order matters (no bundler):
```
data.js → state.js → devices.js → timeline.js → cv.js → theme.js → about.js → input.js → app.js
```

- **`data.js`** — `CAREER_DATA` (13 year entries), `ABOUT_DATA`, `WALLPAPER_GRADIENTS`. Source of truth for all content.
- **`state.js`** — Central event bus. Holds `currentIndex`, derives year range from data. Modules call `State.subscribe(fn)` to react to changes. Navigation goes through `State.goTo/prev/next`.
- **`devices.js`** — Single morphing device. One DOM with all era elements (home button, notch, island) present simultaneously, toggled via opacity. Frame/screen dimensions driven by CSS custom properties (`--frame-w`, `--screen-top`, etc.) with CSS transitions. App icons diffed in/out with enter/leave animations using absolute positioning.
- **`timeline.js`** — SVG quadratic Bezier arc. Year labels and ticks positioned along the curve. The indicator dot is fixed at center; the inner container transforms to bring the active year to it.
- **`cv.js`** — Career narrative panel on the right. Groups jobs by company with inline role highlights. Active company at full opacity, others dimmed.
- **`app.js`** — Boot orchestration only (~45 lines). Inits all modules, wires wallpaper toggle, triggers entrance animation.

## CSS

Four files: `main.css` (layout, themes, CV panel), `devices.css` (device morphing via CSS vars), `carousel.css` (centered container), `timeline.css` (arc styling).

Theming uses CSS custom properties on `[data-theme="light|dark"]`. Primary color is warm charcoal (`--primary: #2d2926` light / `#c8c3be` dark).

Device dimensions are driven entirely by CSS custom properties set from `ERA_SPECS` in `devices.js` — do not add per-era sizing rules in CSS.

## Design Principles

Jony Ive-inspired: monochrome palette, system fonts (SF Pro via `-apple-system` / Plus Jakarta Sans fallback), generous whitespace, spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`), invisible UI. The device content provides all the color.

## Key Patterns

- **Module pattern**: `const Name = (() => { ... return { init }; })()` — every module exports `{ init }` at minimum.
- **No circular deps**: Timeline and Device never reference each other. Both subscribe to State.
- **App icon diffing**: Icons keyed by `app.name`. Leaving apps get `device__app--leaving` class (shrink+fade), entering apps get `device__app--entering` (scale up). Positions calculated from spec values, not DOM measurements (avoids mid-transition reads).
- **Wallpaper crossfade**: Two layers. New wallpaper placed on back at opacity 1, front fades out. Never animate both opacities (alpha compositing causes black flash).
