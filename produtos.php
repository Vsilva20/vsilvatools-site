<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO -->
  <title>Nossos Produtos - Vsilva Tools</title>
  <meta name="description" content="Confira o catálogo completo de ferramentas de usinagem da Vsilva Tools. Insertos, Fresas de Metal Duro e Brocas T-Max das melhores marcas.">
  <meta name="keywords" content="produtos usinagem, catálogo ferramentas, insertos, fresas, brocas, ZCC CT, OKE, KYOCERA">
  <meta property="og:title" content="Catálogo de Produtos - Vsilva Tools">
  <meta property="og:description" content="Confira nosso catálogo de insertos, fresas e brocas de alta performance.">
  <meta property="og:url" content="https://vsilvatools.com.br/produtos.php">

  <!-- Arquivos CSS Globais -->
  <?php include 'head_includes.php'; ?>
</head>
<body class="d-flex flex-column min-vh-100">

  <!-- Navbar -->
  <?php include 'header.php'; ?>

  <?php
  include_once 'dados_produtos.php';
  $todosProdutos = getProdutosAtivos();
  ?>

  <!-- Header da Página -->
  <header class="py-5 bg-dark border-bottom border-secondary">
    <div class="container text-center">
      <h1 class="display-5 fw-bold text-white mb-3">Nossos Produtos</h1>
      <p class="lead text-muted">Explore nosso catálogo completo e encontre a ferramenta ideal para o seu projeto.</p>
      <p class="text-success small mb-0">Caso não encontre o que procura, nos chame no WhatsApp!</p>
    </div>
  </header>

  <div class="container py-5 flex-grow-1">
    
    <!-- Busca e Filtros -->
    <div class="row mb-5 justify-content-center">
      <div class="col-lg-8">
        <div class="input-group mb-4 shadow-sm">
          <span class="input-group-text bg-dark border-secondary text-white"><i class="bi bi-search"></i></span>
          <input type="text" id="buscaProduto" class="form-control form-control-lg bg-dark border-secondary text-white" placeholder="Buscar por nome, modelo ou descrição...">
        </div>

        <!-- Abas Bootstrap -->
        <ul class="nav nav-pills nav-fill gap-2" id="produtosTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active w-100" id="tab-todos" data-bs-toggle="pill" data-filter="todos" type="button" role="tab" aria-selected="true">Todos</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link w-100" id="tab-insertos" data-bs-toggle="pill" data-filter="Inserto" type="button" role="tab" aria-selected="false">Insertos</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link w-100" id="tab-fresas" data-bs-toggle="pill" data-filter="Fresa" type="button" role="tab" aria-selected="false">Fresas</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link w-100" id="tab-brocas" data-bs-toggle="pill" data-filter="Broca T-Max" type="button" role="tab" aria-selected="false">Brocas T-Max</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Grid de Produtos -->
    <div class="row g-4" id="gridProdutos">
      <?php foreach ($todosProdutos as $produto): ?>
        <div class="col-12 col-md-6 col-lg-4 produto-card" data-categoria="<?= $produto['categoria'] ?>" data-nome="<?= strtolower($produto['nome'] . ' ' . $produto['descricao_curta']) ?>">
          <div class="card h-100 position-relative shadow-sm">
            
            <?php if ($produto['destaque']): ?>
              <span class="badge position-absolute top-0 start-0 m-2 px-2 py-1 shadow-sm" style="background:var(--cor-verde);color:#000; z-index: 10;">
                <i class="bi bi-star-fill me-1"></i> Mais Vendido
              </span>
            <?php endif; ?>

            <div class="p-4 bg-white" style="border-radius: 12px 12px 0 0; min-height: 220px; display: flex; align-items: center; justify-content: center;">
              <img src="<?= $caminhoImagens . $produto['imagens'][0] ?>" 
                   class="img-fluid" 
                   style="max-height: 180px; width: auto; object-fit: contain;" 
                   alt="<?= htmlspecialchars($produto['nome']) ?>"
                   loading="lazy"
                   decoding="async">
            </div>

            <div class="card-body d-flex flex-column border-top border-secondary">
              <span class="badge bg-secondary mb-2 align-self-start"><?= $produto['categoria'] ?></span>
              <h5 class="card-title fw-bold text-white mb-2"><?= $produto['nome'] ?></h5>
              <p class="card-text text-muted mb-4 small flex-grow-1"><?= $produto['descricao_curta'] ?></p>
              <a href="produto.php?id=<?= $produto['id'] ?>" class="btn btn-outline-success mt-auto w-100 rounded-pill">Ver Detalhes</a>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
    
    <!-- Mensagem de Nenhum Produto Encontrado -->
    <div id="noResults" class="text-center py-5 d-none">
      <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
      <h4 class="text-white">Nenhum produto encontrado</h4>
      <p class="text-muted">Tente buscar por outros termos ou limpar os filtros.</p>
    </div>

  </div>

  <?php include 'footer.php'; ?>

  <!-- Scripts de Filtro e Busca -->
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const searchInput = document.getElementById('buscaProduto');
      const filterButtons = document.querySelectorAll('#produtosTab .nav-link');
      const cards = document.querySelectorAll('.produto-card');
      const noResults = document.getElementById('noResults');
      
      let currentFilter = 'todos';
      let currentSearch = '';

      function filterProducts() {
        let visibleCount = 0;
        
        cards.forEach(card => {
          const category = card.getAttribute('data-categoria');
          const nameDesc = card.getAttribute('data-nome');
          
          const matchFilter = (currentFilter === 'todos' || category === currentFilter);
          const matchSearch = nameDesc.includes(currentSearch);
          
          if (matchFilter && matchSearch) {
            card.classList.remove('d-none');
            visibleCount++;
          } else {
            card.classList.add('d-none');
          }
        });
        
        if (visibleCount === 0) {
          noResults.classList.remove('d-none');
        } else {
          noResults.classList.add('d-none');
        }
      }

      // Evento de Busca
      searchInput.addEventListener('input', function(e) {
        currentSearch = e.target.value.toLowerCase().trim();
        filterProducts();
      });

      // Evento de Abas (Filtro por categoria)
      filterButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
          currentFilter = e.target.getAttribute('data-filter');
          filterProducts();
        });
      });
    });
  </script>
</body>
</html>
