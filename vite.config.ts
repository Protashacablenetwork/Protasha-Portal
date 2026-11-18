import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {defineConfig} from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function mirrorBuildToDist() {
  return {
    name: 'mirror-build-to-dist',
    buildStart() {
      const assetsDir = path.resolve(__dirname, 'HTDOCS_UPLOAD', 'assets');
      try {
        if (fs.existsSync(assetsDir)) {
          fs.rmSync(assetsDir, { recursive: true, force: true });
        }
      } catch (err) {
        console.warn('[Build] Could not clean stale HTDOCS_UPLOAD/assets:', err);
      }
    },
    closeBundle() {
      const outDir = path.resolve(__dirname, 'HTDOCS_UPLOAD');
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(path.join(outDir, 'index.html'))) return;
      try {
        fs.rmSync(distDir, { recursive: true, force: true });
        fs.cpSync(outDir, distDir, { recursive: true });
      } catch (err) {
        console.warn('[Build] Could not mirror HTDOCS_UPLOAD to dist:', err);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'HTDOCS_UPLOAD',
      emptyOutDir: true,
    },
    plugins: [react(), tailwindcss(), mirrorBuildToDist()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      allowedHosts: true as true,
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
