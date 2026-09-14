import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import type { ContactFormData } from '../../types/Product';

interface RecaptchaResponse {
  success?: boolean;
}

function jsonResponse(status: number, success: boolean, message: string): Response {
  return new Response(JSON.stringify({ success, message }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function getFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function containsHeaderInjection(value: string): boolean {
  return /[\r\n]/.test(value);
}

function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !containsHeaderInjection(value);
}

function validateContactForm(data: ContactFormData): string | null {
  const phoneDigits = data.telefone.replace(/\D/g, '');
  if (data.nome.length < 2 || data.nome.length > 120 || containsHeaderInjection(data.nome)) {
    return 'Informe um nome válido.';
  }
  if (!isValidEmail(data.email)) {
    return 'Informe um e-mail válido.';
  }
  if (phoneDigits.length < 10 || phoneDigits.length > 11 || data.telefone.length > 20) {
    return 'Informe um telefone válido com DDD.';
  }
  if (data.mensagem.length < 10 || data.mensagem.length > 2000) {
    return 'A mensagem deve ter entre 10 e 2000 caracteres.';
  }
  return null;
}

async function verifyRecaptcha(secret: string, token: string, remoteIp: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const payload = new URLSearchParams({ secret, response: token });
  if (remoteIp) {
    payload.set('remoteip', remoteIp);
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload,
  });

  if (!response.ok) {
    return false;
  }
  const result = (await response.json()) as RecaptchaResponse;
  return result.success === true;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

export const GET: APIRoute = () => jsonResponse(405, false, 'Método não permitido.');

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
    return jsonResponse(415, false, 'Formato de requisição inválido.');
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse(400, false, 'Não foi possível ler os dados enviados.');
  }

  const data: ContactFormData = {
    nome: getFormText(formData, 'nome'),
    email: getFormText(formData, 'email'),
    telefone: getFormText(formData, 'telefone'),
    mensagem: getFormText(formData, 'mensagem'),
    recaptchaToken: getFormText(formData, 'g-recaptcha-response'),
  };

  const validationError = validateContactForm(data);
  if (validationError) {
    return jsonResponse(400, false, validationError);
  }

  const recaptchaSecret = import.meta.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret) {
    const remoteIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
    try {
      if (!(await verifyRecaptcha(recaptchaSecret, data.recaptchaToken, remoteIp))) {
        return jsonResponse(400, false, 'Não foi possível validar o reCAPTCHA. Tente novamente.');
      }
    } catch {
      return jsonResponse(502, false, 'O serviço de validação está indisponível. Tente novamente em instantes.');
    }
  }

  const smtpHost = import.meta.env.SMTP_HOST;
  const smtpPort = Number(import.meta.env.SMTP_PORT ?? 587);
  const smtpUser = import.meta.env.SMTP_USER;
  const smtpPassword = import.meta.env.SMTP_PASSWORD;
  const smtpFrom = import.meta.env.SMTP_FROM || smtpUser;
  const contactEmail = import.meta.env.CONTACT_EMAIL;

  if (!smtpHost || !Number.isInteger(smtpPort) || !smtpUser || !smtpPassword || !smtpFrom || !contactEmail) {
    return jsonResponse(503, false, 'O formulário está temporariamente indisponível. Entre em contato pelo WhatsApp.');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: String(import.meta.env.SMTP_SECURE).toLowerCase() === 'true' || smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPassword },
  });

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: contactEmail,
      replyTo: data.email,
      subject: 'Mensagem do site - Vsilva Tools',
      text: `Nome: ${data.nome}\nEmail: ${data.email}\nTelefone: ${data.telefone}\n\nMensagem:\n${data.mensagem}`,
      html: `<p><strong>Nome:</strong> ${escapeHtml(data.nome)}</p><p><strong>Email:</strong> ${escapeHtml(data.email)}</p><p><strong>Telefone:</strong> ${escapeHtml(data.telefone)}</p><p><strong>Mensagem:</strong><br>${escapeHtml(data.mensagem).replace(/\n/g, '<br>')}</p>`,
    });
    return jsonResponse(200, true, 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
  } catch {
    return jsonResponse(502, false, 'Não foi possível enviar a mensagem. Tente novamente mais tarde.');
  }
};
