import { Router, Request, Response } from 'express';
import { checkWebhookSignature } from '../services/razorpay';
import { getDb } from '../config/database';
import { activateSubscription } from '../services/subscription';

const router = Router();

/**
 * POST /api/webhooks/razorpay
 *
 * Razorpay sends raw JSON body. Must be mounted BEFORE express.json() in index.ts.
 * Set up the webhook URL in Razorpay Dashboard → Settings → Webhooks.
 * Enable the event: payment.captured
 */
router.post('/razorpay', (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string | undefined;

  if (!signature) {
    res.status(400).json({ error: 'Missing X-Razorpay-Signature header' });
    return;
  }

  // req.body is a Buffer because we mounted with express.raw()
  const rawBody = req.body instanceof Buffer ? req.body.toString('utf-8') : JSON.stringify(req.body);

  if (!checkWebhookSignature(rawBody, signature)) {
    res.status(401).json({ error: 'Invalid webhook signature' });
    return;
  }

  let event: {
    event: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          notes?: { planId?: string; userId?: string };
          status?: string;
        };
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  // ── Handle payment.captured ───────────────────────────────────────────────
  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    if (!payment?.id || !payment?.order_id) {
      res.status(200).json({ received: true }); // ack without action
      return;
    }

    const paymentId = payment.id;
    const orderId = payment.order_id;
    const planId = payment.notes?.planId;
    const userId = payment.notes?.userId;

    if (!planId || !userId) {
      console.warn('[webhook] Missing planId or userId in payment notes', { paymentId, orderId });
      res.status(200).json({ received: true });
      return;
    }

    const db = getDb();

    // Idempotency: skip if already paid
    const existing = db
      .prepare("SELECT id FROM payments WHERE payment_id = ? AND status = 'paid'")
      .get(paymentId);

    if (!existing) {
      // Update payment record
      db.prepare(`
        UPDATE payments SET payment_id = ?, status = 'paid' WHERE order_id = ?
      `).run(paymentId, orderId);

      // Activate subscription via webhook confirmation
      const plan = db
        .prepare('SELECT duration_days FROM plans WHERE id = ?')
        .get(planId) as { duration_days: number } | undefined;

      if (plan) {
        activateSubscription(userId, planId, paymentId, plan.duration_days);
        console.log(`[webhook] Subscription activated for user ${userId} (plan: ${planId})`);
      }
    }
  }

  res.status(200).json({ received: true });
});

export default router;
