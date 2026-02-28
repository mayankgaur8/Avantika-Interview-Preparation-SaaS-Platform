import crypto from 'crypto';
import { getDb } from '../config/database';
import { Subscription, planNameToLevel } from '../../billing/src/types';

interface DbSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  payment_id: string;
  status: string;
  started_at: number;
  expires_at: number;
  plan_name: string;
  plan_level: string;
}

/**
 * Activate (or extend) a subscription.
 * If user already has an active subscription, extends from current expiry.
 * Uses UPSERT — safe to call multiple times (idempotent per paymentId).
 */
export function activateSubscription(
  userId: string,
  planId: string,
  paymentId: string,
  durationDays: number,
): Subscription {
  const db = getDb();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const existing = db
    .prepare(
      `SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' AND expires_at > ?`,
    )
    .get(userId, now) as DbSubscription | undefined;

  const startedAt = now;
  const expiresAt = existing
    ? existing.expires_at + durationDays * dayMs // extend
    : now + durationDays * dayMs;

  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO subscriptions (id, user_id, plan_id, payment_id, status, started_at, expires_at)
    VALUES (?, ?, ?, ?, 'active', ?, ?)
    ON CONFLICT (user_id) DO UPDATE SET
      id         = excluded.id,
      plan_id    = excluded.plan_id,
      payment_id = excluded.payment_id,
      status     = 'active',
      started_at = excluded.started_at,
      expires_at = excluded.expires_at
  `).run(id, userId, planId, paymentId, startedAt, expiresAt);

  return formatSubscription(
    db
      .prepare(
        `SELECT s.*, p.name as plan_name, p.level as plan_level
         FROM subscriptions s JOIN plans p ON s.plan_id = p.id
         WHERE s.user_id = ?`,
      )
      .get(userId) as DbSubscription,
  );
}

/** Returns the user's active subscription or null. */
export function getActiveSubscription(userId: string): (DbSubscription & { plan_level: string }) | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT s.*, p.name as plan_name, p.level as plan_level
       FROM subscriptions s JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = ? AND s.status = 'active' AND s.expires_at > ?`,
    )
    .get(userId, Date.now()) as (DbSubscription & { plan_level: string }) | undefined;
  return row ?? null;
}

export function formatSubscription(row: DbSubscription): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    planName: row.plan_name,
    planLevel: planNameToLevel(row.plan_name),
    status: row.status as Subscription['status'],
    startedAt: new Date(row.started_at).toISOString(),
    expiresAt: new Date(row.expires_at).toISOString(),
  };
}
