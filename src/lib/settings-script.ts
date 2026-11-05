import {
  defaultSettings,
  fontChoices,
  textSizes,
  SETTINGS_STORAGE_KEY
} from './types/settings';

/**
 * Runs in <head> before the page is painted, so comfort settings, theme and
 * accent are in place from the first frame. Without it the page would flash
 * with animations and default colours until React loads.
 *
 * Written as plain ES5 because it is not compiled.
 */
export const earlySettingsScript = `(function () {
  try {
    var root = document.documentElement;
    var settings = ${JSON.stringify(defaultSettings)};
    var fonts = ${JSON.stringify(fontChoices)};
    var sizes = ${JSON.stringify(textSizes)};
    var raw = localStorage.getItem(${JSON.stringify(SETTINGS_STORAGE_KEY)});
    if (raw) {
      var saved = JSON.parse(raw);
      if (typeof saved.calmMode === 'boolean') settings.calmMode = saved.calmMode;
      if (fonts.indexOf(saved.font) > -1) settings.font = saved.font;
      if (sizes.indexOf(saved.textSize) > -1) settings.textSize = saved.textSize;
    }
    root.setAttribute('data-calm', String(settings.calmMode));
    root.setAttribute('data-font', settings.font);
    root.setAttribute('data-text-size', settings.textSize);

    var theme = localStorage.getItem('theme');
    if (theme !== 'light' && theme !== 'dim' && theme !== 'dark')
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (theme === 'light') root.classList.remove('dark');
    else root.classList.add('dark');
    root.style.setProperty('--main-background', 'var(--' + theme + '-background)');
    root.style.setProperty('--main-search-background', 'var(--' + theme + '-search-background)');
    root.style.setProperty('--main-sidebar-background', 'var(--' + theme + '-sidebar-background)');

    var accent = localStorage.getItem('accent');
    if (/^(blue|yellow|pink|purple|orange|green)$/.test(accent || ''))
      root.style.setProperty('--main-accent', 'var(--accent-' + accent + ')');
  } catch (error) {
    // storage can be blocked; the server-rendered defaults (calm mode on) stay
  }
})();`;
