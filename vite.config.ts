import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Content-Security-Policy": "frame-src 'self' https://accounts.google.com https://docs.google.com https://drive.google.com https://*.googleusercontent.com https://www.google.com;",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Resource-Policy": "cross-origin"
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    }
  }
});
