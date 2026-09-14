  <!-- Botão flutuante do WhatsApp -->
  <?php include 'botao_whatsapp.php'; ?>

  <a href="<?= $linkWhatsapp ?>" target="_blank" class="whatsapp-float" aria-label="Fale conosco pelo WhatsApp">
    <i class="bi bi-whatsapp"></i>
  </a>

  <!-- Rodapé -->
  <footer class="mt-auto pt-5 pb-3">
    <div class="container">
      <div class="row text-center text-md-start">
        
        <div class="col-md-4 mb-4">
          <h5 class="text-uppercase text-white fw-bold mb-3">Vsilva Tools</h5>
          <p class="text-muted">Especialistas em ferramentas de usinagem com qualidade e confiança. Atendemos todo o Brasil com eficiência e bom atendimento.</p>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="text-uppercase text-white fw-bold mb-3">Links Rápidos</h5>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="index.php" class="text-muted text-decoration-none hover-verde">Home</a></li>
            <li class="mb-2"><a href="produtos.php" class="text-muted text-decoration-none hover-verde">Produtos</a></li>
            <li class="mb-2"><a href="carrinho.php" class="text-muted text-decoration-none hover-verde">Meu Orçamento</a></li>
            <li class="mb-2"><a href="contato.php" class="text-muted text-decoration-none hover-verde">Contato</a></li>
            <li class="mb-2"><a href="<?= $linkWhatsapp ?>" target="_blank" class="text-muted text-decoration-none hover-verde">WhatsApp</a></li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="text-uppercase text-white fw-bold mb-3">Contato</h5>
          <p class="mb-1 text-muted"><strong>Telefone:</strong> (11) 94750-2963</p>
          <p class="mb-1 text-muted"><strong>Email:</strong> <a href="mailto:vsilvatools@gmail.com" class="text-muted text-decoration-underline hover-verde">vsilvatools@gmail.com</a></p>
        </div>

        <div class="col-md-2 mb-4">
          <h5 class="text-uppercase text-white fw-bold mb-3">Siga-nos</h5>
          <div class="d-flex gap-3 justify-content-center justify-content-md-start">
            <a href="https://www.instagram.com/vsilvatools" target="_blank" class="text-muted hover-verde" aria-label="Instagram Vsilva Tools">
              <i class="bi bi-instagram fs-3"></i>
            </a>
            <a href="https://www.tiktok.com/@vsilvatools" target="_blank" class="text-muted hover-verde" aria-label="TikTok Vsilva Tools">
              <i class="bi bi-tiktok fs-3"></i>
            </a>
          </div>
        </div>
        
      </div>

      <div class="text-center py-3 mt-3 border-top border-secondary">
        <p class="mb-0 text-muted">&copy; 2025–2026 Vsilva Tools. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

  <style>
    /* Pequeno ajuste local para hover verde nos links do footer caso não esteja no global */
    .hover-verde:hover {
      color: var(--cor-verde) !important;
    }
  </style>
</body>
</html>
