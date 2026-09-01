import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // GitHub Pages serves the site under /portfolio/ (BASE_URL), and the admin
  // bundle is emitted to public/admin/, so assets resolve at
  // /portfolio/admin/assets/... — hence this base.
  base: '/portfolio/admin/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../public/admin',
    emptyOutDir: true,
  },
});