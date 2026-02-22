import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { currentUser } from '../data/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  tier: 'free' | 'pro' | 'enterprise';
  streak: number;
  xp: number;
  level: number;
  interviewReadiness: number;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;

  // UI
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  activeNotifications: number;

  // Practice
  solvedProblems: Set<string>;
  bookmarkedProblems: Set<string>;

  // Learning
  enrolledPaths: string[];

  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  markProblemSolved: (id: string) => void;
  toggleBookmark: (id: string) => void;
  enrollPath: (pathId: string) => void;
  updateXP: (amount: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      sidebarCollapsed: false,
      theme: 'dark',
      activeNotifications: 3,
      solvedProblems: new Set(['p1', 'p6']),
      bookmarkedProblems: new Set(['p3', 'p5']),
      enrolledPaths: ['lp1', 'lp2'],

      login: (email: string, _password: string) => {
        // Mock auth — any email/password works
        if (email) {
          set({
            isAuthenticated: true,
            user: {
              ...currentUser,
              tier: 'pro',
            },
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      },

      markProblemSolved: (id: string) => {
        set((state) => {
          const solved = new Set(state.solvedProblems);
          solved.add(id);
          return { solvedProblems: solved };
        });
        get().updateXP(50);
      },

      toggleBookmark: (id: string) => {
        set((state) => {
          const bookmarks = new Set(state.bookmarkedProblems);
          if (bookmarks.has(id)) bookmarks.delete(id);
          else bookmarks.add(id);
          return { bookmarkedProblems: bookmarks };
        });
      },

      enrollPath: (pathId: string) => {
        set((state) => ({
          enrolledPaths: state.enrolledPaths.includes(pathId)
            ? state.enrolledPaths
            : [...state.enrolledPaths, pathId],
        }));
      },

      updateXP: (amount: number) => {
        set((state) => {
          if (!state.user) return state;
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 500) + 1;
          return {
            user: { ...state.user, xp: newXP, level: newLevel },
          };
        });
      },
    }),
    {
      name: 'avantika-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        theme: state.theme,
        enrolledPaths: state.enrolledPaths,
      }),
    }
  )
);
