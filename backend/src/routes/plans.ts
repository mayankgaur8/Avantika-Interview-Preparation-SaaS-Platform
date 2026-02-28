import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';

const router = Router();

// ─── GET /api/plans ───────────────────────────────────────────────────────────
router.get('/', (_req: Request, res: Response) => {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM plans WHERE active = 1 ORDER BY amount ASC`)
    .all() as Array<{
    id: string;
    name: string;
    level: string;
    amount: number;
    currency: string;
    duration_days: number;
    features_json: string;
    limits_json: string;
    active: number;
  }>;

  const plans = rows.map((r) => ({
    id: r.id,
    name: r.name,
    level: r.level,
    amount: r.amount,
    currency: r.currency,
    durationDays: r.duration_days,
    features: JSON.parse(r.features_json) as string[],
    limits: JSON.parse(r.limits_json) as Record<string, number>,
    active: Boolean(r.active),
  }));

  res.json({ plans });
});

// ─── GET /api/plans/:id ───────────────────────────────────────────────────────
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM plans WHERE id = ? AND active = 1').get(req.params.id) as
    | {
        id: string;
        name: string;
        level: string;
        amount: number;
        currency: string;
        duration_days: number;
        features_json: string;
        limits_json: string;
        active: number;
      }
    | undefined;

  if (!row) {
    res.status(404).json({ error: 'Plan not found' });
    return;
  }

  res.json({
    plan: {
      id: row.id,
      name: row.name,
      level: row.level,
      amount: row.amount,
      currency: row.currency,
      durationDays: row.duration_days,
      features: JSON.parse(row.features_json) as string[],
      limits: JSON.parse(row.limits_json) as Record<string, number>,
    },
  });
});

export default router;
