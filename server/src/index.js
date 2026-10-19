import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

// Utils & Middleware
import { UPLOADS_DIR, upload, processUploadedFile } from './utils/storage.js';
import { noSqlSanitizer } from './utils/security.js';
import { requireAuth, requireRole } from './middleware/auth.js';
import { seedDatabase } from './seed.js';

// Routers
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

// Verify critical environment variables
const requiredEnv = ['JWT_SECRET'];
for (const envKey of requiredEnv) {
  if (!process.env[envKey] && process.env.NODE_ENV === 'production') {
    console.error(`FATAL: Environment variable ${envKey} is missing!`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible media, fonts, and inline styles
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(compression());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev/staging
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(noSqlSanitizer);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Static uploads directory with caching headers
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

// In-Memory Rate Limiter
const ipMap = new Map();
export function rateLimiter(maxAttempts = 30, windowMs = 15 * 60 * 1000) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = ipMap.get(ip) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }
    entry.count++;
    ipMap.set(ip, entry);

    if (entry.count > maxAttempts) {
      const waitMins = Math.ceil((entry.resetAt - now) / 60000);
      return res.status(429).json({
        message: `Too many requests. Please wait ${waitMins} minute${waitMins > 1 ? 's' : ''} before trying again.`,
      });
    }
    next();
  };
}

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const state = mongoose.connection.readyState;
  res.json({
    status: state === 1 ? 'healthy' : 'degraded',
    uptime: Math.round(process.uptime()),
    database: {
      connected: state === 1,
      state: dbStates[state] || 'unknown',
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// -------------------------------------------------------------
// SEO Robots.txt & Sitemap.xml
// -------------------------------------------------------------
app.get('/robots.txt', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const { Product } = await import('./models/index.js');
    const products = await Product.find({ isActive: true }).select('slug updatedAt');
    const baseUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;

    const staticPages = ['', '/products', '/gallery', '/installations', '/about', '/contact', '/policies'];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const page of staticPages) {
      xml += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    }

    for (const p of products) {
      xml += `
  <url>
    <loc>${baseUrl}/products/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    }

    xml += '\n</urlset>';
    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// -------------------------------------------------------------
// File Uploads Endpoint (Multi-file, Sharp WebP Optimization)
// -------------------------------------------------------------
app.post(
  '/api/uploads',
  requireAuth,
  requireRole('admin', 'staff'),
  upload.array('files', 15),
  async (req, res, next) => {
    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ message: 'No files were uploaded.' });
      }

      const results = [];
      for (const file of req.files) {
        const processed = await processUploadedFile(file);
        if (processed) results.push(processed.url);
      }

      res.json({
        files: results,
        url: results[0] || null, // Convenient single-file fallback
      });
    } catch (err) {
      next(err);
    }
  }
);

// Single-file avatar upload
app.post(
  '/api/auth/avatar',
  requireAuth,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
      const processed = await processUploadedFile(req.file);
      req.user.avatar = processed.url;
      await req.user.save();
      const { publicUser } = await import('./utils/auth.js');
      res.json({ user: publicUser(req.user) });
    } catch (err) {
      next(err);
    }
  }
);

// -------------------------------------------------------------
// Mount Routes
// -------------------------------------------------------------
app.use('/api/auth', rateLimiter(45), authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// -------------------------------------------------------------
// Serve Built Frontend in Production (if client/dist exists)
// -------------------------------------------------------------
const clientDist = path.resolve('../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// -------------------------------------------------------------
// 404 Route for Unmatched API Endpoints
// -------------------------------------------------------------
app.use('/api/*', (_req, res) => {
  res.status(404).json({ message: 'Endpoint not found or method unsupported.' });
});

// -------------------------------------------------------------
// Centralized Error Handler (Never leaks stack traces in production)
// -------------------------------------------------------------
app.use((err, req, res, _next) => {
  console.error(`[Error] ${req.method} ${req.url} —`, err.message);
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(status).json({
    message: err.message || 'An unexpected server error occurred.',
    ...(isProd ? {} : { stack: err.stack }),
  });
});

// -------------------------------------------------------------
// MongoDB Connection & Server Launch with Retry
// -------------------------------------------------------------
async function startServer() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hanger_commerce';
  console.log('Connecting to MongoDB database...');

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected successfully.');

    // Auto-seed on start if first run or database is empty
    seedDatabase().catch((e) => console.warn('Non-blocking seed notice:', e.message));

    app.listen(PORT, () => {
      console.log(`✓ HangerHome API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(startServer, 5000);
  }
}

startServer();
