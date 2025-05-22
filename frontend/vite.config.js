// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // procesar JSX en archivos .js también
      include: ['src/**/*.js', 'src/**/*.jsx'],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 3000, open: true },
  base: '/',
});
