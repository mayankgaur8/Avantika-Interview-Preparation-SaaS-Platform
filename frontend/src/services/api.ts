// ─────────────────────────────────────────────────────────────────────────────
// API client — thin fetch wrapper with automatic JWT injection
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001/api';

const TOKEN_KEY = 'avantika_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Handle empty responses (e.g. 204)
  const text = await res.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};

  if (!res.ok) {
    throw new Error((data['error'] as string) || `Request failed: ${res.status}`);
  }
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
  subscription: SubscriptionDTO | null;
}

export interface SubscriptionDTO {
  id: string;
  planId: string;
  planName: string;
  planLevel: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  startedAt: string;
  expiresAt: string;
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    request<{ user: AuthResponse['user']; subscription: SubscriptionDTO | null }>('/auth/me'),
};

// ─── Plans ────────────────────────────────────────────────────────────────────

export interface PlanDTO {
  id: string;
  name: string;
  level: 'free' | 'basic' | 'pro' | 'enterprise';
  amount: number; // paise
  currency: string;
  durationDays: number;
  features: string[];
  limits: Record<string, number>;
}

export const plansApi = {
  list: () => request<{ plans: PlanDTO[] }>('/plans'),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentsApi = {
  createOrder: (planId: string) =>
    request<{ orderId: string; amount: number; currency: string; keyId: string }>(
      '/payments/create-order',
      { method: 'POST', body: JSON.stringify({ planId }) },
    ),

  verify: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId: string;
  }) =>
    request<{ success: boolean; subscription: SubscriptionDTO }>(
      '/payments/verify',
      { method: 'POST', body: JSON.stringify(data) },
    ),

  activateFree: (planId: string) =>
    request<{ success: boolean; subscription: SubscriptionDTO }>(
      '/payments/activate-free',
      { method: 'POST', body: JSON.stringify({ planId }) },
    ),

  mySubscription: () =>
    request<{ subscription: SubscriptionDTO | null }>('/payments/my-subscription'),
};
