import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Alias for src directory
    },
  },
  server: {
    allowedHosts: [
      'dragon-advanced-heartily.ngrok-free.app',
      'localhost:3000',  // Add other allowed hosts if needed
    ],
  },
})
