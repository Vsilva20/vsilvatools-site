import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const baseUrl = process.env.VSILVA_TEST_BASE_URL ?? 'http://localhost:4321';
const clientDirectory = resolve(import.meta.dirname, '../dist/client');

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  }));
  return nested.flat();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const files = await collectFiles(clientDirectory);
const htmlFiles = files.filter((file) => extname(file) === '.html');
const productHtmlFiles = htmlFiles.filter((file) => relative(clientDirectory, file).startsWith(`produtos${join('', '/')}`) && !file.endsWith(join('produtos', 'index.html')));
const internalReferences = new Set();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (reference.startsWith('/') && !reference.startsWith('//') && !reference.startsWith('/#')) {
      internalReferences.add(reference.split('#')[0]);
    }
  }
  assert(!/(?:href|src)="[^"]+\.php(?:[?"#])/i.test(html), `Link PHP legado encontrado em ${file}`);
}

for (const file of productHtmlFiles) {
  const html = await readFile(file, 'utf8');
  assert(!/\bPreço\b|R\$/i.test(html), `Preço público encontrado em ${file}`);
}

const brokenReferences = [];
for (const reference of internalReferences) {
  const response = await fetch(new URL(reference, baseUrl), { redirect: 'follow' });
  if (response.status >= 400) {
    brokenReferences.push(`${reference} (${response.status})`);
  }
}

assert(productHtmlFiles.length === 41, `Esperadas 41 páginas de produto; encontradas ${productHtmlFiles.length}.`);
assert(brokenReferences.length === 0, `Referências quebradas: ${brokenReferences.join(', ')}`);

const legacyResponse = await fetch(`${baseUrl}/produto.php?id=5`, { redirect: 'manual' });
assert(legacyResponse.status === 301, `Redirecionamento legado retornou ${legacyResponse.status}.`);
assert(legacyResponse.headers.get('location') === '/produtos/tnmg', 'Destino legado do produto 5 está incorreto.');

console.log(`Validação concluída: ${htmlFiles.length} páginas, ${productHtmlFiles.length} produtos e ${internalReferences.size} referências internas sem falhas.`);
