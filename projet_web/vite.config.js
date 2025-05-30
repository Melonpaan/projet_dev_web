import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige les requêtes /api/... vers le backend .NET
      '/api': {
        target: 'http://localhost:5165', // Cible du backend .NET (HTTP)
        changeOrigin: true, // Nécessaire pour les hôtes virtuels
        // secure: false, // Plus nécessaire car la cible est HTTP
      }
    }
  }
})
