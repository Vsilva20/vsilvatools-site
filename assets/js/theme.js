(function () {
  'use strict';

  const STORAGE_KEY = 'vsilvaToolsTheme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';
  const THEME_COLORS = {
    dark: '#1a1a1a',
    light: '#ffffff'
  };

  function getCurrentTheme() {
    return document.documentElement.dataset.theme === LIGHT_THEME
      ? LIGHT_THEME
      : DARK_THEME;
  }

  function updateControls(theme) {
    const isLight = theme === LIGHT_THEME;
    const actionLabel = isLight ? 'Ativar modo escuro' : 'Ativar modo claro';
    const visibleLabel = isLight ? 'Modo escuro' : 'Modo claro';

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-label', actionLabel);
      button.setAttribute('aria-pressed', String(isLight));
      button.setAttribute('title', actionLabel);

      const icon = button.querySelector('[data-theme-icon]');
      if (icon) {
        icon.className = `bi ${isLight ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`;
        icon.setAttribute('data-theme-icon', '');
        icon.setAttribute('aria-hidden', 'true');
      }

      const label = button.querySelector('[data-theme-label]');
      if (label) {
        label.textContent = visibleLabel;
      }
    });
  }

  function applyTheme(theme, persist) {
    const normalizedTheme = theme === LIGHT_THEME ? LIGHT_THEME : DARK_THEME;
    document.documentElement.dataset.theme = normalizedTheme;
    document.documentElement.style.colorScheme = normalizedTheme;

    const themeColorMeta = document.querySelector('#theme-color-meta');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', THEME_COLORS[normalizedTheme]);
    }

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, normalizedTheme);
      } catch (error) {
        // A troca visual continua funcionando mesmo sem armazenamento persistente.
      }
    }

    updateControls(normalizedTheme);
    document.dispatchEvent(new CustomEvent('vsilva:theme-changed', {
      detail: { theme: normalizedTheme }
    }));
  }

  function initializeTheme() {
    applyTheme(getCurrentTheme(), false);

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextTheme = getCurrentTheme() === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyTheme(nextTheme, true);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme, { once: true });
  } else {
    initializeTheme();
  }
}());
