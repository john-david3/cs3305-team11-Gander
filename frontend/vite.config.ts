import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['frontend'],
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://web_server:5000',
        changeOrigin: true,
      }
    }
  },
})