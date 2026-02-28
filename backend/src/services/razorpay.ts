import Razorpay from 'razorpay';
import { env } from '../config/env';
import { verifyPaymentSignature, verifyWebhookSignature } from '../../billing/src/verify';

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export function checkPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  return verifyPaymentSignature(orderId, paymentId, signature, env.RAZORPAY_KEY_SECRET);
}

export function checkWebhookSignature(rawBody: string, signature: string): boolean {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
  return verifyWebhookSignature(rawBody, signature, env.RAZORPAY_WEBHOOK_SECRET);
}
