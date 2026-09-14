<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<div class="container py-5">
  <h2 class="text-center mb-4 fw-bold text-white">Envie uma Mensagem</h2>
  <h5 class="text-center mt-3 mb-5 text-muted">Para tirar dúvidas sobre nossos produtos ou montar um orçamento, preencha o formulário abaixo:</h5>
  
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
      <div class="card bg-dark border-secondary shadow-sm p-4">
        <form id="form-contato">
          
          <div class="mb-3">
            <label for="nome" class="form-label text-white fw-semibold">Nome Completo</label>
            <input type="text" class="form-control" id="nome" name="nome" placeholder="Seu nome" required aria-required="true">
          </div>
          
          <div class="mb-3">
            <label for="email" class="form-label text-white fw-semibold">E-mail</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="seu.email@exemplo.com" required aria-required="true">
          </div>
          
          <div class="mb-4">
            <label for="telefone" class="form-label text-white fw-semibold">Telefone / WhatsApp</label>
            <input type="tel" class="form-control" id="telefone" name="telefone" maxlength="15" placeholder="(11) 90000-0000" required aria-required="true">
          </div>
          
          <div class="mb-4">
            <label for="mensagem" class="form-label text-white fw-semibold">Mensagem</label>
            <textarea class="form-control" id="mensagem" name="mensagem" rows="4" placeholder="Como podemos ajudar?" required aria-required="true"></textarea>
          </div>
          
          <div class="d-flex justify-content-center mb-4">
            <div class="g-recaptcha" data-sitekey="6LcQNHYrAAAAAJWVc3DM6YgzBzufis10VHmEHwQx"></div>
          </div>
          
          <button type="submit" class="btn btn-success w-100 py-2 fw-bold fs-5 rounded-pill">
            <i class="bi bi-send me-2"></i> Enviar Mensagem
          </button>

        </form>
      </div>
    </div>
  </div>
</div>

<script>
document.getElementById('form-contato').addEventListener('submit', function (e) {
  e.preventDefault();

  const response = grecaptcha.getResponse();
  if (!response) {
    alert('Por favor, confirme o reCAPTCHA para prosseguir.');
    return;
  }

  const btnSubmit = this.querySelector('button[type="submit"]');
  const originalText = btnSubmit.innerHTML;
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Enviando...';

  const formData = new FormData(this);
  formData.append('g-recaptcha-response', response);

  fetch('enviar.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(resultado => {
    if (resultado.trim() === 'sucesso') {
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      document.getElementById('form-contato').reset();
      grecaptcha.reset();
    } else {
      alert('Erro ao enviar a mensagem. Tente novamente mais tarde.');
    }
  })
  .catch(error => {
    console.error('Erro:', error);
    alert('Erro inesperado. Verifique sua conexão com a internet.');
  })
  .finally(() => {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = originalText;
  });
});
</script>
