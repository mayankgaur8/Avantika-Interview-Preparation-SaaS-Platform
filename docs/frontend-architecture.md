# Frontend Architecture & UI/UX Guide — Avantika Interview Preparation

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | React | 18.3 | UI library with concurrent features |
| **Language** | TypeScript | 5.4 | Type safety across codebase |
| **Styling** | Tailwind CSS | 3.4 | Utility-first styling |
| **Build Tool** | Vite | 5.2 | Ultra-fast bundler |
| **State** | Zustand | 4.5 | Lightweight global state |
| **Server State** | TanStack Query | 5.0 | API caching, sync, refetch |
| **Routing** | React Router | 6.23 | Client-side routing |
| **Forms** | React Hook Form + Zod | Latest | Forms + validation |
| **Code Editor** | Monaco Editor | 0.48 | VS Code-powered IDE |
| **Charts** | Recharts | 2.12 | Analytics visualizations |
| **Animations** | Framer Motion | 11.2 | Smooth UI transitions |
| **Icons** | Lucide React | 0.378 | Consistent icon set |
| **Whiteboard** | Excalidraw | 0.17 | System design canvas |
| **Markdown** | React Markdown + rehype | Latest | Content rendering |
| **Testing** | Vitest + Playwright | Latest | Unit + E2E testing |
| **Linting** | ESLint + Prettier | Latest | Code quality |

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Root app component
│   ├── Router.tsx                 # Route definitions
│   └── providers/
│       ├── QueryProvider.tsx      # TanStack Query setup
│       ├── AuthProvider.tsx       # Auth context
│       ├── ThemeProvider.tsx      # Dark/light mode
│       └── ToastProvider.tsx      # Toast notifications
│
├── pages/                         # Route-level components
│   ├── Landing/
│   │   ├── LandingPage.tsx
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CompanyLogos.tsx
│   │   └── index.ts
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Onboarding.tsx
│   │   └── ForgotPassword.tsx
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   └── components/
│   │       ├── WelcomeCard.tsx
│   │       ├── StreakCard.tsx
│   │       ├── TodayTasks.tsx
│   │       ├── RecentActivity.tsx
│   │       └── QuickActions.tsx
│   ├── LearningPaths/
│   │   ├── PathsList.tsx
│   │   ├── PathDetail.tsx
│   │   ├── ModuleViewer.tsx
│   │   └── VideoPlayer.tsx
│   ├── Practice/
│   │   ├── MCQ/
│   │   │   ├── MCQPractice.tsx
│   │   │   ├── QuizSession.tsx
│   │   │   └── QuizResult.tsx
│   │   ├── Coding/
│   │   │   ├── ProblemList.tsx
│   │   │   ├── ProblemDetail.tsx  # Main coding page
│   │   │   ├── CodeEditor.tsx     # Monaco wrapper
│   │   │   └── TestResults.tsx
│   │   └── SystemDesign/
│   │       ├── DesignProblemList.tsx
│   │       ├── DesignStudio.tsx   # Excalidraw + AI
│   │       └── ReferenceArch.tsx
│   ├── Interview/
│   │   ├── AIInterview/
│   │   │   ├── InterviewSetup.tsx
│   │   │   ├── InterviewSession.tsx
│   │   │   └── InterviewReport.tsx
│   │   └── MockInterview/
│   │       ├── ScheduleInterview.tsx
│   │       ├── InterviewRoom.tsx  # WebRTC + code
│   │       └── Scorecard.tsx
│   ├── Resume/
│   │   ├── ResumeUpload.tsx
│   │   ├── ResumeAnalysis.tsx
│   │   └── ResumeSuggestions.tsx
│   ├── Analytics/
│   │   ├── ProgressDashboard.tsx
│   │   ├── SkillGapReport.tsx
│   │   └── InterviewHistory.tsx
│   ├── Community/
│   │   ├── Forum.tsx
│   │   ├── PostDetail.tsx
│   │   └── CreatePost.tsx
│   ├── Certifications/
│   │   ├── CertList.tsx
│   │   ├── CertExam.tsx
│   │   └── CertViewer.tsx
│   └── Admin/
│       ├── AdminDashboard.tsx
│       ├── UserManagement.tsx
│       └── ContentManagement.tsx
│
├── components/                    # Shared, reusable components
│   ├── ui/                        # Design system primitives
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.stories.tsx
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Tabs/
│   │   ├── Badge/
│   │   ├── Progress/
│   │   ├── Skeleton/
│   │   ├── Tooltip/
│   │   ├── Dropdown/
│   │   └── Table/
│   ├── layout/
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   └── SidebarItem.tsx
│   │   └── PageLayout.tsx
│   ├── editor/
│   │   ├── CodeEditor.tsx         # Monaco Editor wrapper
│   │   ├── LanguageSelector.tsx
│   │   └── EditorTheme.ts
│   ├── charts/
│   │   ├── SkillRadar.tsx         # Skill gap radar chart
│   │   ├── ProgressCalendar.tsx   # GitHub-style heatmap
│   │   ├── AcceptanceRate.tsx
│   │   └── PerformanceLine.tsx
│   └── ai/
│       ├── AIChat.tsx             # Streaming chat component
│       ├── AITypingIndicator.tsx
│       └── TokenUsage.tsx
│
├── features/                      # Zustand store slices
│   ├── auth/
│   │   ├── authStore.ts
│   │   └── authSelectors.ts
│   ├── practice/
│   │   ├── practiceStore.ts
│   │   └── codeEditorStore.ts
│   ├── interview/
│   │   └── interviewStore.ts
│   └── ui/
│       └── uiStore.ts             # Modals, sidebar state
│
├── hooks/                         # Custom React hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useWebSocket.ts
│   ├── useAIStream.ts             # SSE streaming hook
│   └── useKeyboardShortcut.ts
│
├── services/                      # API service functions
│   ├── api.ts                     # Axios base instance
│   ├── authService.ts
│   ├── practiceService.ts
│   ├── learningService.ts
│   ├── aiService.ts
│   ├── analyticsService.ts
│   └── interviewService.ts
│
├── utils/
│   ├── formatters.ts              # Date, number, duration
│   ├── validators.ts              # Input validation
│   ├── constants.ts               # App-wide constants
│   └── helpers.ts
│
└── styles/
    ├── globals.css
    └── tailwind.config.ts
```

---

## Design System

### Color Palette

```typescript
// tailwind.config.ts - Custom colors
const colors = {
  // Brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    400: '#60a5fa',
    500: '#3b82f6',    // Primary blue
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },

  // Difficulty levels
  difficulty: {
    easy: '#22c55e',       // Green
    medium: '#f59e0b',     // Amber
    hard: '#ef4444',       // Red
    expert: '#8b5cf6',     // Purple
  },

  // Status colors
  status: {
    accepted: '#22c55e',
    wrong: '#ef4444',
    tle: '#f59e0b',
    mle: '#f59e0b',
    error: '#ef4444',
  },

  // Neutral
  surface: {
    50: '#f8fafc',
    100: '#f1f5f9',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  }
};
```

### Typography Scale

```typescript
// Font: Inter (UI) + JetBrains Mono (Code)
const typography = {
  'display-xl': ['3.75rem', { lineHeight: '1', fontWeight: '800' }],
  'display-lg': ['3rem',    { lineHeight: '1.1', fontWeight: '700' }],
  'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
  'h2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
  'h3': ['1.5rem',  { lineHeight: '1.4', fontWeight: '600' }],
  'body-lg': ['1.125rem', { lineHeight: '1.75' }],
  'body': ['1rem', { lineHeight: '1.6' }],
  'body-sm': ['0.875rem', { lineHeight: '1.5' }],
  'code': ['0.875rem', { fontFamily: 'JetBrains Mono, monospace' }],
};
```

### Component Design Standards

```typescript
// Button component example
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

// Consistent spacing scale: 4px base unit
// Border radius: sm=4px, md=8px, lg=12px, xl=16px, full=9999px
// Shadow: sm, md, lg, xl, 2xl (progressive elevation)
```

---

## Key Page Layouts

### Main Coding Page (`/practice/coding/:slug`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Navbar: Logo | Problem Title | Timer | Submit | AI Review(Pro)  │
├─────────────────────────┬───────────────────────────────────────┤
│  PROBLEM PANEL (40%)    │  EDITOR PANEL (60%)                   │
│                         │                                       │
│  ┌───────────────────┐  │  [Language: Java ▼] [Theme ▼] [...]  │
│  │ Description       │  │  ┌─────────────────────────────────┐ │
│  │ Examples          │  │  │                                 │ │
│  │ Constraints       │  │  │   Monaco Code Editor            │ │
│  │ Companies: Google │  │  │                                 │ │
│  │ Difficulty: Med   │  │  │                                 │ │
│  └───────────────────┘  │  └─────────────────────────────────┘ │
│                         │                                       │
│  [Description][Hints]   │  ─────── Test Cases ──────────────── │
│  [Solutions][Discussion]│  [Run ▶] [Submit ✓]                  │
│                         │  Test 1: ✓  Test 2: ✓  Test 3: ✗    │
│  Hints (Pro):           │  Expected: [0,1]  Got: [1,0]         │
│  💡 Try hash map...     │                                       │
└─────────────────────────┴───────────────────────────────────────┘
```

### AI Interview Session

```
┌─────────────────────────────────────────────────────────────────┐
│  AI Interview | System Design | Senior Level | 38:00 remaining   │
├──────────────────────────────────┬──────────────────────────────┤
│  CONVERSATION (55%)              │  WORKSPACE (45%)             │
│                                  │                              │
│  🤖 AI Interviewer               │  [Whiteboard] [Code] [Notes] │
│  ┌─────────────────────────────┐ │  ┌──────────────────────┐   │
│  │ "Design a URL shortener     │ │  │                      │   │
│  │  like bit.ly that can       │ │  │   Excalidraw Canvas   │   │
│  │  handle 100M requests/day"  │ │  │   (drag components)   │   │
│  └─────────────────────────────┘ │  │                      │   │
│                                  │  └──────────────────────┘   │
│  👤 You                          │                              │
│  ┌─────────────────────────────┐ │  Reference: Load Balancer   │
│  │ "I'd start by clarifying    │ │  [Drag] [DB] [Cache] [Q]    │
│  │  the requirements..."       │ │                              │
│  └─────────────────────────────┘ │  AI Feedback (live):        │
│                                  │  ✅ Good: Asking clarifying  │
│  ┌─────────────────────────────┐ │  💡 Tip: Mention CAP theorem │
│  │ Type your response...       │ │                              │
│  │                      [Send] │ │  [End Interview]            │
│  └─────────────────────────────┘ │                              │
└──────────────────────────────────┴──────────────────────────────┘
```

### Analytics Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Progress Analytics | This Week ▼                               │
├────────────────────────┬────────────────────────────────────────┤
│  OVERVIEW CARDS        │  ACTIVITY HEATMAP                      │
│  ┌────────┐ ┌────────┐ │  Mon Tue Wed Thu Fri Sat Sun           │
│  │  72    │ │  847   │ │  ■■  ■■■ ■   ■■■ ■■■ ■   □           │
│  │  Ready │ │  XP    │ │  (GitHub-style contribution graph)     │
│  └────────┘ └────────┘ │                                       │
│  ┌────────┐ ┌────────┐ │  SKILL RADAR CHART                    │
│  │  7 🔥  │ │  92%   │ │  ┌──────────────────────────────────┐ │
│  │ Streak │ │ MCQ Acc│ │  │  DSA ──────────────── 78%        │ │
│  └────────┘ └────────┘ │  │  System Design ─────── 55%       │ │
│                        │  │  Java ──────────────── 88%       │ │
│  TOPIC BREAKDOWN       │  │  Cloud ─────────────── 42%       │ │
│  Arrays:    ████ 85%   │  │  Behavioral ────────── 70%       │ │
│  Trees:     ██░ 60%    │  └─���────────────────────────────────┘ │
│  Graphs:    █░░ 35%    │                                       │
│  DP:        ██░ 55%    │  INTERVIEW PERFORMANCE TREND           │
│                        │  Score: ────────▲──────               │
│  [View Full Report]    │  8 ──────────────────────             │
│                        │  6 ────── ──────────────             │
│                        │      Jan  Feb  Mar  Apr               │
└────────────────────────┴────────────────────────────────────────┘
```

---

## State Management Pattern

### Zustand Store Example

```typescript
// features/practice/codeEditorStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CodeEditorState {
  code: Record<string, string>;         // code per language
  language: string;
  theme: 'vs-dark' | 'light';
  testResults: TestResult[];
  isRunning: boolean;
  isSubmitting: boolean;

  actions: {
    setCode: (language: string, code: string) => void;
    setLanguage: (lang: string) => void;
    setResults: (results: TestResult[]) => void;
    resetEditor: () => void;
  };
}

export const useCodeEditorStore = create<CodeEditorState>()(
  immer((set) => ({
    code: {},
    language: 'java',
    theme: 'vs-dark',
    testResults: [],
    isRunning: false,
    isSubmitting: false,

    actions: {
      setCode: (language, code) =>
        set((state) => { state.code[language] = code; }),
      setLanguage: (lang) =>
        set((state) => { state.language = lang; }),
      setResults: (results) =>
        set((state) => { state.testResults = results; }),
      resetEditor: () =>
        set((state) => {
          state.testResults = [];
          state.isRunning = false;
          state.isSubmitting = false;
        }),
    },
  }))
);
```

---

## AI Streaming Implementation

```typescript
// hooks/useAIStream.ts
import { useState, useCallback } from 'react';

export function useAIStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (
    sessionId: string,
    userMessage: string
  ) => {
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: Date.now() }]);
    setIsStreaming(true);

    try {
      const response = await fetch(`/v1/ai/interview/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'token') {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content += data.content;
                return updated;
              });
            }
          }
        }
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { messages, isStreaming, sendMessage };
}
```

---

## Performance Optimization

### Code Splitting Strategy

```typescript
// Router.tsx — All major routes lazy loaded
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ProblemDetail = lazy(() => import('./pages/Practice/Coding/ProblemDetail'));
const AIInterview = lazy(() => import('./pages/Interview/AIInterview/InterviewSession'));
const SystemDesign = lazy(() => import('./pages/Practice/SystemDesign/DesignStudio'));

// Heavy libraries loaded only when needed:
// Monaco Editor: only on coding pages
// Excalidraw: only on design pages
// Recharts: only on analytics pages
```

### Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| FID (First Input Delay) | < 100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| Bundle Size (initial) | < 200KB gzipped | Vite bundle analyzer |
| Time to Interactive | < 3.5s | Lighthouse |

### PWA Configuration

```typescript
// vite.config.ts - PWA Plugin
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      { urlPattern: /^https:\/\/api\.avantika\.io\/v1\/practice\/problems/, handler: 'CacheFirst', options: { cacheName: 'problems-cache', expiration: { maxAgeSeconds: 60 * 60 * 24 } } },
      { urlPattern: /^https:\/\/cdn\.avantika\.io\//, handler: 'CacheFirst', options: { cacheName: 'cdn-cache', expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 } } }
    ]
  }
})
```

---

## Accessibility Standards

- **WCAG 2.1 AA compliance** across all pages
- All interactive elements keyboard-navigable
- Screen reader announcements for AI streaming text
- Color contrast ratio ≥ 4.5:1 for all text
- Focus indicators clearly visible
- Code editor: syntax highlighting with color-blind safe palette
- Skip navigation links on all pages

---

## Testing Strategy

```
Unit Tests (Vitest):
  - All utility functions
  - Zustand store actions
  - API service functions
  - React hook logic

Component Tests (Vitest + Testing Library):
  - All UI primitives (Button, Input, Modal)
  - Complex components (CodeEditor, AIChat)
  - Form validation

E2E Tests (Playwright):
  - User registration + onboarding flow
  - Problem submission flow
  - AI interview start → message → report flow
  - Payment + subscription flow
  - Resume upload + analysis flow

Coverage Target: > 75% on core business logic
```

---

*Frontend Architecture v1.0 | Frontend Engineering Team — Avantika Platform*
