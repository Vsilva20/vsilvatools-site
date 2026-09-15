<!-- Google Fonts: Inter -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

<!-- Tema aplicado antes do CSS para evitar piscar a cor errada ao carregar -->
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#1a1a1a" id="theme-color-meta">
<script>
  (function () {
    var theme = 'dark';

    try {
      var savedTheme = localStorage.getItem('vsilvaToolsTheme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        theme = savedTheme;
      }
    } catch (error) {
      // Mantém o tema escuro quando o armazenamento do navegador não está disponível.
    }

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }());
</script>

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- Vsilva Global CSS -->
<link rel="stylesheet" href="assets/css/vsilva.css">

<!-- Scripts compartilhados -->
<script src="assets/js/theme.js" defer></script>
<script src="assets/js/cart.js" defer></script>
