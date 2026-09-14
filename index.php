<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Básicos -->
  <title>Vsilva Tools - Ferramentas de Usinagem</title>
  <meta name="description" content="Vsilva Tools — Insertos, fresas e brocas de metal duro para usinagem. Qualidade OKE, ZCC CT, KYOCERA. Entrega para todo o Brasil. Orçamento pelo WhatsApp.">
  <meta name="keywords" content="insertos usinagem, fresas metal duro, brocas T-Max, ferramentas usinagem ABC Paulista, ZCC CT, OKE, KYOCERA">
  <meta property="og:title" content="Vsilva Tools — Ferramentas de Usinagem">
  <meta property="og:description" content="Insertos, fresas e brocas para usinagem com qualidade e atendimento especializado.">
  <meta property="og:image" content="https://vsilvatools.com.br/assets/img/banner.webp">
  <meta property="og:url" content="https://vsilvatools.com.br">
  <link rel="canonical" href="https://vsilvatools.com.br">

  <!-- Preload Banner -->
  <link rel="preload" as="image" href="assets/img/banner.webp" fetchpriority="high">

  <!-- Arquivos CSS Globais -->
  <?php include 'head_includes.php'; ?>
</head>
<body class="d-flex flex-column min-vh-100">

  <!-- Navbar -->
  <?php include 'header.php'; ?>

  <!-- Banner Hero Parallax -->
  <header class="banner-section text-center text-white d-flex align-items-center justify-content-center">
    <div class="overlay"></div>
    <div class="container position-relative">
      <h1 class="fw-bold" style="font-size: clamp(2rem, 6vw, 4rem);">Bem-vindo à Vsilva Tools</h1>
      <p class="mb-4" style="color: var(--cor-verde); font-size: clamp(1rem, 3vw, 1.5rem);">Especialistas em ferramentas para usinagem com qualidade e confiança.</p>
      
      <div class="d-flex gap-3 justify-content-center flex-wrap">
        <a href="#produtos" class="btn btn-success btn-lg px-4 py-2 rounded-pill shadow-sm">Ver Produtos</a>
        <?php include 'botao_whatsapp.php'; ?>
        <a href="<?= $linkWhatsapp ?>" target="_blank" class="btn btn-outline-success btn-lg px-4 py-2 rounded-pill shadow-sm">Falar no WhatsApp</a>
      </div>
    </div>
    
    <div class="scroll-indicator">
      <i class="bi bi-chevron-down"></i>
    </div>
  </header>

  <!-- Sobre Nós -->
  <section id="sobre" class="py-5 bg-light">
    <div class="container py-4">
      <div class="row align-items-center">
        <div class="col-lg-7 mb-4 mb-lg-0">
          <h2 class="fw-bold mb-4">Sobre a Vsilva Tools</h2>
          <p class="fs-5">
            A <strong>Vsilva Tools</strong> é uma empresa familiar que nasceu da união entre experiência prática no ramo de usinagem e a inovação digital no ABC Paulista.
          </p>
          <p class="fs-5">
            Fundada com o objetivo de oferecer ferramentas nacionais e importadas de alta qualidade para todo tipo de usinagem, nossa missão é entregar soluções confiáveis
            e acessíveis para profissionais exigentes da indústria metalúrgica.
          </p>
        </div>
        <div class="col-lg-5">
          <div class="row text-center g-4">
            <div class="col-6">
              <div class="p-3 border border-secondary rounded h-100 d-flex flex-column justify-content-center bg-dark">
                <h3 class="fw-bold" style="color: var(--cor-verde);">25+</h3>
                <p class="mb-0 text-white">Insertos</p>
              </div>
            </div>
            <div class="col-6">
              <div class="p-3 border border-secondary rounded h-100 d-flex flex-column justify-content-center bg-dark">
                <h3 class="fw-bold" style="color: var(--cor-verde);">3</h3>
                <p class="mb-0 text-white">Categorias</p>
              </div>
            </div>
            <div class="col-6 mx-auto mt-4">
              <div class="p-3 border border-secondary rounded h-100 d-flex flex-column justify-content-center bg-dark">
                <h3 class="fw-bold" style="color: var(--cor-verde);">5</h3>
                <p class="mb-0 text-white">Marcas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Produtos (Vitrine) -->
  <section id="produtos" class="py-5">
    <?php include 'lista_produtos.php'; ?>
    <div class="text-center mt-2">
      <a href="produtos.php" class="btn btn-outline-success btn-lg px-4 rounded-pill">Ver Todos os Produtos</a>
    </div>
  </section>

  <!-- Garantias -->
  <section class="py-5 bg-light">
    <div class="container py-4">
      <h2 class="text-center mb-5 fw-bold">Por que escolher a Vsilva Tools?</h2>
      <div class="row text-center g-4">
        
        <div class="col-md-6 col-lg-3">
          <div class="guarantee-card">
            <i class="bi bi-shield-check guarantee-icon mb-3 d-inline-block"></i>
            <h5 class="fw-bold">Qualidade Garantida</h5>
            <p class="mb-0">Trabalhamos apenas com marcas reconhecidas como ZCC CT, Hadsto, OKE, CRETO e outras referências no setor.</p>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3">
          <div class="guarantee-card">
            <i class="bi bi-headset guarantee-icon mb-3 d-inline-block"></i>
            <h5 class="fw-bold">Atendimento Especializado</h5>
            <p class="mb-0">Com a experiência do nosso co-diretor, garantimos suporte técnico confiável para ajudar na escolha da ferramenta.</p>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3">
          <div class="guarantee-card">
            <i class="bi bi-truck guarantee-icon mb-3 d-inline-block"></i>
            <h5 class="fw-bold">Envio para Todo o Brasil</h5>
            <p class="mb-0">Enviamos com segurança via Correios e entregamos pessoalmente na região do ABC Paulista.</p>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3">
          <div class="guarantee-card">
            <i class="bi bi-chat-dots guarantee-icon mb-3 d-inline-block"></i>
            <h5 class="fw-bold">Orçamento Rápido</h5>
            <p class="mb-0">Nosso atendimento via WhatsApp é rápido e direto — peça já seu orçamento com um clique!</p>
          </div>
        </div>
        
      </div>
    </div>
  </section>

  <!-- Contato -->
  <section id="contato" class="py-5">
    <?php include 'formulario.php'; ?>
  </section>
  
  <?php include 'footer.php'; ?>
