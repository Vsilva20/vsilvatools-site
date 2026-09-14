function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function initializeCatalog(): void {
  const searchInput = document.querySelector<HTMLInputElement>('#buscaProduto');
  const filterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('#produtosTab [data-filter]'));
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.produto-card'));
  const noResults = document.querySelector<HTMLElement>('#noResults');

  if (!searchInput || !noResults || cards.length === 0) {
    return;
  }

  let currentFilter = 'todos';
  let currentSearch = '';

  const filterProducts = (): void => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.categoria ?? '';
      const searchableText = card.dataset.nome ?? '';
      const matchesFilter = currentFilter === 'todos' || category === currentFilter;
      const matchesSearch = searchableText.includes(currentSearch);
      const isVisible = matchesFilter && matchesSearch;

      card.classList.toggle('d-none', !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

    noResults.classList.toggle('d-none', visibleCount > 0);
  };

  searchInput.addEventListener('input', () => {
    currentSearch = normalizeSearch(searchInput.value);
    filterProducts();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter ?? 'todos';
      filterProducts();
    });
  });
}

document.addEventListener('astro:page-load', initializeCatalog);
document.addEventListener('DOMContentLoaded', initializeCatalog, { once: true });
