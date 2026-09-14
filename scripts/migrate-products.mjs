import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const sourcePath = resolve(projectRoot, 'dados_produtos.php');
const destinationPath = resolve(projectRoot, 'src/data/products.ts');
const source = await readFile(sourcePath, 'utf8');

const catalogStart = source.indexOf('$catalogo = [');
const catalogEnd = source.indexOf('\n];', catalogStart);

if (catalogStart < 0 || catalogEnd < 0) {
  throw new Error('Não foi possível localizar o catálogo em dados_produtos.php.');
}

let catalog = source.slice(catalogStart + '$catalogo = '.length, catalogEnd + 3);

catalog = catalog
  .replace(/^    \[$/gm, '    {')
  .replace(/^    \],$/gm, '    },')
  .replace(/^(\s*)\['codigo'\s*=>\s*(.+),\s*'preco'\s*=>\s*(.+)\],$/gm, '$1{ codigo: $2, preco: $3 },')
  .replace(/'descricao_curta'\s*=>/g, 'descricaoCurta:')
  .replace(/'descricao_detalhada'\s*=>/g, 'descricaoDetalhada:')
  .replace(/'(id|slug|nome|categoria|subcategoria|marcas|imagens|medidas|destaque|ativo)'\s*=>/g, '$1:');

catalog = catalog.replace(/;\s*$/, '');

const output = `import type { Product, ProductCategory } from '../types/Product';

export const PRODUCT_IMAGE_BASE = '/assets/img/produtos/';

export const products = ${catalog} satisfies Product[];

export function getAllProducts(): Product[] {
  return products.filter((product) => product.ativo);
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id && product.ativo);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug && product.ativo);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((product) => product.categoria === category && product.ativo);
}

export function getProductsByIds(ids: readonly number[]): Product[] {
  const productById = new Map(products.filter((product) => product.ativo).map((product) => [product.id, product]));
  return ids.flatMap((id) => {
    const product = productById.get(id);
    return product ? [product] : [];
  });
}

export function getFeaturedProducts(limit = 6): Product[] {
  return products.filter((product) => product.destaque && product.ativo).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((candidate) => candidate.ativo && candidate.categoria === product.categoria && candidate.id !== product.id)
    .slice(0, limit);
}
`;

await writeFile(destinationPath, output, 'utf8');
console.log(`Catálogo migrado para ${destinationPath}`);
