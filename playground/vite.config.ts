import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    open: '/playground/index.html'
  },
  build: {
    outDir: 'dist-playground',
    emptyOutDir: true
  }
})
