import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// no node imports needed

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
