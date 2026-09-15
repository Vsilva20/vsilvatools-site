<?php 
include_once 'dados_produtos.php';

// Busca os produtos com destaque = true (limite 6)
$produtosDestacados = getProdutosDestaque(6);
?>

<div class="container my-5">
  <h2 class="text-center mb-5 fw-bold">Promoções em Destaque</h2>

  <div id="carouselProdutos" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner px-2">

      <?php
      $chunked = array_chunk($produtosDestacados, 3); // 3 por slide no desktop pode ficar melhor, mas usaremos grid com col-md-4
      foreach ($chunked as $i => $grupo): ?>
        <div class="carousel-item <?= $i === 0 ? 'active' : '' ?>">
          <div class="row justify-content-center">
            <?php foreach ($grupo as $produto): ?>
              <div class="col-md-4 col-sm-6 mb-4">
                <div class="card h-100 position-relative overflow-hidden">
                  
                  <!-- Badge Mais Vendido -->
                  <?php if ($produto['destaque']): ?>
                  <span class="badge position-absolute top-0 start-0 m-2 px-2 py-1 shadow-sm" style="background:var(--cor-verde);color:#000; z-index: 10;">
                    <i class="bi bi-star-fill me-1"></i> Mais Vendido
                  </span>
                  <?php endif; ?>

                  <!-- Imagem do Produto -->
                  <div class="featured-product-image bg-white">
                    <img src="<?= $caminhoImagens . $produto['imagens'][0] ?>" 
                         class="featured-product-image__asset"
                         alt="<?= $produto['nome'] ?> - Vsilva Tools"
                         loading="lazy"
                         decoding="async">
                  </div>

                  <div class="card-body d-flex flex-column text-center border-top border-secondary">
                    <span class="badge bg-secondary mb-2 mx-auto"><?= $produto['categoria'] ?></span>
                    <h5 class="card-title fw-bold text-white mb-2"><?= $produto['nome'] ?></h5>
                    <p class="card-text text-muted mb-4 small"><?= $produto['descricao_curta'] ?></p>
                    <a href="produto.php?id=<?= $produto['id'] ?>" class="btn btn-success mt-auto rounded-pill w-100">Ver Detalhes</a>
                  </div>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>

    </div>

    <!-- Controles -->
    <button class="btn btn-dark position-absolute top-50 start-0 translate-middle-y rounded-circle ms-n3 shadow" data-bs-target="#carouselProdutos" data-bs-slide="prev" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; z-index: 10;">
      <i class="bi bi-chevron-left fs-5"></i>
    </button>
    <button class="btn btn-dark position-absolute top-50 end-0 translate-middle-y rounded-circle me-n3 shadow" data-bs-target="#carouselProdutos" data-bs-slide="next" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; z-index: 10;">
      <i class="bi bi-chevron-right fs-5"></i>
    </button>
  </div>
</div>
