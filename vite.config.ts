import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
// Multi-page build: "/" is the game menu, each game has its own page.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        menu: resolve(import.meta.dirname, 'index.html'),
        pushup: resolve(import.meta.dirname, 'pushup/index.html'),
        imposter: resolve(import.meta.dirname, 'imposter/index.html'),
      },
    },
  },
})
