import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;
const hasValidBuild = (dir: string) => {
    const htmlPath = path.join(__dirname, dir, 'index.html');
    if (!fs.existsSync(htmlPath)) return false;
    try {
        const html = fs.readFileSync(htmlPath, 'utf-8');
        const assetRefs = [...html.matchAll(/(?:src|href)=["']\.?\/(assets\/[^"']+)["']/g)].map((m) => m[1]);
        if (assetRefs.length === 0) return false;
        return assetRefs.every((rel) => fs.existsSync(path.join(__dirname, dir, rel)));
    } catch {
        return false;
    }
};
const resolvedBuildDir = hasValidBuild('dist')
    ? 'dist'
    : (hasValidBuild('HTDOCS_UPLOAD') ? 'HTDOCS_UPLOAD' : (hasValidBuild('docs') ? 'docs' : null));
const isExplicitDev = process.env.NODE_ENV === 'development' || process.env.npm_lifecycle_event === 'dev' || process.env.DISABLE_HMR === 'true';
const isProd = !isExplicitDev && resolvedBuildDir !== null;
const buildDir = resolvedBuildDir || 'dist';

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists (safe on read-only serverless containers)
const uploadDir = path.join(__dirname, 'public', 'uploads');
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch {}

app.use('/uploads', express.static(uploadDir));

// API: Handle Image Uploads
app.post('/api/upload', (req: express.Request, res: express.Response) => {
    try {
        const { image, filename } = req.body;
        if (!image || !filename) {
            return res.status(400).json({ success: false, message: 'Image and filename required' });
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, base64Data, 'base64');
        res.json({ success: true, url: `/uploads/${filename}` });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ success: false, message: 'Server upload failed' });
    }
});

// API: Proxy for External Billing Summary (only when configured)
app.get('/api/ay-byay/external/summary', async (req: express.Request, res: express.Response) => {
    try {
        const targetUrl = process.env.EXTERNAL_BILLING_API_URL;
        if (!targetUrl) {
            return res.json({ success: false, message: 'External billing URL not configured' });
        }
        const response = await fetch(targetUrl, {
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            return res.status(response.status).json({ success: false, message: 'External service unavailable' });
        }

        const data = await response.json();
        res.json({ success: true, data });
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ success: false, message: 'External service unreachable' });
    }
});

// API: CORS-free Google Sheet CSV/XLSX Proxy for Bill Manager Pro (with fast in-memory micro-cache)
const sheetProxyCache = new Map<string, { buffer: Buffer; contentType: string; expiresAt: number }>();
const SHEET_CACHE_TTL_MS = 45 * 1000;

app.get('/api/fetch-sheet', async (req: express.Request, res: express.Response) => {
    const targetUrl = String(req.query.url || '').trim();
    const forceFresh = req.query.fresh === '1' || req.query.fresh === 'true';
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const parsed = new URL(targetUrl);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            return res.status(400).json({ error: 'Invalid URL protocol' });
        }
        const host = parsed.hostname.toLowerCase();
        const isAllowedHost =
            host === 'docs.google.com' ||
            host.endsWith('.googleusercontent.com') ||
            host === 'sheets.googleapis.com';
        if (!isAllowedHost) {
            return res.status(403).json({ error: 'Host not permitted' });
        }

        const cacheKey = parsed.toString();
        const now = Date.now();
        if (!forceFresh) {
            const cached = sheetProxyCache.get(cacheKey);
            if (cached && cached.expiresAt > now) {
                res.setHeader('Content-Type', cached.contentType);
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.setHeader('X-Sheet-Cache', 'HIT');
                return res.send(cached.buffer);
            }
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        let response: Response;
        try {
            response = await fetch(cacheKey, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Encoding': 'gzip, deflate, br'
                },
                redirect: 'follow',
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeoutId);
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: `Failed to fetch from source: ${response.statusText}` });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const upstreamCt = (response.headers.get('content-type') || '').toLowerCase();
        const isCsv =
            upstreamCt.includes('text/csv') ||
            upstreamCt.includes('text/plain') ||
            parsed.searchParams.get('format') === 'csv' ||
            parsed.searchParams.get('tqx')?.includes('out:csv');
        const contentType = isCsv
            ? 'text/csv; charset=utf-8'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        if (buffer.length > 0 && !upstreamCt.includes('text/html')) {
            if (sheetProxyCache.size >= 60) {
                const oldestKey = sheetProxyCache.keys().next().value;
                if (oldestKey) sheetProxyCache.delete(oldestKey);
            }
            sheetProxyCache.set(cacheKey, { buffer, contentType, expiresAt: now + SHEET_CACHE_TTL_MS });
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('X-Sheet-Cache', 'MISS');
        return res.send(buffer);
    } catch (err: any) {
        console.error('Error proxying sheet:', err);
        return res.status(500).json({ error: err?.message || 'Internal server error' });
    }
});

// API: App Version & Release Notes (No-cache live version check)
app.get('/api/app-version', (_req: express.Request, res: express.Response) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const candidatePaths = [
        path.join(__dirname, 'public', 'version.json'),
        path.join(__dirname, buildDir, 'version.json')
    ];

    for (const filePath of candidatePaths) {
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf-8');
                const parsed = JSON.parse(raw);
                return res.json(parsed);
            }
        } catch {}
    }

    return res.json({
        version: '2.6.0',
        buildNumber: 260,
        releaseDate: '2026-11-20',
        titleBn: 'স্পিড, কোড-স্প্লিটিং ও আধুনিক প্রযুক্তি আপডেট',
        titleEn: 'Performance, Code-Splitting & Modern Tech Update',
        featuresBn: [],
        featuresEn: []
    });
});

// Vite integration
if (!isProd) {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    if (isHmrDisabled) {
        app.get('/@vite/client', (_req: express.Request, res: express.Response) => {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store');
            res.send(`
const sheetsMap = new Map();
const linkSheetsMap = new Map();
if (typeof document !== 'undefined') {
  document.querySelectorAll('style[data-vite-dev-id]').forEach((el) => {
    sheetsMap.set(el.getAttribute('data-vite-dev-id'), el);
  });
  document.querySelectorAll('link[rel="stylesheet"][data-vite-dev-id]').forEach((el) => {
    linkSheetsMap.set(el.getAttribute('data-vite-dev-id'), el);
  });
}
export function updateStyle(id, content) {
  if (linkSheetsMap.has(id)) return;
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}
export function removeStyle(id) {
  if (linkSheetsMap.has(id)) {
    document.querySelectorAll('link[rel="stylesheet"][data-vite-dev-id="' + CSS.escape(id) + '"]').forEach((el) => el.remove());
    linkSheetsMap.delete(id);
  }
  const style = sheetsMap.get(id);
  if (style) {
    style.remove();
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url, queryToInject) {
  if (url[0] !== '.' && url[0] !== '/') return url;
  const pathname = url.replace(/[?#].*$/, '');
  const { search, hash } = new URL(url, 'http://vite.dev');
  return pathname + '?' + queryToInject + (search ? '&' + search.slice(1) : '') + (hash || '');
}
export class ErrorOverlay {}
`);
        });
    }
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
        server: {
            middlewareMode: true,
            ...(isHmrDisabled ? { hmr: false, ws: false } : { hmr: { server: httpServer } }),
        },
        appType: 'spa'
    });
    app.use(vite.middlewares);
} else {
    const staticRoot = path.join(__dirname, buildDir);
    const applyStaticHeaders = (res: express.Response, filePath: string) => {
        if (filePath.endsWith('index.html') || filePath.endsWith('version.json')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        } else if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        }
    };
    app.use(express.static(staticRoot, {
        setHeaders: (res, filePath) => applyStaticHeaders(res, filePath)
    }));
    // Handle relative ./assets/... requests originating from nested SPA routes (e.g. /foo/assets/app.js)
    app.get(/\/assets\/(.+)$/, (req: express.Request, res: express.Response) => {
        const relAsset = req.params[0] || '';
        const safeRel = path.normalize(relAsset).replace(/^(\.\.(\/|\\|$))+/, '');
        const candidate = path.join(staticRoot, 'assets', safeRel);
        if (candidate.startsWith(path.join(staticRoot, 'assets')) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            applyStaticHeaders(res, candidate);
            return res.sendFile(candidate);
        }
        return res.status(404).send('Asset not found');
    });
    app.get('*', (req: express.Request, res: express.Response) => {
        if (req.path.startsWith('/assets/') || /\.(js|mjs|css|map|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(req.path)) {
            return res.status(404).send('Asset not found');
        }
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.sendFile(path.join(staticRoot, 'index.html'));
    });
}

httpServer.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

