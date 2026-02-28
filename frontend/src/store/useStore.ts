import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, setToken, clearToken, SubscriptionDTO } from '../services/api';
import type { PlanLevel } from '../hooks/useSubscription';

// ─────────────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: PlanLevel;
  streak: number;
  xp: number;
  level: number;
  interviewReadiness: number;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  subscription: SubscriptionDTO | null;

  // UI
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  activeNotifications: number;

  // Practice
  solvedProblems: string[];
  bookmarkedProblems: string[];
  enrolledPaths: string[];

  // Actions — Auth
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setSubscription: (sub: SubscriptionDTO | null) => void;
  refreshUser: () => Promise<void>;

  // Actions — UI
  toggleSidebar: () => void;
  toggleTheme: () => void;

  // Actions — Practice
  markProblemSolved: (id: string) => void;
  toggleBookmark: (id: string) => void;
  enrollPath: (pathId: string) => void;
  updateXP: (amount: number) => void;
}

// ─────────────────────────────────────────────────────────────────────────────

function makeUser(raw: { id: string; name: string; email: string }, sub: SubscriptionDTO | null): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.name.slice(0, 2).toUpperCase(),
    tier: sub?.planLevel ?? 'free',
    streak: 0,
    xp: 0,
    level: 1,
    interviewReadiness: 45,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      subscription: null,
      sidebarCollapsed: false,
      theme: 'dark',
      activeNotifications: 0,
      solvedProblems: [],
      bookmarkedProblems: [],
      enrolledPaths: [],

      // ── Auth ───────────────────────────────────────────────────────────────

      login: async (email, password) => {
        try {
          const res = await authApi.login(email, password);
          setToken(res.token);
          set({
            isAuthenticated: true,
            user: makeUser(res.user, res.subscription),
            subscription: res.subscription,
          });
          return { success: true };
        } catch (err) {
          return { success: false, error: (err as Error).message };
        }
      },

      register: async (name, email, password) => {
        try {
          const res = await authApi.register(name, email, password);
          setToken(res.token);
          set({
            isAuthenticated: true,
            user: makeUser(res.user, res.subscription),
            subscription: res.subscription,
          });
          return { success: true };
        } catch (err) {
          return { success: false, error: (err as Error).message };
        }
      },

      logout: () => {
        clearToken();
        set({ isAuthenticated: false, user: null, subscription: null });
      },

      setSubscription: (sub) => {
        set((state) => ({
          subscription: sub,
          user: state.user
            ? { ...state.user, tier: sub?.planLevel ?? 'free' }
            : null,
        }));
      },

      refreshUser: async () => {
        try {
          const { user, subscription } = await authApi.me();
          set({
            user: makeUser(user, subscription),
            subscription,
            isAuthenticated: true,
          });
        } catch {
          // Token expired / invalid — log out silently
          clearToken();
          set({ isAuthenticated: false, user: null, subscription: null });
        }
      },

      // ── UI ─────────────────────────────────────────────────────────────────

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', next === 'dark');
          return { theme: next };
        }),

      // ── Practice ───────────────────────────────────────────────────────────

      markProblemSolved: (id) => {
        set((s) => {
          if (s.solvedProblems.includes(id)) return s;
          return { solvedProblems: [...s.solvedProblems, id] };
        });
        get().updateXP(50);
      },

      toggleBookmark: (id) =>
        set((s) => ({
          bookmarkedProblems: s.bookmarkedProblems.includes(id)
            ? s.bookmarkedProblems.filter((b) => b !== id)
            : [...s.bookmarkedProblems, id],
        })),

      enrollPath: (pathId) =>
        set((s) => ({
          enrolledPaths: s.enrolledPaths.includes(pathId) ? s.enrolledPaths : [...s.enrolledPaths, pathId],
        })),

      updateXP: (amount) =>
        set((s) => {
          if (!s.user) return s;
          const newXP = s.user.xp + amount;
          return { user: { ...s.user, xp: newXP, level: Math.floor(newXP / 500) + 1 } };
        }),
    }),
    {
      name: 'avantika-store-v2', // v2: clears old mock-auth persisted state
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        user: s.user,
        subscription: s.subscription,
        theme: s.theme,
        enrolledPaths: s.enrolledPaths,
        solvedProblems: s.solvedProblems,
        bookmarkedProblems: s.bookmarkedProblems,
      }),
    },
  ),
);
