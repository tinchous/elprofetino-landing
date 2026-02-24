import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url';

export default defineConfig({
  root: 'client',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'client/src'),
      '@shared': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'shared'),
      '@/_core': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'client/src/_core')
    }
  },
  server: {
    port: 5173,
    open: true
  }
})


