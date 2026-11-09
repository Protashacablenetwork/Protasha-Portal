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
const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist'));

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

// API: Proxy for External Billing Summary
app.get('/api/ay-byay/external/summary', async (req: express.Request, res: express.Response) => {
    try {
        const targetUrl = 'https://ais-pre-a37qv6u7wprcx3y5kyqn6h-220756794257.asia-east1.run.app/api/ay-byay/external/summary';
        const response = await fetch(targetUrl, {
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            const text = await response.text();
            try {
                const json = JSON.parse(text);
                return res.status(response.status).json(json);
            } catch (e) {
                return res.status(response.status).send(text);
            }
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ success: false, message: 'External service unreachable' });
    }
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
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
