const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const siteHeader = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const compactHeaderBreakpoint = 1180;

const updateHeaderDepth = () => {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 12);
};

updateHeaderDepth();
window.addEventListener('scroll', updateHeaderDepth, { passive: true });

const closeMenu = ({ returnFocus = false } = {}) => {
  if (!menuToggle || !primaryNav) return;
  primaryNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('.sr-only').textContent = 'Open navigation';
  document.body.classList.remove('menu-open');
  if (returnFocus) menuToggle.focus();
};

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    primaryNav.classList.toggle('is-open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.querySelector('.sr-only').textContent = willOpen ? 'Close navigation' : 'Open navigation';
    document.body.classList.toggle('menu-open', willOpen);
    if (willOpen) primaryNav.querySelector('a')?.focus();
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu({ returnFocus: window.innerWidth <= compactHeaderBreakpoint }));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      closeMenu({ returnFocus: true });
    }
  });

  document.addEventListener('click', (event) => {
    if (
      primaryNav.classList.contains('is-open') &&
      !primaryNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > compactHeaderBreakpoint) closeMenu();
  });
}

const revealItems = document.querySelectorAll('.reveal');
const veerInvestigation = document.getElementById('veerInvestigation');
let veerInvestigationObserver;
let veerMotionPlayed = false;
let revealObserver;
let entranceObserver;

const configureVeerInvestigation = (motionPreference = reducedMotion) => {
  if (!veerInvestigation) return;

  veerInvestigationObserver?.disconnect();
  veerInvestigation.classList.remove('is-motion-ready', 'is-investigating');

  if (motionPreference.matches || veerMotionPlayed) return;

  veerInvestigation.classList.add('is-motion-ready');

  const beginInvestigation = () => {
    veerMotionPlayed = true;
    veerInvestigation.classList.add('is-investigating');
    veerInvestigationObserver?.disconnect();
  };

  if (!('IntersectionObserver' in window)) {
    beginInvestigation();
    return;
  }

  veerInvestigationObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) beginInvestigation();
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.32 });

  veerInvestigationObserver.observe(veerInvestigation);
};

const configureRevealItems = (motionPreference = reducedMotion) => {
  revealObserver?.disconnect();

  if (motionPreference.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealItems.forEach((item) => {
    if (!item.classList.contains('is-visible')) revealObserver.observe(item);
  });
};

const staggerGroups = [
  { selector: '.news-grid .reveal', columns: 3, delay: 80 },
  { selector: '.question-grid .reveal', columns: 3, delay: 80 },
  { selector: '.compromise-grid .reveal', columns: 2, delay: 90 }
];

staggerGroups.forEach(({ selector, columns, delay }) => {
  document.querySelectorAll(selector).forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${(index % columns) * delay}ms`);
  });
});

const motionHeadings = document.querySelectorAll([
  '.signature-orbit-heading > h2',
  '.weekly-copy > h2',
  '.awareness-statement > h2',
  '.questions-heading > h2',
  '.compromises-header > h2',
  '.film-copy > h2',
  '.faq-heading > h2',
  '.start-copy > h2'
].join(','));

motionHeadings.forEach((heading) => heading.classList.add('motion-heading'));

const motionSequences = document.querySelectorAll('[data-motion-sequence]');
motionSequences.forEach((sequence) => {
  [...sequence.children].forEach((item, index) => {
    item.style.setProperty('--sequence-index', index);
    item.style.setProperty('--sequence-delay', `${index * 70}ms`);
  });
});

const motionScenes = document.querySelectorAll('[data-motion-scene]');

const showEntranceItem = (item) => {
  if (item.classList.contains('motion-heading')) item.classList.add('is-heading-visible');
  if (item.matches('[data-motion-sequence], [data-motion-scene]')) item.classList.add('is-inview');
};

const configureEntranceItems = (motionPreference = reducedMotion) => {
  entranceObserver?.disconnect();
  const items = [...motionHeadings, ...motionSequences, ...motionScenes];

  if (motionPreference.matches || !('IntersectionObserver' in window)) {
    items.forEach(showEntranceItem);
    return;
  }

  entranceObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      showEntranceItem(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  items.forEach((item) => {
    const alreadyShown = item.classList.contains('is-heading-visible') || item.classList.contains('is-inview');
    if (!alreadyShown) entranceObserver.observe(item);
  });
};

const heroDepthScene = document.querySelector('[data-hero-depth]');
const heroTheme = document.querySelector('.hero[data-hero-theme]') || document.querySelector('.hero');
const heroThemeOptions = [...document.querySelectorAll('[data-hero-theme]')].filter((option) => option.matches('button'));
const heroThemeNames = new Set(['forest', 'harvest', 'stone', 'olive', 'midnight']);
const heroThemeStorageKey = 'atulyash-hero-theme-preview';
const heroCustomColorStorageKey = 'atulyash-hero-custom-color';
const heroCustomToggle = document.querySelector('[data-hero-custom-toggle]');
const heroCustomPicker = document.querySelector('[data-hero-custom-picker]');
const heroCustomClose = document.querySelector('[data-hero-custom-close]');
const heroCustomReset = document.querySelector('[data-hero-custom-reset]');
const heroCustomSwatch = document.querySelector('[data-hero-custom-swatch]');
const heroCustomSaturation = document.querySelector('[data-hero-saturation]');
const heroCustomPointer = document.querySelector('[data-hero-color-pointer]');
const heroCustomHue = document.querySelector('[data-hero-hue]');
const heroCustomNativeColor = document.querySelector('[data-hero-native-color]');
const heroCustomNativeChip = document.querySelector('[data-hero-native-chip]');
const heroCustomValue = document.querySelector('[data-hero-color-value]');
const heroCustomCssVariables = ['--hero-start', '--hero-mid', '--hero-end', '--hero-glow', '--hero-accent', '--hero-seal'];

const readHeroThemePreference = () => {
  const queryTheme = new URLSearchParams(window.location.search).get('heroPalette');
  if (heroThemeNames.has(queryTheme)) return queryTheme;

  try {
    const storedTheme = window.localStorage.getItem(heroThemeStorageKey);
    if (heroThemeNames.has(storedTheme)) return storedTheme;
    if (storedTheme === 'custom' && /^#[0-9a-f]{6}$/i.test(String(window.localStorage.getItem(heroCustomColorStorageKey) || ''))) return 'custom';
  } catch {
    // Storage can be unavailable in private browsing; the default still works.
  }

  return 'forest';
};

const setHeroTheme = (theme, { persist = true } = {}) => {
  if (!heroTheme || !heroThemeNames.has(theme)) return;
  heroTheme.dataset.heroTheme = theme;
  heroCustomCssVariables.forEach((name) => heroTheme.style.removeProperty(name));
  heroCustomToggle?.classList.remove('is-active');
  heroCustomToggle?.setAttribute('aria-pressed', 'false');

  heroThemeOptions.forEach((option) => {
    const isActive = option.dataset.heroTheme === theme;
    option.classList.toggle('is-active', isActive);
    option.setAttribute('aria-checked', String(isActive));
  });

  if (!persist) return;
  try {
    window.localStorage.setItem(heroThemeStorageKey, theme);
  } catch {
    // Keep the selected theme for this page even when storage is unavailable.
  }
};

if (heroTheme) {
  heroThemeOptions.forEach((option) => {
    option.addEventListener('click', () => setHeroTheme(option.dataset.heroTheme));
  });
}

const clampUnit = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const clampDegrees = (value) => ((Number(value) || 0) % 360 + 360) % 360;

const hsvToRgb = (hue, saturation, value) => {
  const h = clampDegrees(hue) / 60;
  const s = clampUnit(saturation);
  const v = clampUnit(value);
  const chroma = v * s;
  const x = chroma * (1 - Math.abs((h % 2) - 1));
  const match = v - chroma;
  let rgb;
  if (h < 1) rgb = [chroma, x, 0];
  else if (h < 2) rgb = [x, chroma, 0];
  else if (h < 3) rgb = [0, chroma, x];
  else if (h < 4) rgb = [0, x, chroma];
  else if (h < 5) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];
  return rgb.map((channel) => Math.round((channel + match) * 255));
};

const rgbToHex = ([red, green, blue]) => `#${[red, green, blue]
  .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0'))
  .join('')}`.toUpperCase();

const hexToRgb = (value) => {
  const match = String(value || '').trim().match(/^#?([0-9a-f]{6})$/i);
  if (!match) return null;
  return match[1].match(/.{2}/g).map((channel) => parseInt(channel, 16));
};

const rgbToHsv = ([red, green, blue]) => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  return { h: clampDegrees(hue), s: max ? delta / max : 0, v: max };
};

const mixRgb = (base, target, amount) => base.map((channel, index) => channel + (target[index] - channel) * clampUnit(amount));

let heroCustomHsv = { h: 148, s: 0.72, v: 0.19 };

const heroCustomColor = () => rgbToHex(hsvToRgb(heroCustomHsv.h, heroCustomHsv.s, heroCustomHsv.v));

const updateHeroCustomControls = () => {
  if (!heroCustomSaturation) return;
  const color = heroCustomColor();
  heroCustomSaturation.style.setProperty('--hero-picker-hue', `${heroCustomHsv.h}deg`);
  heroCustomPointer.style.left = `${heroCustomHsv.s * 100}%`;
  heroCustomPointer.style.top = `${(1 - heroCustomHsv.v) * 100}%`;
  heroCustomHue.value = String(Math.round(heroCustomHsv.h));
  heroCustomNativeColor.value = color;
  heroCustomNativeChip.style.background = color;
  heroCustomSwatch.style.background = color;
  heroCustomValue.textContent = color;
  heroCustomSaturation.setAttribute('aria-valuetext', color);
};

const applyHeroCustomColor = (color, { persist = true } = {}) => {
  const rgb = hexToRgb(color);
  if (!heroTheme || !rgb) return;
  heroCustomHsv = rgbToHsv(rgb);
  const start = rgbToHex(mixRgb(rgb, [0, 0, 0], .68));
  const mid = rgbToHex(mixRgb(rgb, [0, 0, 0], .38));
  const end = rgbToHex(mixRgb(rgb, [255, 255, 255], .18));
  heroTheme.dataset.heroTheme = 'custom';
  heroTheme.style.setProperty('--hero-start', start);
  heroTheme.style.setProperty('--hero-mid', mid);
  heroTheme.style.setProperty('--hero-end', end);
  heroTheme.style.setProperty('--hero-glow', `rgba(${rgb.join(', ')}, .24)`);
  heroTheme.style.setProperty('--hero-accent', '#f3d99b');
  heroTheme.style.setProperty('--hero-seal', start);
  heroThemeOptions.forEach((option) => {
    option.classList.remove('is-active');
    option.setAttribute('aria-checked', 'false');
  });
  heroCustomToggle?.classList.add('is-active');
  heroCustomToggle?.setAttribute('aria-pressed', 'true');
  updateHeroCustomControls();
  if (!persist) return;
  try {
    window.localStorage.setItem(heroThemeStorageKey, 'custom');
    window.localStorage.setItem(heroCustomColorStorageKey, heroCustomColor());
  } catch {
    // The live preview still works when storage is unavailable.
  }
};

const updateHeroCustomFromPointer = (event) => {
  if (!heroCustomSaturation) return;
  const bounds = heroCustomSaturation.getBoundingClientRect();
  const saturation = clampUnit((event.clientX - bounds.left) / bounds.width);
  const value = 1 - clampUnit((event.clientY - bounds.top) / bounds.height);
  heroCustomHsv = { ...heroCustomHsv, s: saturation, v: value };
  applyHeroCustomColor(heroCustomColor());
};

if (heroCustomSaturation) {
  let dragging = false;
  heroCustomSaturation.addEventListener('pointerdown', (event) => {
    dragging = true;
    heroCustomSaturation.setPointerCapture?.(event.pointerId);
    updateHeroCustomFromPointer(event);
  });
  heroCustomSaturation.addEventListener('pointermove', (event) => {
    if (dragging) updateHeroCustomFromPointer(event);
  });
  heroCustomSaturation.addEventListener('pointerup', () => { dragging = false; });
  heroCustomSaturation.addEventListener('pointercancel', () => { dragging = false; });
  heroCustomSaturation.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? .1 : .03;
    const next = { ...heroCustomHsv };
    if (event.key === 'ArrowLeft') next.s -= step;
    else if (event.key === 'ArrowRight') next.s += step;
    else if (event.key === 'ArrowUp') next.v += step;
    else if (event.key === 'ArrowDown') next.v -= step;
    else return;
    event.preventDefault();
    heroCustomHsv = { ...next, s: clampUnit(next.s), v: clampUnit(next.v) };
    applyHeroCustomColor(heroCustomColor());
  });
}

heroCustomHue?.addEventListener('input', () => {
  heroCustomHsv = { ...heroCustomHsv, h: Number(heroCustomHue.value) };
  applyHeroCustomColor(heroCustomColor());
});

heroCustomNativeColor?.addEventListener('input', () => applyHeroCustomColor(heroCustomNativeColor.value));
heroCustomToggle?.addEventListener('click', () => {
  const opening = heroCustomPicker?.hidden !== false;
  if (!heroCustomPicker) return;
  heroCustomPicker.hidden = !opening;
  heroCustomToggle.setAttribute('aria-expanded', String(opening));
  if (opening) heroCustomSaturation?.focus({ preventScroll: true });
});
heroCustomClose?.addEventListener('click', () => {
  if (!heroCustomPicker) return;
  heroCustomPicker.hidden = true;
  heroCustomToggle?.setAttribute('aria-expanded', 'false');
  heroCustomToggle?.focus({ preventScroll: true });
});
heroCustomReset?.addEventListener('click', () => {
  setHeroTheme('forest');
  try {
    window.localStorage.removeItem(heroCustomColorStorageKey);
  } catch {
    // Keep the default preview when storage is unavailable.
  }
});

const storedHeroCustomColor = (() => {
  try { return window.localStorage.getItem(heroCustomColorStorageKey); } catch { return null; }
})();
const storedHeroTheme = readHeroThemePreference();
if (storedHeroTheme === 'custom' && hexToRgb(storedHeroCustomColor)) applyHeroCustomColor(storedHeroCustomColor, { persist: false });
else setHeroTheme(storedHeroTheme, { persist: false });

let heroDepthFrame = 0;
let heroPointerX = 0;
let heroPointerY = 0;
let heroDepthEnabled = false;

const resetHeroDepth = () => {
  if (!heroDepthScene) return;
  if (heroDepthFrame) cancelAnimationFrame(heroDepthFrame);
  heroDepthFrame = 0;
  heroDepthScene.classList.remove('is-depth-active');
  heroDepthScene.style.setProperty('--hero-rotate-x', '0deg');
  heroDepthScene.style.setProperty('--hero-rotate-y', '0deg');
  heroDepthScene.style.setProperty('--hero-shift-x', '0px');
  heroDepthScene.style.setProperty('--hero-shift-y', '0px');
  heroDepthScene.style.setProperty('--hero-pointer-x', '50%');
  heroDepthScene.style.setProperty('--hero-pointer-y', '50%');
};

const renderHeroDepth = () => {
  heroDepthFrame = 0;
  if (!heroDepthScene || !heroDepthEnabled) return;
  const bounds = heroDepthScene.getBoundingClientRect();
  const normalizedX = Math.max(-1, Math.min(1, ((heroPointerX - bounds.left) / bounds.width - 0.5) * 2));
  const normalizedY = Math.max(-1, Math.min(1, ((heroPointerY - bounds.top) / bounds.height - 0.5) * 2));

  heroDepthScene.classList.add('is-depth-active');
  heroDepthScene.style.setProperty('--hero-rotate-x', `${(-normalizedY * 3.5).toFixed(2)}deg`);
  heroDepthScene.style.setProperty('--hero-rotate-y', `${(normalizedX * 4.5).toFixed(2)}deg`);
  heroDepthScene.style.setProperty('--hero-shift-x', `${(normalizedX * 10).toFixed(1)}px`);
  heroDepthScene.style.setProperty('--hero-shift-y', `${(normalizedY * 7).toFixed(1)}px`);
  heroDepthScene.style.setProperty('--hero-pointer-x', `${((normalizedX + 1) * 50).toFixed(1)}%`);
  heroDepthScene.style.setProperty('--hero-pointer-y', `${((normalizedY + 1) * 50).toFixed(1)}%`);
};

const onHeroPointerMove = (event) => {
  heroPointerX = event.clientX;
  heroPointerY = event.clientY;
  if (!heroDepthFrame) heroDepthFrame = requestAnimationFrame(renderHeroDepth);
};

const onDocumentPointerMove = (event) => {
  if (heroDepthScene?.classList.contains('is-depth-active') && !heroDepthScene.contains(event.target)) {
    resetHeroDepth();
  }
};

const syncHeroDepth = () => {
  if (!heroDepthScene) return;
  const shouldEnable = finePointer.matches && !reducedMotion.matches && window.innerWidth > 900;
  if (shouldEnable === heroDepthEnabled) return;
  heroDepthEnabled = shouldEnable;

  if (heroDepthEnabled) {
    heroDepthScene.addEventListener('pointermove', onHeroPointerMove, { passive: true });
    heroDepthScene.addEventListener('pointerleave', resetHeroDepth);
    document.addEventListener('pointermove', onDocumentPointerMove, { passive: true });
  } else {
    heroDepthScene.removeEventListener('pointermove', onHeroPointerMove);
    heroDepthScene.removeEventListener('pointerleave', resetHeroDepth);
    document.removeEventListener('pointermove', onDocumentPointerMove);
    resetHeroDepth();
  }
};

const atulyashCursor = document.getElementById('atulyashCursor');
const atulyashCursorLabel = atulyashCursor?.querySelector('.atulyash-cursor-label');
let cursorFrame = 0;
let cursorX = -100;
let cursorY = -100;
let cursorEnabled = false;
let cursorTarget;

const renderAtulyashCursor = () => {
  cursorFrame = 0;
  if (!atulyashCursor || !cursorEnabled) return;
  atulyashCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
};

const hideAtulyashCursor = () => {
  atulyashCursor?.classList.remove('is-visible', 'is-pressed');
};

const updateCursorContext = (target) => {
  if (!atulyashCursor || !(target instanceof Element)) return;

  const hiddenZone = target.closest('input, select, textarea, label, video, iframe, [contenteditable="true"], [data-cursor-hide]');
  const interactive = target.closest('a, button, summary, [role="button"]');
  const branded = interactive ? null : target.closest('[data-cursor-label]');

  atulyashCursor.classList.toggle('is-hidden-zone', Boolean(hiddenZone));
  atulyashCursor.classList.toggle('is-interactive', Boolean(interactive));
  atulyashCursor.classList.toggle('is-branded', Boolean(branded));
  if (atulyashCursorLabel) atulyashCursorLabel.textContent = branded?.dataset.cursorLabel || '';
};

const onCursorPointerMove = (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
  atulyashCursor?.classList.add('is-visible');

  if (event.target !== cursorTarget) {
    cursorTarget = event.target;
    updateCursorContext(cursorTarget);
  }

  if (!cursorFrame) cursorFrame = requestAnimationFrame(renderAtulyashCursor);
};

const onCursorPointerDown = () => atulyashCursor?.classList.add('is-pressed');
const onCursorPointerUp = () => atulyashCursor?.classList.remove('is-pressed');

const updateCursorAvailability = () => {
  if (!atulyashCursor) return;
  const shouldEnable = finePointer.matches && !reducedMotion.matches && window.innerWidth > 900;
  if (shouldEnable === cursorEnabled) return;
  cursorEnabled = shouldEnable;

  if (cursorEnabled) {
    document.documentElement.classList.add('cursor-ready');
    document.addEventListener('pointermove', onCursorPointerMove, { passive: true });
    document.addEventListener('pointerdown', onCursorPointerDown, { passive: true });
    document.addEventListener('pointerup', onCursorPointerUp, { passive: true });
  } else {
    document.documentElement.classList.remove('cursor-ready');
    document.removeEventListener('pointermove', onCursorPointerMove);
    document.removeEventListener('pointerdown', onCursorPointerDown);
    document.removeEventListener('pointerup', onCursorPointerUp);
    hideAtulyashCursor();
  }
};

const orbitShowcase = document.getElementById('orbitShowcase');
const orbitToggle = document.getElementById('orbitToggle');

if (orbitShowcase && orbitToggle) {
  const orbitLabel = orbitToggle.querySelector('.orbit-toggle-label');
  const orbitIcon = orbitToggle.querySelector('.orbit-toggle-icon');

  orbitToggle.addEventListener('click', () => {
    const paused = orbitShowcase.classList.toggle('is-paused');
    orbitToggle.setAttribute('aria-pressed', String(paused));
    orbitLabel.textContent = paused ? 'Play orbit' : 'Pause orbit';
    orbitIcon.textContent = paused ? '▶' : 'Ⅱ';
  });

  const updateOrbitPreference = (event) => {
    orbitToggle.hidden = event.matches;
  };

  updateOrbitPreference(reducedMotion);
  reducedMotion.addEventListener?.('change', updateOrbitPreference);
}

const processVideo = document.querySelector('.film-frame video');
document.addEventListener('visibilitychange', () => {
  if (document.hidden && processVideo && !processVideo.paused) processVideo.pause();
  if (orbitShowcase) orbitShowcase.classList.toggle('is-page-hidden', document.hidden);
  if (document.hidden) resetHeroDepth();
});

const initializeMotionSystems = () => {
  document.documentElement.classList.add('motion-ready');
  configureVeerInvestigation();
  configureRevealItems();
  configureEntranceItems();
  syncHeroDepth();
};

const updateMotionPreference = (event) => {
  configureVeerInvestigation(event);
  configureRevealItems(event);
  configureEntranceItems(event);
  syncHeroDepth();
};

try {
  initializeMotionSystems();
} catch (error) {
  document.documentElement.classList.remove('motion-ready');
  revealItems.forEach((item) => item.classList.add('is-visible'));
  [...motionHeadings, ...motionSequences, ...motionScenes].forEach(showEntranceItem);
}

reducedMotion.addEventListener?.('change', updateMotionPreference);
finePointer.addEventListener?.('change', syncHeroDepth);
reducedMotion.addEventListener?.('change', updateCursorAvailability);
finePointer.addEventListener?.('change', updateCursorAvailability);
window.addEventListener('resize', syncHeroDepth, { passive: true });
window.addEventListener('resize', updateCursorAvailability, { passive: true });
window.addEventListener('blur', resetHeroDepth);
window.addEventListener('blur', hideAtulyashCursor);
document.addEventListener('mouseleave', hideAtulyashCursor);
updateCursorAvailability();
