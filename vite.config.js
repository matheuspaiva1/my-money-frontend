import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // Backend (my-money) URL. Usado como alvo do proxy de dev para evitar
  // problemas de CORS, já que o backend não tem middleware de CORS habilitado.
  const apiTarget = env.VITE_API_URL || 'http://localhost:3333'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/users': { target: apiTarget, changeOrigin: true },
        '/login': { target: apiTarget, changeOrigin: true },
        '/company': { target: apiTarget, changeOrigin: true },
        '/schedule': { target: apiTarget, changeOrigin: true },
        '/earnings': { target: apiTarget, changeOrigin: true },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
    },
  }
})
