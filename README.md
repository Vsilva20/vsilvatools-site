# Vsilva Tools — Astro

Site institucional e catálogo da Vsilva Tools migrado de PHP para Astro com TypeScript estrito. A interface, o catálogo e o carrinho de orçamento foram preservados; as páginas públicas são pré-renderizadas e o envio do formulário usa uma rota Node.

## Requisitos

- Node.js 22.12 ou superior
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

O servidor de desenvolvimento fica disponível em `http://localhost:4321`.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha as credenciais do provedor SMTP:

- `SMTP_HOST`, `SMTP_PORT` e `SMTP_SECURE`
- `SMTP_USER` e `SMTP_PASSWORD`
- `SMTP_FROM` e `CONTACT_EMAIL`

O reCAPTCHA é opcional. Para ativá-lo, configure em conjunto `PUBLIC_RECAPTCHA_SITE_KEY` e `RECAPTCHA_SECRET_KEY`. Nenhuma credencial deve ser versionada.

## Produção

```bash
npm run build
npm run validate
npm run start
```

O build usa o adaptador Node em modo `standalone`. O host precisa executar `node dist/server/entry.mjs` e disponibilizar as variáveis de ambiente do formulário.

## Estrutura principal

- `src/pages/`: páginas Astro, rota dinâmica dos produtos e API de contato
- `src/components/`: cabeçalho, rodapé, cards, galeria, formulário e carrossel
- `src/data/products.ts`: catálogo tipado com 41 produtos
- `src/scripts/`: carrinho, filtros do catálogo e formulário em TypeScript
- `src/config/company.ts`: dados centrais da empresa e WhatsApp
- `public/assets/img/`: imagens públicas preservadas da versão PHP
- `scripts/migrate-products.mjs`: conversão reproduzível do catálogo PHP
- `scripts/validate-build.mjs`: auditoria das páginas, rotas e referências internas

As URLs antigas terminadas em `.php` continuam respondendo com redirecionamento permanente. Os arquivos PHP originais foram mantidos no repositório como referência e opção de rollback durante a transição.
