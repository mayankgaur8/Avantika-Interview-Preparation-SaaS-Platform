import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { getDb } from '../config/database';
import { env } from '../config/env';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { razorpay, checkPaymentSignature } from '../services/razorpay';
import {
  activateSubscription,
  getActiveSubscription,
  formatSubscription,
} from '../services/subscription';

const router = Router();

// ─── POST /api/payments/create-order ─────────────────────────────────────────
// Creates a Razorpay order and stores a pending payment record.
router.post('/create-order', requireAuth, async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const { planId } = req.body as { planId?: string };

  if (!planId) {
    res.status(400).json({ error: 'planId is required' });
    return;
  }

  const db = getDb();
  const plan = db
    .prepare('SELECT * FROM plans WHERE id = ? AND active = 1')
    .get(planId) as
    | { id: string; name: string; amount: number; currency: string; duration_days: number }
    | undefined;

  if (!plan) {
    res.status(404).json({ error: 'Plan not found or inactive' });
    return;
  }

  if (plan.amount === 0) {
    res.status(400).json({ error: 'Use POST /activate-free for zero-cost plans' });
    return;
  }

  try {
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `rcpt_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`,
      notes: {
        planId: plan.id,
        userId,
        appName: env.APP_NAME,
      },
    });

    // Persist a pending payment record (idempotency: order_id is UNIQUE)
    const paymentRowId = crypto.randomUUID();
    db.prepare(`
      INSERT INTO payments (id, user_id, plan_id, order_id, amount, status, app_name, created_at)
      VALUES (?, ?, ?, ?, ?, 'created', ?, ?)
    `).run(paymentRowId, userId, plan.id, order.id, plan.amount, env.APP_NAME, Date.now());

    res.json({
      orderId: order.id,
      amount: plan.amount,
      currency: plan.currency,
      keyId: env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('[payments/create-order]', err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// ─── POST /api/payments/verify ────────────────────────────────────────────────
// Verifies the Razorpay HMAC signature and activates the subscription.
router.post('/verify', requireAuth, (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId,
  } = req.body as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    planId?: string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
    res.status(400).json({ error: 'razorpay_order_id, razorpay_payment_id, razorpay_signature and planId are required' });
    return;
  }

  const db = getDb();

  // ── Idempotency: if we already processed this payment, return the subscription ──
  const existingPayment = db
    .prepare('SELECT * FROM payments WHERE payment_id = ? AND status = ?')
    .get(razorpay_payment_id, 'paid') as { id: string } | undefined;

  if (existingPayment) {
    const sub = getActiveSubscription(userId);
    res.json({ success: true, subscription: sub ? formatSubscription(sub) : null });
    return;
  }

  // ── Verify HMAC signature ──
  if (!checkPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    res.status(400).json({ error: 'Payment signature verification failed' });
    return;
  }

  // ── Fetch plan ──
  const plan = db
    .prepare('SELECT * FROM plans WHERE id = ?')
    .get(planId) as
    | { id: string; duration_days: number; name: string }
    | undefined;

  if (!plan) {
    res.status(404).json({ error: 'Plan not found' });
    return;
  }

  // ── Update payment record ──
  db.prepare(`
    UPDATE payments
    SET payment_id = ?, signature = ?, status = 'paid'
    WHERE order_id = ?
  `).run(razorpay_payment_id, razorpay_signature, razorpay_order_id);

  // ── Activate subscription ──
  const sub = activateSubscription(userId, planId, razorpay_payment_id, plan.duration_days);
  res.json({ success: true, subscription: sub });
});

// ─── POST /api/payments/activate-free ────────────────────────────────────────
// Activates the free plan without going through Razorpay.
router.post('/activate-free', requireAuth, (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const { planId } = req.body as { planId?: string };

  const db = getDb();
  const plan = db
    .prepare('SELECT * FROM plans WHERE id = ? AND active = 1 AND amount = 0')
    .get(planId) as
    | { id: string; duration_days: number }
    | undefined;

  if (!plan) {
    res.status(404).json({ error: 'Free plan not found' });
    return;
  }

  // Do not downgrade someone already on a paid plan
  const existing = getActiveSubscription(userId);
  if (existing && existing.amount > 0) {
    res.status(400).json({ error: 'You already have an active paid subscription' });
    return;
  }

  const paymentToken = `free_${crypto.randomUUID()}`;
  const sub = activateSubscription(userId, plan.id, paymentToken, plan.duration_days);
  res.json({ success: true, subscription: sub });
});

// ─── GET /api/payments/my-subscription ───────────────────────────────────────
router.get('/my-subscription', requireAuth, (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const sub = getActiveSubscription(userId);
  res.json({ subscription: sub ? formatSubscription(sub) : null });
});

export default router;
