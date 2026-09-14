(function () {
  'use strict';

  const STORAGE_KEY = 'vsilvaToolsQuoteCart';
  const MAX_TEXT_LENGTH = 500;
  const addButtonTimers = new WeakMap();
  let toastTimer = null;

  function cleanText(value, maxLength = MAX_TEXT_LENGTH) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return '';
    }

    return String(value).trim().slice(0, maxLength);
  }

  function buildItemId(productId, code) {
    return `${cleanText(productId, 80)}::${cleanText(code)}`;
  }

  function parsePositiveInteger(value) {
    if (typeof value === 'string' && !/^\d+$/.test(value.trim())) {
      return null;
    }

    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
  }

  function sanitizeImage(value) {
    const image = cleanText(value, 300);
    return /^assets\/img\/[a-zA-Z0-9_./-]+$/.test(image)
      ? image
      : 'assets/img/placeholder.png';
  }

  function sanitizeItem(rawItem) {
    if (!rawItem || typeof rawItem !== 'object') {
      return null;
    }

    const productId = cleanText(rawItem.productId, 80);
    const productName = cleanText(rawItem.productName);
    const code = cleanText(rawItem.code);
    const quantity = parsePositiveInteger(rawItem.quantity);

    if (!productId || !productName || !code || quantity === null) {
      return null;
    }

    return {
      id: buildItemId(productId, code),
      productId,
      productName,
      category: cleanText(rawItem.category),
      brand: cleanText(rawItem.brand),
      code,
      quantity,
      image: sanitizeImage(rawItem.image)
    };
  }

  function normalizeCart(items) {
    if (!Array.isArray(items)) {
      return [];
    }

    const uniqueItems = new Map();

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

  function getCart() {
    try {
      const storedCart = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return normalizeCart(storedCart);
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    const sanitizedCart = normalizeCart(cart);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedCart));
    } catch (error) {
      showToast('Não foi possível salvar o orçamento neste navegador.');
    }

    renderAll(sanitizedCart);
    document.dispatchEvent(new CustomEvent('vsilva:quote-cart-updated', {
      detail: { cart: sanitizedCart }
    }));

    return sanitizedCart;
  }

  function addToCart(product) {
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
    return cart.find((item) => item.id === newItem.id) || null;
  }

  function removeFromCart(itemId) {
    const cart = getCart().filter((item) => item.id !== itemId);
    return saveCart(cart);
  }

  function updateQuantity(itemId, quantity) {
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

  function clearCart() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // O estado visual ainda é limpo quando o armazenamento está indisponível.
    }

    renderAll([]);
    document.dispatchEvent(new CustomEvent('vsilva:quote-cart-updated', {
      detail: { cart: [] }
    }));
  }

  function getCartItemCount() {
    return getCart().length;
  }

  function formatUnits(quantity) {
    return `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}`;
  }

  function renderCartBadge(cart = getCart()) {
    const itemCount = cart.length;

    document.querySelectorAll('[data-quote-cart-badge]').forEach((badge) => {
      const previousCount = Number(badge.textContent);
      badge.textContent = String(itemCount);

      if (previousCount !== itemCount) {
        badge.classList.remove('quote-cart-badge--updated');
        requestAnimationFrame(() => badge.classList.add('quote-cart-badge--updated'));
      }
    });

    document.querySelectorAll('.quote-cart-link').forEach((link) => {
      link.setAttribute(
        'aria-label',
        `Abrir meu orçamento: ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`
      );
    });
  }

  function renderProductStatuses(cart = getCart()) {
    document.querySelectorAll('[data-add-to-quote]').forEach((button) => {
      const itemId = buildItemId(button.dataset.productId, button.dataset.code);
      const item = cart.find((cartItem) => cartItem.id === itemId);
      const status = button.closest('tr')?.querySelector('[data-quote-item-status]');

      if (status) {
        status.textContent = item ? `No orçamento: ${formatUnits(item.quantity)}` : '';
      }
    });
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof text === 'string') {
      element.textContent = text;
    }
    return element;
  }

  function createIcon(iconClass) {
    const icon = createElement('i', `bi ${iconClass}`);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function createQuantityButton(action, item, iconClass, label) {
    const button = createElement('button', 'btn btn-outline-secondary quote-quantity-button');
    button.type = 'button';
    button.dataset.quoteAction = action;
    button.dataset.itemId = item.id;
    button.setAttribute('aria-label', `${label} de ${item.productName} ${item.code}`);
    button.title = label;
    button.appendChild(createIcon(iconClass));

    if (action === 'decrease' && item.quantity === 1) {
      button.disabled = true;
    }

    return button;
  }

  function createCartCard(item) {
    const card = createElement('article', 'card quote-cart-card p-3 p-md-4 mb-3');
    card.dataset.cartItemId = item.id;

    const layout = createElement('div', 'd-flex gap-3 gap-md-4 align-items-start');
    const imageWrapper = createElement('div', 'quote-cart-image flex-shrink-0');
    const image = document.createElement('img');
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
    removeButton.appendChild(createIcon('bi-trash3'));
    removeButton.appendChild(document.createTextNode(' Remover'));
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

  function generateWhatsAppMessage(cart = getCart()) {
    if (!cart.length) {
      return '';
    }

    const lines = [
      'Olá! Vim pelo site da Vsilva Tools e gostaria de solicitar um orçamento dos seguintes produtos:',
      ''
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

  function updateWhatsAppLink(cart) {
    const link = document.getElementById('quoteWhatsAppButton');
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

  function renderCart(cart = getCart()) {
    const emptyState = document.getElementById('quoteCartEmpty');
    const cartContent = document.getElementById('quoteCartContent');
    const cartList = document.getElementById('quoteCartList');

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

    const summary = cartContent.querySelector('[data-quote-cart-summary]');
    if (summary) {
      summary.textContent = `${cart.length} ${cart.length === 1 ? 'item diferente' : 'itens diferentes'}`;
    }

    const insertNotice = document.getElementById('quoteInsertNotice');
    if (insertNotice) {
      const hasInsert = cart.some((item) => item.category.toLocaleLowerCase('pt-BR').includes('inserto'));
      insertNotice.classList.toggle('d-none', !hasInsert);
    }

    updateWhatsAppLink(cart);
  }

  function renderAll(cart = getCart()) {
    renderCartBadge(cart);
    renderProductStatuses(cart);
    renderCart(cart);
  }

  function getToast() {
    let toast = document.getElementById('quoteCartToast');
    if (toast) {
      return toast;
    }

    toast = createElement('div', 'quote-toast', 'Produto adicionado ao orçamento.');
    toast.id = 'quoteCartToast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toast);
    return toast;
  }

  function showToast(message) {
    if (!document.body) {
      return;
    }

    const toast = getToast();
    toast.textContent = message;
    toast.classList.add('quote-toast--visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('quote-toast--visible');
    }, 2600);
  }

  function flashAddButton(button) {
    const label = button.querySelector('[data-add-label]');
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
    const addButton = event.target.closest('[data-add-to-quote]');
    if (addButton) {
      const item = addToCart({
        productId: addButton.dataset.productId,
        productName: addButton.dataset.productName,
        category: addButton.dataset.category,
        brand: addButton.dataset.brand,
        code: addButton.dataset.code,
        image: addButton.dataset.image
      });

      if (item) {
        flashAddButton(addButton);
        showToast('Produto adicionado ao orçamento.');
      }
      return;
    }

    const actionButton = event.target.closest('[data-quote-action]');
    if (actionButton) {
      const itemId = actionButton.dataset.itemId;
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

    const clearButton = event.target.closest('[data-confirm-clear-quote]');
    if (clearButton) {
      clearCart();
      const modalElement = document.getElementById('clearQuoteModal');
      if (modalElement && window.bootstrap?.Modal) {
        window.bootstrap.Modal.getOrCreateInstance(modalElement).hide();
      }
    }

    const disabledWhatsAppLink = event.target.closest('#quoteWhatsAppButton[aria-disabled="true"]');
    if (disabledWhatsAppLink) {
      event.preventDefault();
    }
  });

  document.addEventListener('focusout', (event) => {
    const input = event.target.closest('[data-quote-quantity-input]');
    if (!input) {
      return;
    }

    if (!updateQuantity(input.dataset.itemId, input.value)) {
      const item = getCart().find((cartItem) => cartItem.id === input.dataset.itemId);
      input.value = item ? String(item.quantity) : '1';
      showToast('Informe uma quantidade inteira maior ou igual a 1.');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('[data-quote-quantity-input]')) {
      event.preventDefault();
      event.target.blur();
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      renderAll();
    }
  });

  document.addEventListener('DOMContentLoaded', () => renderAll());

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
    generateWhatsAppMessage
  });
})();
