import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://vsilvatools.com.br',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'never',
});
