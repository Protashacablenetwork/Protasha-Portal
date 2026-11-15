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
const port = process.env.PORT || 3000;
const isExplicitDev = process.env.NODE_ENV === 'development' || process.env.npm_lifecycle_event === 'dev' || process.env.DISABLE_HMR === 'true';
const isProd = !isExplicitDev && (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist')) || fs.existsSync(path.join(__dirname, 'docs')) || fs.existsSync(path.join(__dirname, 'HTDOCS_UPLOAD')));
const buildDir = fs.existsSync(path.join(__dirname, 'HTDOCS_UPLOAD')) ? 'HTDOCS_UPLOAD' : (fs.existsSync(path.join(__dirname, 'dist')) ? 'dist' : (fs.existsSync(path.join(__dirname, 'docs')) ? 'docs' : 'dist'));

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

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
        version: '2.5.0',
        buildNumber: 250,
        releaseDate: '2026-11-14',
        titleBn: 'নিরাপত্তা ও স্মার্ট ফিচার আপডেট',
        titleEn: 'Security & Smart Features Update',
        featuresBn: [],
        featuresEn: []
    });
});

// Vite integration
if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
    });
    app.use(vite.middlewares);
} else {
    app.use(express.static(path.join(__dirname, buildDir)));
    app.get('*', (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, buildDir, 'index.html'));
    });
}

app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
