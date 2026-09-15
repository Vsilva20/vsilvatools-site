<!-- Google Fonts: Inter -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

<!-- Tema aplicado antes do CSS para evitar piscar a cor errada ao carregar -->
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#1a1a1a" id="theme-color-meta">
<script>
  (function () {
    var storageKey = 'vsilvaToolsTheme';
    var lightTheme = 'light';
    var darkTheme = 'dark';
    var theme = darkTheme;

    try {
      var savedTheme = localStorage.getItem(storageKey);
      if (savedTheme === lightTheme || savedTheme === darkTheme) {
        theme = savedTheme;
      }
    } catch (error) {
      // Mantém o tema escuro quando o armazenamento do navegador não está disponível.
    }

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    function updateThemeControls(activeTheme) {
      var isLight = activeTheme === lightTheme;
      var actionLabel = isLight ? 'Ativar modo escuro' : 'Ativar modo claro';

      document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
        button.setAttribute('aria-label', actionLabel);
        button.setAttribute('aria-pressed', String(isLight));
        button.setAttribute('title', actionLabel);

        var icon = button.querySelector('[data-theme-icon]');
        if (icon) {
          icon.className = 'bi ' + (isLight ? 'bi-moon-stars-fill' : 'bi-sun-fill');
        }
      });
    }

    function applyTheme(nextTheme, persist) {
      var normalizedTheme = nextTheme === lightTheme ? lightTheme : darkTheme;
      document.documentElement.setAttribute('data-theme', normalizedTheme);
      document.documentElement.style.colorScheme = normalizedTheme;

      var themeColorMeta = document.getElementById('theme-color-meta');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', normalizedTheme === lightTheme ? '#ffffff' : '#1a1a1a');
      }

      if (persist) {
        try {
          localStorage.setItem(storageKey, normalizedTheme);
        } catch (error) {
          // A alternância continua funcionando quando o armazenamento está indisponível.
        }
      }

      updateThemeControls(normalizedTheme);
    }

    document.addEventListener('DOMContentLoaded', function () {
      applyTheme(document.documentElement.getAttribute('data-theme'), false);

      document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
          var currentTheme = document.documentElement.getAttribute('data-theme');
          applyTheme(currentTheme === darkTheme ? lightTheme : darkTheme, true);
        });
      });
    }, { once: true });
  }());
</script>

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- Vsilva Global CSS -->
<?php $vsilvaCssVersion = @filemtime(__DIR__ . '/assets/css/vsilva.css') ?: '1'; ?>
<link rel="stylesheet" href="assets/css/vsilva.css?v=<?= rawurlencode((string) $vsilvaCssVersion) ?>">

<!-- Carrinho de orçamento compartilhado -->
<?php $vsilvaCartVersion = @filemtime(__DIR__ . '/assets/js/cart.js') ?: '1'; ?>
<script src="assets/js/cart.js?v=<?= rawurlencode((string) $vsilvaCartVersion) ?>" defer></script>
