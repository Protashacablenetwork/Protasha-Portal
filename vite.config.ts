import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function mirrorDistToHtdocs() {
  return {
    name: 'mirror-dist-to-htdocs',
    apply: 'build' as const,
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const htdocsDir = path.resolve(__dirname, 'HTDOCS_UPLOAD');
      if (!fs.existsSync(path.join(distDir, 'index.html'))) return;
      try {
        // Remove temporary AI Studio attachment folder from production build
        const aistudioAssets = path.join(distDir, 'assets', 'aistudio');
        if (fs.existsSync(aistudioAssets)) {
          fs.rmSync(aistudioAssets, { recursive: true, force: true });
        }
        fs.rmSync(htdocsDir, { recursive: true, force: true });
        fs.cpSync(distDir, htdocsDir, { recursive: true });
      } catch (err) {
        console.warn('[Build] Could not mirror dist to HTDOCS_UPLOAD:', err);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: ['es2020', 'chrome87', 'firefox78', 'safari14'],
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/app.js',
          chunkFileNames: 'assets/chunk-[name].js',
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'vendor-firebase';
            if (id.includes('/lucide-react/')) return 'vendor-icons';
            if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) return 'vendor-react';
            return undefined;
          },
          assetFileNames: (assetInfo) => {
            const names = assetInfo.names || (assetInfo.name ? [assetInfo.name] : []);
            if (names.some((n) => n.endsWith('.css'))) {
              return 'assets/app.css';
            }
            return 'assets/[name][extname]';
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'lucide-react',
        'firebase/app',
        'firebase/firestore',
        'firebase/auth',
      ],
    },
    plugins: [react(), tailwindcss(), mirrorDistToHtdocs()],
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
