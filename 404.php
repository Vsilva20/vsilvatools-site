<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página Não Encontrada - Vsilva Tools</title>
  
  <!-- SEO -->
  <meta name="robots" content="noindex, nofollow">
  
  <!-- CSS Globais -->
  <?php include 'head_includes.php'; ?>
</head>
<body class="d-flex flex-column min-vh-100 bg-dark text-white text-center">

  <!-- Navbar -->
  <?php include 'header.php'; ?>

  <div class="container d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5">
    
    <div class="mb-4">
      <i class="bi bi-exclamation-triangle" style="font-size: 5rem; color: var(--cor-verde);"></i>
    </div>
    
    <h1 class="display-1 fw-bold mb-3" style="color: var(--cor-verde);">404</h1>
    <h2 class="fw-bold mb-4">Página Não Encontrada</h2>
    
    <p class="fs-5 text-muted mb-5 max-w-md mx-auto" style="max-width: 600px;">
      Desculpe, a página que você está procurando não existe, foi removida ou o endereço foi digitado incorretamente.
    </p>
    
    <div class="d-flex gap-3 flex-wrap justify-content-center">
      <a href="index.php" class="btn btn-success btn-lg px-4 rounded-pill">
        <i class="bi bi-house-door me-2"></i> Ir para a Home
      </a>
      <a href="produtos.php" class="btn btn-outline-success btn-lg px-4 rounded-pill">
        <i class="bi bi-tools me-2"></i> Ver Produtos
      </a>
    </div>
    
  </div>

  <?php include 'footer.php'; ?>
</body>
</html>
