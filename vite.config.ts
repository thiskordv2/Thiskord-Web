import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.emre-ak.fr',
        changeOrigin: true,
        secure: true,
      },
      '/chatHub': {
        target: 'https://api.emre-ak.fr',
        changeOrigin: true,
        ws: true,
        secure: true,
      },
    },
  },
})