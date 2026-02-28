// ─────────────────────────────────────────────────────────────────────────────
// Mock auth — no backend required. Stores accounts in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'avantika_token';
const ACCOUNTS_KEY = 'avantika_accounts';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Stored account shape ─────────────────────────────────────────────────────

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // simple btoa encode (good enough for a demo)
}

function getAccounts(): StoredAccount[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]') as StoredAccount[];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function makeToken(userId: string): string {
  // Fake JWT-shaped token stored in localStorage
  return btoa(JSON.stringify({ sub: userId, iat: Date.now() }));
}

function mockSub(): SubscriptionDTO {
  return {
    id: 'sub_free',
    planId: 'free',
    planName: 'Free',
    planLevel: 'free',
    status: 'active',
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

function delay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Auth API (mock) ──────────────────────────────────────────────────────────

export const authApi = {
  register: async (name: string, email: string, _password: string): Promise<AuthResponse> => {
    await delay();
    const accounts = getAccounts();
    if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newAccount: StoredAccount = {
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash: btoa(_password),
    };
    saveAccounts([...accounts, newAccount]);
    const token = makeToken(newAccount.id);
    return { token, user: { id: newAccount.id, name, email }, subscription: mockSub() };
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay();
    const accounts = getAccounts();
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!account || account.passwordHash !== btoa(password)) {
      throw new Error('Incorrect email or password. Please try again.');
    }
    const token = makeToken(account.id);
    return { token, user: { id: account.id, name: account.name, email: account.email }, subscription: mockSub() };
  },

  me: async (): Promise<{ user: AuthResponse['user']; subscription: SubscriptionDTO | null }> => {
    await delay(200);
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    try {
      const { sub } = JSON.parse(atob(token)) as { sub: string };
      const account = getAccounts().find((a) => a.id === sub);
      if (!account) throw new Error('User not found');
      return { user: { id: account.id, name: account.name, email: account.email }, subscription: mockSub() };
    } catch {
      throw new Error('Invalid session');
    }
  },
};

// ─── Plans (mock) ─────────────────────────────────────────────────────────────

export interface PlanDTO {
  id: string;
  name: string;
  level: 'free' | 'basic' | 'pro' | 'enterprise';
  amount: number;
  currency: string;
  durationDays: number;
  features: string[];
  limits: Record<string, number>;
}

const MOCK_PLANS: PlanDTO[] = [
  { id: 'free', name: 'Free', level: 'free', amount: 0, currency: 'INR', durationDays: 365,
    features: ['5 daily challenges', '50 MCQ questions', 'Basic learning paths', 'Community access'],
    limits: { mcq: 50, coding: 5, aiInterview: 1 } },
  { id: 'pro', name: 'Pro', level: 'pro', amount: 99900, currency: 'INR', durationDays: 30,
    features: ['Unlimited MCQ + Coding', 'AI Interview Coach', 'Resume analyzer', 'Certifications'],
    limits: { mcq: -1, coding: -1, aiInterview: -1 } },
  { id: 'enterprise', name: 'Enterprise', level: 'enterprise', amount: 0, currency: 'INR', durationDays: 365,
    features: ['Everything in Pro', 'Team management', 'Custom learning paths', 'Priority support'],
    limits: { mcq: -1, coding: -1, aiInterview: -1 } },
];

export const plansApi = {
  list: async (): Promise<{ plans: PlanDTO[] }> => {
    await delay(300);
    return { plans: MOCK_PLANS };
  },
};

// ─── Payments (mock) ──────────────────────────────────────────────────────────

export const paymentsApi = {
  createOrder: async (_planId: string) => {
    await delay(400);
    return { orderId: `order_mock_${Date.now()}`, amount: 99900, currency: 'INR', keyId: 'rzp_test_mock' };
  },

  verify: async (_data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId: string;
  }): Promise<{ success: boolean; subscription: SubscriptionDTO }> => {
    await delay(400);
    return { success: true, subscription: mockSub() };
  },

  activateFree: async (_planId: string): Promise<{ success: boolean; subscription: SubscriptionDTO }> => {
    await delay(300);
    return { success: true, subscription: mockSub() };
  },

  mySubscription: async (): Promise<{ subscription: SubscriptionDTO | null }> => {
    await delay(200);
    return { subscription: mockSub() };
  },
};
