export interface QuoteCartItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  brand: string;
  code: string;
  quantity: number;
  image: string;
}

interface QuoteProductInput {
  productId: string | number;
  productName: string;
  category?: string;
  brand?: string;
  code: string;
  image?: string;
}

interface QuoteCartApi {
  readonly STORAGE_KEY: string;
  getCart(): QuoteCartItem[];
  saveCart(cart: QuoteCartItem[]): QuoteCartItem[];
  addToCart(product: QuoteProductInput): QuoteCartItem | null;
  removeFromCart(itemId: string): QuoteCartItem[];
  updateQuantity(itemId: string, quantity: unknown): boolean;
  clearCart(): void;
  getCartItemCount(): number;
  renderCartBadge(cart?: QuoteCartItem[]): void;
  generateWhatsAppMessage(cart?: QuoteCartItem[]): string;
}

declare global {
  interface Window {
    VsilvaQuoteCart: QuoteCartApi;
    bootstrap?: {
      Modal: {
        getOrCreateInstance(element: Element): { hide(): void };
      };
    };
  }
}

const STORAGE_KEY = 'vsilvaToolsQuoteCart';
const MAX_TEXT_LENGTH = 500;
const addButtonTimers = new WeakMap<HTMLButtonElement, number>();
let toastTimer: number | undefined;

function cleanText(value: unknown, maxLength = MAX_TEXT_LENGTH): string {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return '';
  }
  return String(value).trim().slice(0, maxLength);
}

function buildItemId(productId: unknown, code: unknown): string {
  return `${cleanText(productId, 80)}::${cleanText(code)}`;
}

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value === 'string' && !/^\d+$/.test(value.trim())) {
    return null;
  }
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
}

function sanitizeImage(value: unknown): string {
  const image = cleanText(value, 300);
  return /^\/?assets\/img\/[a-zA-Z0-9_./-]+$/.test(image) ? image : '/assets/img/placeholder.png';
}

function sanitizeItem(rawItem: unknown): QuoteCartItem | null {
  if (!rawItem || typeof rawItem !== 'object') {
    return null;
  }

  const candidate = rawItem as Record<string, unknown>;
  const productId = cleanText(candidate.productId, 80);
  const productName = cleanText(candidate.productName);
  const code = cleanText(candidate.code);
  const quantity = parsePositiveInteger(candidate.quantity);

  if (!productId || !productName || !code || quantity === null) {
    return null;
  }

  return {
    id: buildItemId(productId, code),
    productId,
    productName,
    category: cleanText(candidate.category),
    brand: cleanText(candidate.brand),
    code,
    quantity,
    image: sanitizeImage(candidate.image),
  };
}

function normalizeCart(items: unknown): QuoteCartItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const uniqueItems = new Map<string, QuoteCartItem>();
  items.forEach((rawItem) => {
    const item = sanitizeItem(rawItem);
    if (!item) {
      return;
    }

    const existingItem = uniqueItems.get(item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      uniqueItems.set(item.id, item);
    }
  });

  return Array.from(uniqueItems.values());
}

function getCart(): QuoteCartItem[] {
  try {
    return normalizeCart(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
  } catch {
    return [];
  }
}

function notifyCartUpdate(cart: QuoteCartItem[]): void {
  document.dispatchEvent(new CustomEvent<{ cart: QuoteCartItem[] }>('vsilva:quote-cart-updated', { detail: { cart } }));
}

function saveCart(cart: QuoteCartItem[]): QuoteCartItem[] {
  const sanitizedCart = normalizeCart(cart);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedCart));
  } catch {
    showToast('Não foi possível salvar o orçamento neste navegador.');
  }

  renderAll(sanitizedCart);
  notifyCartUpdate(sanitizedCart);
  return sanitizedCart;
}

function addToCart(product: QuoteProductInput): QuoteCartItem | null {
  const newItem = sanitizeItem({ ...product, quantity: 1 });
  if (!newItem) {
    return null;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === newItem.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(newItem);
  }

  saveCart(cart);
  return cart.find((item) => item.id === newItem.id) ?? null;
}

function removeFromCart(itemId: string): QuoteCartItem[] {
  return saveCart(getCart().filter((item) => item.id !== itemId));
}

function updateQuantity(itemId: string, quantity: unknown): boolean {
  const parsedQuantity = parsePositiveInteger(quantity);
  if (parsedQuantity === null) {
    return false;
  }

  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === itemId);
  if (!item) {
    return false;
  }

  item.quantity = parsedQuantity;
  saveCart(cart);
  return true;
}

function clearCart(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // A interface ainda é limpa quando o armazenamento não está disponível.
  }
  renderAll([]);
  notifyCartUpdate([]);
}

function getCartItemCount(): number {
  return getCart().length;
}

function formatUnits(quantity: number): string {
  return `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}`;
}

function renderCartBadge(cart = getCart()): void {
  const itemCount = cart.length;
  document.querySelectorAll<HTMLElement>('[data-quote-cart-badge]').forEach((badge) => {
    const previousCount = Number(badge.textContent);
    badge.textContent = String(itemCount);
    if (previousCount !== itemCount) {
      badge.classList.remove('quote-cart-badge--updated');
      requestAnimationFrame(() => badge.classList.add('quote-cart-badge--updated'));
    }
  });

  document.querySelectorAll<HTMLAnchorElement>('.quote-cart-link').forEach((link) => {
    link.setAttribute('aria-label', `Abrir meu orçamento: ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`);
  });
}

function renderProductStatuses(cart = getCart()): void {
  document.querySelectorAll<HTMLButtonElement>('[data-add-to-quote]').forEach((button) => {
    const itemId = buildItemId(button.dataset.productId, button.dataset.code);
    const item = cart.find((cartItem) => cartItem.id === itemId);
    const status = button.closest('tr')?.querySelector<HTMLElement>('[data-quote-item-status]');
    if (status) {
      status.textContent = item ? `No orçamento: ${formatUnits(item.quantity)}` : '';
    }
  });
}

function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, className = '', text?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createIcon(iconClass: string): HTMLElement {
  const icon = createElement('i', `bi ${iconClass}`);
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function createQuantityButton(action: 'decrease' | 'increase', item: QuoteCartItem, iconClass: string, label: string): HTMLButtonElement {
  const button = createElement('button', 'btn btn-outline-secondary quote-quantity-button');
  button.type = 'button';
  button.dataset.quoteAction = action;
  button.dataset.itemId = item.id;
  button.setAttribute('aria-label', `${label} de ${item.productName} ${item.code}`);
  button.title = label;
  button.appendChild(createIcon(iconClass));
  button.disabled = action === 'decrease' && item.quantity === 1;
  return button;
}

function createCartCard(item: QuoteCartItem): HTMLElement {
  const card = createElement('article', 'card quote-cart-card p-3 p-md-4 mb-3');
  card.dataset.cartItemId = item.id;

  const layout = createElement('div', 'd-flex gap-3 gap-md-4 align-items-start');
  const imageWrapper = createElement('div', 'quote-cart-image flex-shrink-0');
  const image = createElement('img');
  image.src = item.image;
  image.alt = item.productName;
  image.loading = 'lazy';
  image.decoding = 'async';
  imageWrapper.appendChild(image);

  const content = createElement('div', 'flex-grow-1 min-w-0');
  const headingRow = createElement('div', 'd-flex justify-content-between align-items-start gap-3');
  const heading = createElement('h2', 'h5 text-white fw-bold mb-2', item.productName);
  const removeButton = createElement('button', 'btn btn-sm btn-outline-danger quote-remove-button');
  removeButton.type = 'button';
  removeButton.dataset.quoteAction = 'remove';
  removeButton.dataset.itemId = item.id;
  removeButton.setAttribute('aria-label', `Remover ${item.productName} ${item.code} do orçamento`);
  removeButton.title = 'Remover do orçamento';
  removeButton.append(createIcon('bi-trash3'), document.createTextNode(' Remover'));
  headingRow.append(heading, removeButton);

  const codeLabel = createElement('span', 'quote-meta-label d-block small', 'Código / Medida');
  const code = createElement('p', 'quote-cart-code text-white fw-semibold mb-2', item.code);
  const details = [item.category, item.brand].filter(Boolean).join(' · ');
  const meta = createElement('p', 'text-muted small mb-3', details);
  const quantityLabel = createElement('label', 'form-label text-white fw-semibold small mb-2', 'Quantidade');
  const inputId = `quote-quantity-${item.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  quantityLabel.htmlFor = inputId;

  const quantityGroup = createElement('div', 'quote-quantity-control d-flex align-items-center');
  const decreaseButton = createQuantityButton('decrease', item, 'bi-dash-lg', 'Diminuir quantidade');
  const quantityInput = createElement('input', 'form-control quote-quantity-input text-center');
  quantityInput.id = inputId;
  quantityInput.type = 'number';
  quantityInput.min = '1';
  quantityInput.step = '1';
  quantityInput.inputMode = 'numeric';
  quantityInput.pattern = '[0-9]*';
  quantityInput.value = String(item.quantity);
  quantityInput.dataset.quoteQuantityInput = '';
  quantityInput.dataset.itemId = item.id;
  quantityInput.setAttribute('aria-label', `Quantidade de ${item.productName} ${item.code}`);
  const increaseButton = createQuantityButton('increase', item, 'bi-plus-lg', 'Aumentar quantidade');
  quantityGroup.append(decreaseButton, quantityInput, increaseButton);

  content.append(headingRow, codeLabel, code);
  if (details) {
    content.appendChild(meta);
  }
  content.append(quantityLabel, quantityGroup);
  layout.append(imageWrapper, content);
  card.appendChild(layout);
  return card;
}

function generateWhatsAppMessage(cart = getCart()): string {
  if (cart.length === 0) {
    return '';
  }

  const lines = [
    'Olá! Vim pelo site da Vsilva Tools e gostaria de solicitar um orçamento dos seguintes produtos:',
    '',
  ];
  cart.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.productName}`);
    lines.push(`Código/Medida: ${item.code}`);
    lines.push(`Quantidade: ${item.quantity} unidades`);
    lines.push('');
  });
  lines.push('Poderiam verificar valores e disponibilidade para mim?');
  return lines.join('\n');
}

function updateWhatsAppLink(cart: QuoteCartItem[]): void {
  const link = document.querySelector<HTMLAnchorElement>('#quoteWhatsAppButton');
  if (!link) {
    return;
  }

  const phone = cleanText(link.dataset.whatsapp, 30).replace(/\D/g, '');
  const message = generateWhatsAppMessage(cart);
  if (!phone || !message) {
    link.removeAttribute('href');
    link.classList.add('disabled');
    link.setAttribute('aria-disabled', 'true');
    return;
  }

  link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  link.classList.remove('disabled');
  link.removeAttribute('aria-disabled');
}

function renderCart(cart = getCart()): void {
  const emptyState = document.querySelector<HTMLElement>('#quoteCartEmpty');
  const cartContent = document.querySelector<HTMLElement>('#quoteCartContent');
  const cartList = document.querySelector<HTMLElement>('#quoteCartList');
  if (!emptyState || !cartContent || !cartList) {
    return;
  }

  const isEmpty = cart.length === 0;
  emptyState.classList.toggle('d-none', !isEmpty);
  cartContent.classList.toggle('d-none', isEmpty);
  cartList.replaceChildren();
  if (isEmpty) {
    updateWhatsAppLink(cart);
    return;
  }

  cart.forEach((item) => cartList.appendChild(createCartCard(item)));
  const summary = cartContent.querySelector<HTMLElement>('[data-quote-cart-summary]');
  if (summary) {
    summary.textContent = `${cart.length} ${cart.length === 1 ? 'item diferente' : 'itens diferentes'}`;
  }

  const insertNotice = document.querySelector<HTMLElement>('#quoteInsertNotice');
  if (insertNotice) {
    const hasInsert = cart.some((item) => item.category.toLocaleLowerCase('pt-BR').includes('inserto'));
    insertNotice.classList.toggle('d-none', !hasInsert);
  }
  updateWhatsAppLink(cart);
}

function renderAll(cart = getCart()): void {
  renderCartBadge(cart);
  renderProductStatuses(cart);
  renderCart(cart);
}

function getToast(): HTMLElement {
  const existingToast = document.querySelector<HTMLElement>('#quoteCartToast');
  if (existingToast) {
    return existingToast;
  }

  const toast = createElement('div', 'quote-toast', 'Produto adicionado ao orçamento.');
  toast.id = 'quoteCartToast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toast);
  return toast;
}

function showToast(message: string): void {
  const toast = getToast();
  toast.textContent = message;
  toast.classList.add('quote-toast--visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('quote-toast--visible'), 2600);
}

function flashAddButton(button: HTMLButtonElement): void {
  const label = button.querySelector<HTMLElement>('[data-add-label]');
  if (!label) {
    return;
  }

  window.clearTimeout(addButtonTimers.get(button));
  label.textContent = 'Adicionado';
  button.classList.add('is-added');
  const timer = window.setTimeout(() => {
    label.textContent = 'Adicionar ao orçamento';
    button.classList.remove('is-added');
    addButtonTimers.delete(button);
  }, 2200);
  addButtonTimers.set(button, timer);
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const addButton = event.target.closest<HTMLButtonElement>('[data-add-to-quote]');
  if (addButton) {
    const item = addToCart({
      productId: addButton.dataset.productId ?? '',
      productName: addButton.dataset.productName ?? '',
      category: addButton.dataset.category,
      brand: addButton.dataset.brand,
      code: addButton.dataset.code ?? '',
      image: addButton.dataset.image,
    });
    if (item) {
      flashAddButton(addButton);
      showToast('Produto adicionado ao orçamento.');
    }
    return;
  }

  const actionButton = event.target.closest<HTMLButtonElement>('[data-quote-action]');
  if (actionButton) {
    const itemId = actionButton.dataset.itemId ?? '';
    const item = getCart().find((cartItem) => cartItem.id === itemId);
    if (!item) {
      return;
    }

    if (actionButton.dataset.quoteAction === 'increase') {
      updateQuantity(itemId, item.quantity + 1);
    } else if (actionButton.dataset.quoteAction === 'decrease' && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else if (actionButton.dataset.quoteAction === 'remove') {
      removeFromCart(itemId);
    }
    return;
  }

  const clearButton = event.target.closest<HTMLButtonElement>('[data-confirm-clear-quote]');
  if (clearButton) {
    clearCart();
    const modalElement = document.querySelector('#clearQuoteModal');
    if (modalElement && window.bootstrap) {
      window.bootstrap.Modal.getOrCreateInstance(modalElement).hide();
    }
    return;
  }

  if (event.target.closest('#quoteWhatsAppButton[aria-disabled="true"]')) {
    event.preventDefault();
  }
});

document.addEventListener('focusout', (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.matches('[data-quote-quantity-input]')) {
    return;
  }

  const input = event.target;
  if (!updateQuantity(input.dataset.itemId ?? '', input.value)) {
    const item = getCart().find((cartItem) => cartItem.id === input.dataset.itemId);
    input.value = item ? String(item.quantity) : '1';
    showToast('Informe uma quantidade inteira maior ou igual a 1.');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.target instanceof HTMLInputElement && event.target.matches('[data-quote-quantity-input]')) {
    event.preventDefault();
    event.target.blur();
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY || event.key === null) {
    renderAll();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => renderAll(), { once: true });
} else {
  renderAll();
}

window.VsilvaQuoteCart = Object.freeze({
  STORAGE_KEY,
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartItemCount,
  renderCartBadge,
  generateWhatsAppMessage,
});

export {};
