import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress' }), // Más eficiente que gzip
    viteCompression({ algorithm: 'gzip' }) // Respaldo para navegadores antiguos
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Extrae las librerías de node_modules en un archivo separado
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('styled-components')) {
              return 'vendor-styles';
            }
            return 'vendor'; // Resto de dependencias
          }
        }
      }
    }
  }
})
