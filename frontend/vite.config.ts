import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => ({
  // Use root base in local dev so direct routes like /practice/coding work.
  // Keep repo subpath base for production builds.
  base: command === 'serve' ? '/' : '/Avantika-Interview-Preparation-SaaS-Platform/',
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
