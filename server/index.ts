import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initStore } from './store/index.ts';
import authRoutes from './routes/auth.ts';
import configRoutes from './routes/config.ts';
import bookingRoutes from './routes/bookings.ts';
import uploadRoutes from './routes/upload.ts';
import voucherRoutes from './routes/vouchers.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const app = express();

let dbReady = false;
let dbError: string | null = null;

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  if (!dbReady) {
    res.status(dbError ? 503 : 200).json({
      status: dbError ? 'error' : 'starting',
      database: dbError ? 'error' : 'connecting',
      error: dbError ?? undefined,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vouchers', voucherRoutes);

const uploadsPath = join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  const server = app.listen(PORT, HOST, () => {
    console.log(`Lumière server listening on http://${HOST}:${PORT}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `\nPort ${PORT} is already in use. Stop the old server with:\n  npm run dev:stop\nThen run:\n  npm run dev\n`,
      );
    } else {
      console.error('Failed to start server:', error);
    }
    process.exit(1);
  });

  try {
    await initStore();
    dbReady = true;
    dbError = null;
    console.log('Database connected and store initialized');
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Database initialization failed';
    console.error('Failed to initialize database:', error);
  }
}

start();
