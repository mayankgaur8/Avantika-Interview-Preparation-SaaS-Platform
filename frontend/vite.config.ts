import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => ({
  // Default to root for Azure/static root hosting.
  // Allow CI workflows (e.g. GitHub Pages) to override with VITE_BASE_PATH.
  base: command === 'serve' ? '/' : (process.env.VITE_BASE_PATH || '/'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
}))
