import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 100, // ms, adjust as needed
    },
    host: true, // already needed for Docker
    port: 5173,
  },
  base: '/',
})
