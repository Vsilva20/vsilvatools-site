interface ContactApiResponse {
  success: boolean;
  message: string;
}

interface RecaptchaApi {
  getResponse(): string;
  reset(): void;
}

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function setFeedback(element: HTMLElement, success: boolean, message: string): void {
  element.textContent = message;
  element.classList.remove('d-none', 'alert-success', 'alert-danger');
  element.classList.add(success ? 'alert-success' : 'alert-danger');
  element.focus({ preventScroll: true });
}

function initializeContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('#form-contato');
  if (!form || form.dataset.initialized === 'true') {
    return;
  }

  form.dataset.initialized = 'true';
  const phoneInput = form.querySelector<HTMLInputElement>('#telefone');
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const feedback = form.querySelector<HTMLElement>('#contactFormFeedback');

  phoneInput?.addEventListener('input', () => {
    phoneInput.value = formatPhone(phoneInput.value);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity() || !submitButton || !submitLabel || !feedback) {
      return;
    }

    const recaptchaEnabled = form.dataset.recaptchaEnabled === 'true';
    const recaptchaToken = recaptchaEnabled ? window.grecaptcha?.getResponse() ?? '' : '';

    if (recaptchaEnabled && !recaptchaToken) {
      setFeedback(feedback, false, 'Por favor, confirme o reCAPTCHA para prosseguir.');
      return;
    }

    const formData = new FormData(form);
    formData.set('g-recaptcha-response', recaptchaToken);
    submitButton.disabled = true;
    submitLabel.textContent = 'Enviando...';
    feedback.classList.add('d-none');

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = (await response.json()) as ContactApiResponse;

      setFeedback(feedback, response.ok && result.success, result.message);
      if (response.ok && result.success) {
        form.reset();
        window.grecaptcha?.reset();
      }
    } catch {
      setFeedback(feedback, false, 'Erro inesperado. Verifique sua conexão com a internet.');
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Enviar Mensagem';
    }
  });
}

document.addEventListener('astro:page-load', initializeContactForm);
document.addEventListener('DOMContentLoaded', initializeContactForm, { once: true });

export {};
