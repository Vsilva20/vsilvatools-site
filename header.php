<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="index.php">
      <img src="assets/img/logo.png" alt="Vsilva Tools" height="60" width="auto" style="object-fit: contain;">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Alternar navegação">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto" id="nav-links">
        <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="produtos.php">Produtos</a></li>
        <li class="nav-item"><a class="nav-link" href="contato.php">Contato</a></li>
        <li class="nav-item ms-lg-2">
          <a class="nav-link quote-cart-link d-inline-flex align-items-center gap-2" href="carrinho.php" aria-label="Abrir meu orçamento: 0 itens">
            <i class="bi bi-cart3" aria-hidden="true"></i>
            <span class="quote-cart-label">Meu Orçamento</span>
            <span class="badge rounded-pill quote-cart-badge" data-quote-cart-badge aria-hidden="true">0</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<script>
  // Aplica classe 'active' ao link atual
  document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll("#nav-links .nav-link");
    const currentPath = window.location.pathname.split("/").pop();
    
    links.forEach(link => {
      const linkPath = link.getAttribute("href");
      if (currentPath === linkPath || (currentPath === '' && linkPath === 'index.php')) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  });
</script>
