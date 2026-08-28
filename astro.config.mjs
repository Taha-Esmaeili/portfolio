import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://tahaes.dev',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    icon({ include: { 'simple-icons': '*', 'mdi': '*', 'logos': '*', 'tabler': '*' } }),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});