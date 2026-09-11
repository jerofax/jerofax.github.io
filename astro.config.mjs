// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jerofax.github.io',
  base: '/',
  // Genera sitemap-index.xml en cada build para que Google encuentre
  // todas las páginas (incluidas las notas publicadas).
  integrations: [sitemap()],
  markdown: {
    // LaTeX en las notas: $...$ en línea y $$...$$ en bloque.
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
