import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': {}
  },
  build: {
    // Gera um único arquivo JS para fácil embed
    rollupOptions: {
      output: {
        // Nome do arquivo de saída
        entryFileNames: 'cintia-widget.js',
        chunkFileNames: 'cintia-widget-[hash].js',
        assetFileNames: 'cintia-widget.[ext]'
      }
    }
  }
})
