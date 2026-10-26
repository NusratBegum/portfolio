import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// SINGLEFILE=1 → self-contained build (models inlined as data URIs) for the
// claude.ai artifact preview; default build stays multi-file for GitHub Pages.
const single = !!process.env.SINGLEFILE;

export default defineConfig({
  base: './',
  assetsInclude: ['**/*.glb'],
  plugins: [react(), tailwindcss(), ...(single ? [viteSingleFile()] : [])],
  build: {
    assetsInlineLimit: single ? 100_000_000 : 4096,
    chunkSizeWarningLimit: 1500,
    sourcemap: true,
  },
});
