import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [crx({ manifest })],
  build: {
    outDir: resolve(__dirname, '../dist/extension'),
    emptyOutDir: true,
  },
});