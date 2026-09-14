<?php
include_once 'dados_produtos.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$produto = getProdutoById($id);

if (!$produto) {
    header("Location: 404.php");
    exit;
}

// Produtos Relacionados (mesma categoria, limit 3, excluindo atual)
$todosDaCategoria = getProdutosByCategoria($produto['categoria']);
$produtosRelacionados = [];
foreach ($todosDaCategoria as $p) {
    if ($p['id'] !== $produto['id']) {
        $produtosRelacionados[] = $p;
        if (count($produtosRelacionados) >= 3) break;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Dinâmico -->
  <title><?= htmlspecialchars($produto['nome']) ?> - Vsilva Tools</title>
  <meta name="description" content="<?= htmlspecialchars($produto['descricao_curta']) ?> — Vsilva Tools.">
  <meta property="og:title" content="<?= htmlspecialchars($produto['nome']) ?> - Vsilva Tools">
  <meta property="og:description" content="<?= htmlspecialchars($produto['descricao_curta']) ?>">
  <meta property="og:image" content="https://vsilvatools.com.br/assets/img/produtos/<?= htmlspecialchars($produto['imagens'][0]) ?>">
  
  <!-- CSS Globais -->
  <?php include 'head_includes.php'; ?>
</head>
<body class="d-flex flex-column min-vh-100">

  <!-- Navbar -->
  <?php include 'header.php'; ?>

  <div class="container py-4 flex-grow-1">
    
    <!-- Breadcrumb e Botão Voltar -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a href="index.php">Home</a></li>
          <li class="breadcrumb-item"><a href="produtos.php">Produtos</a></li>
          <li class="breadcrumb-item active text-white" aria-current="page"><?= htmlspecialchars($produto['nome']) ?></li>
        </ol>
      </nav>
      <a href="produtos.php" class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-arrow-left me-1"></i> Voltar para Produtos
      </a>
    </div>

    <!-- Título Principal -->
    <h1 class="fw-bold mb-4 text-white"><?= htmlspecialchars($produto['nome']) ?></h1>
    
    <div class="row g-5">
      
      <!-- Lado Esquerdo: Imagens -->
      <div class="col-md-6">
        <div id="carouselProduto" class="carousel slide shadow-sm" data-bs-ride="carousel">
          <div class="carousel-inner" style="background: var(--cor-superficie); border-radius: 12px; padding: 2rem;">
            <?php foreach ($produto['imagens'] as $index => $img): ?>
              <div class="carousel-item <?= $index === 0 ? 'active' : '' ?>">
                <div class="d-flex justify-content-center bg-white p-3 rounded" style="min-height: 350px;">
                  <img src="assets/img/produtos/<?= htmlspecialchars($img) ?>" class="img-fluid" style="max-height: 350px; object-fit: contain;" alt="<?= htmlspecialchars($produto['nome']) ?>">
                </div>
              </div>
            <?php endforeach; ?>
          </div>
          
          <?php if (count($produto['imagens']) > 1): ?>
          <button class="btn btn-success position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle shadow" data-bs-target="#carouselProduto" data-bs-slide="prev" aria-label="Anterior" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; z-index: 10; border: none; color: #000;">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button class="btn btn-success position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle shadow" data-bs-target="#carouselProduto" data-bs-slide="next" aria-label="Próximo" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; z-index: 10; border: none; color: #000;">
            <i class="bi bi-chevron-right"></i>
          </button>
          <?php endif; ?>
        </div>
      </div>
      
      <!-- Lado Direito: Detalhes -->
      <div class="col-md-6">
        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="badge bg-secondary fs-6"><?= htmlspecialchars($produto['categoria']) ?></span>
          <span class="badge bg-dark border border-secondary fs-6"><?= htmlspecialchars(implode(', ', $produto['marcas'])) ?></span>
        </div>

        <h2 class="fw-bold text-white fs-4 mt-4">Descrição</h2>
        <p class="fs-5 text-muted"><?= htmlspecialchars($produto['descricao_curta']) ?></p>
        <div class="text-muted mb-4" style="line-height: 1.8;">
          <?= $produto['descricao_detalhada'] // permitindo HTML simples caso haja <br> ?>
        </div>

        <h2 class="fw-bold text-white fs-4 mt-5 mb-3">Medidas disponíveis</h2>
        <div class="table-responsive">
          <table class="table table-dark table-striped table-bordered align-middle quote-options-table">
            <thead>
              <tr>
                <th class="py-3 px-4">Código / Medida</th>
                <th class="py-3 px-4 text-end">Adicionar</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($produto['medidas'] as $item): ?>
                <tr>
                  <td class="px-4 py-3 quote-product-code fw-semibold">
                    <?= htmlspecialchars($item['codigo'], ENT_QUOTES, 'UTF-8') ?>
                  </td>
                  <td class="px-4 py-3 text-end quote-product-action">
                    <button
                      type="button"
                      class="btn btn-success btn-add-quote d-inline-flex align-items-center justify-content-center gap-2"
                      data-add-to-quote
                      data-product-id="<?= (int) $produto['id'] ?>"
                      data-product-name="<?= htmlspecialchars($produto['nome'], ENT_QUOTES, 'UTF-8') ?>"
                      data-category="<?= htmlspecialchars($produto['categoria'], ENT_QUOTES, 'UTF-8') ?>"
                      data-brand="<?= htmlspecialchars(implode(', ', $produto['marcas']), ENT_QUOTES, 'UTF-8') ?>"
                      data-code="<?= htmlspecialchars($item['codigo'], ENT_QUOTES, 'UTF-8') ?>"
                      data-image="assets/img/produtos/<?= htmlspecialchars($produto['imagens'][0], ENT_QUOTES, 'UTF-8') ?>"
                      aria-label="Adicionar <?= htmlspecialchars($produto['nome'] . ' ' . $item['codigo'], ENT_QUOTES, 'UTF-8') ?> ao orçamento"
                    >
                      <i class="bi bi-cart-plus" aria-hidden="true"></i>
                      <span data-add-label>Adicionar ao orçamento</span>
                    </button>
                    <span class="quote-item-status d-block small mt-2" data-quote-item-status aria-live="polite"></span>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>

        <?php if (strcasecmp($produto['categoria'], 'Inserto') === 0): ?>
          <p class="quote-unit-note small mb-0">
            <i class="bi bi-info-circle me-1" aria-hidden="true"></i>
            Insertos são orçados por unidade.
          </p>
        <?php endif; ?>

        <!-- Call to Action -->
        <div class="card bg-dark border-secondary mt-5 p-4 text-center shadow-sm">
          <h2 class="text-white fw-bold mb-2 fs-4">Monte seu orçamento</h2>
          <p class="text-muted mb-4">
            Adicione as medidas desejadas e envie todos os produtos de uma vez pelo WhatsApp.
          </p>
          <div class="d-flex gap-3 justify-content-center flex-wrap">
            <a href="carrinho.php" class="btn btn-success d-inline-flex align-items-center gap-2 rounded-pill px-4">
              <i class="bi bi-cart3" aria-hidden="true"></i>
              <span>Ver meu orçamento</span>
            </a>
            <a href="produtos.php" class="btn btn-outline-secondary rounded-pill px-4">Continuar navegando</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Produtos Relacionados -->
    <?php if (count($produtosRelacionados) > 0): ?>
    <div class="mt-5 pt-5 border-top border-secondary">
      <h3 class="fw-bold text-center text-white mb-4">Produtos Relacionados</h3>
      <div class="row justify-content-center g-4">
        <?php foreach ($produtosRelacionados as $relacionado): ?>
          <div class="col-md-4 col-sm-6">
            <div class="card h-100 position-relative shadow-sm">
              <div class="p-3 bg-white" style="border-radius: 12px 12px 0 0; min-height: 180px; display: flex; align-items: center; justify-content: center;">
                <img src="<?= $caminhoImagens . $relacionado['imagens'][0] ?>" 
                     class="img-fluid" 
                     style="max-height: 140px; width: auto; object-fit: contain;" 
                     alt="<?= htmlspecialchars($relacionado['nome']) ?>"
                     loading="lazy"
                     decoding="async">
              </div>
              <div class="card-body d-flex flex-column text-center border-top border-secondary">
                <h6 class="card-title fw-bold text-white mb-2"><?= htmlspecialchars($relacionado['nome']) ?></h6>
                <a href="produto.php?id=<?= $relacionado['id'] ?>" class="btn btn-sm btn-outline-success mt-auto rounded-pill">Ver Detalhes</a>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endif; ?>

  </div>

  <?php include 'footer.php'; ?>
</body>
</html>
