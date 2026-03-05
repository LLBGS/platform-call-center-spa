import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Habilitar CORS para permitir carregamento de MFEs
    cors: true,
  },
  build: {
    // Root não é uma biblioteca, é uma aplicação
    // Não deve ter configuração lib
    outDir: 'dist',
    sourcemap: true,
  },
});
