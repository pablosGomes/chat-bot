import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuração para build do widget embeddable
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': {}
  },
  build: {
    // Entrada específica para o widget
    rollupOptions: {
      input: 'src/widget.jsx',
      output: {
        // Um único arquivo JS
        entryFileNames: 'cintia-widget.js',
        chunkFileNames: 'cintia-[hash].js',
        assetFileNames: 'cintia.[ext]',
        // Formato IIFE para fácil inclusão via script tag
        format: 'iife',
        // Nome global
        name: 'CintiaWidget',
        // Não dividir em chunks
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    },
    // Saída em pasta específica
    outDir: 'dist-widget',
    // CSS inline no JS
    cssCodeSplit: false
  }
})

