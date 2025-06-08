import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup.html',
        background: 'src/background.ts',
        content: 'src/content.ts'
      }
    }
  },
  server: {
    watch: {
      ignored: ['!**/src/**']
    },
    hmr: false
  }
});