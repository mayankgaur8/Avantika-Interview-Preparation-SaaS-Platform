import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getDb } from '../config/database';
import { env } from '../config/env';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { getActiveSubscription, formatSubscription } from '../services/subscription';

const router = Router();

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name?.trim() || !email?.trim() || !password) {
      res.status(400).json({ error: 'name, email and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const db = getDb();
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (exists) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const now = Date.now();

    db.prepare(
      'INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
    ).run(id, name.trim(), email.toLowerCase(), passwordHash, now);

    const token = jwt.sign({ userId: id }, env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id, name: name.trim(), email: email.toLowerCase() },
      subscription: null,
    });
  } catch (err) {
    console.error('[auth/register]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const db = getDb();
    const user = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase()) as
      | { id: string; name: string; email: string; password_hash: string }
      | undefined;

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
    const sub = getActiveSubscription(user.id);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      subscription: sub ? formatSubscription(sub) : null,
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const db = getDb();

  const user = db
    .prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
    .get(userId) as { id: string; name: string; email: string; created_at: number } | undefined;

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const sub = getActiveSubscription(userId);
  res.json({
    user,
    subscription: sub ? formatSubscription(sub) : null,
  });
});

export default router;
