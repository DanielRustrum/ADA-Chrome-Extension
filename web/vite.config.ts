import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// Replace this with your GitHub repo name if deploying to user.github.io/repo-name
const repoName = 'ADA-Contrast-Checker' 

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`, // for GitHub Pages hosting
  root: __dirname,
  build: {
    outDir: resolve(__dirname, '../dist/web'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})