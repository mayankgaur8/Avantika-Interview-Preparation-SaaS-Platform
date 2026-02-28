// ─────────────────────────────────────────────────────────────────────────────
// Shared billing types — used by backend AND frontend
// ─────────────────────────────────────────────────────────────────────────────

export type PlanLevel = 'free' | 'basic' | 'pro' | 'enterprise';

export interface Plan {
  id: string;
  name: string;
  /** Amount in paise (INR). 0 = free. */
  amount: number;
  currency: string;
  durationDays: number;
  features: string[];
  limits: Record<string, number>;
  active: boolean;
  level: PlanLevel;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  planLevel: PlanLevel;
  status: 'active' | 'expired' | 'cancelled';
  startedAt: string; // ISO
  expiresAt: string; // ISO
}

export interface PaymentRecord {
  id: string;
  userId: string;
  planId: string;
  orderId: string;
  paymentId?: string;
  signature?: string;
  /** Amount in paise */
  amount: number;
  status: 'created' | 'paid' | 'failed';
  /** Which app/site this payment belongs to */
  appName: string;
  createdAt: string;
}

// ─── Razorpay checkout (frontend) ────────────────────────────────────────────

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayPaymentSuccess) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

export interface RazorpayPaymentSuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ─── API payloads ─────────────────────────────────────────────────────────────

export interface CreateOrderRequest {
  planId: string;
  /** Injected by backend from env */
  appName?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  subscription: Subscription;
}

// ─── Plan hierarchy ───────────────────────────────────────────────────────────

export const PLAN_HIERARCHY: Record<PlanLevel, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
};

export function hasAccess(userLevel: PlanLevel, requiredLevel: PlanLevel): boolean {
  return PLAN_HIERARCHY[userLevel] >= PLAN_HIERARCHY[requiredLevel];
}

export function planNameToLevel(name: string): PlanLevel {
  const lower = name.toLowerCase();
  if (lower.includes('enterprise')) return 'enterprise';
  if (lower.includes('pro')) return 'pro';
  if (lower.includes('basic')) return 'basic';
  return 'free';
}
