import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path';

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        analyze: resolve(__dirname, 'src/analyze.html'),
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    watch: {
      ignored: ['!**/src/**']
    },
    hmr: false
  }
})
