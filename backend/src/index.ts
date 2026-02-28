import './config/env'; // load .env first
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { getDb } from './config/database';

// Routes
import authRoutes from './routes/auth';
import plansRoutes from './routes/plans';
import paymentsRoutes from './routes/payments';
import webhooksRoutes from './routes/webhooks';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// ── Webhook route — MUST receive raw body for signature verification ──────────
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhooksRoutes);

// ── JSON body parser (all other routes) ─────────────────────────────────────
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: env.APP_NAME, time: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/payments', paymentsRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function start(): Promise<void> {
  // Initialize DB (creates schema if needed)
  getDb();

  app.listen(env.PORT, () => {
    console.log(`\n  Avantika backend running on http://localhost:${env.PORT}`);
    console.log(`  App name : ${env.APP_NAME}`);
    console.log(`  Node env : ${env.NODE_ENV}`);
    console.log(`  Frontend : ${env.FRONTEND_URL}\n`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
