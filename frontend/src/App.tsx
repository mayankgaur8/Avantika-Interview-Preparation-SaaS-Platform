import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import PageLayout from './components/layout/PageLayout';

// Pages
import Landing from './pages/Landing';
import { Login, Register } from './pages/Auth';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import LearningPaths from './pages/LearningPaths';
import DailyChallenge from './pages/DailyChallenge';
import MCQPractice from './pages/MCQPractice';
import CodingPractice from './pages/CodingPractice';
import SystemDesignLab from './pages/SystemDesignLab';
import AIInterview from './pages/AIInterview';
import MockInterview from './pages/MockInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Analytics from './pages/Analytics';
import Community from './pages/Community';
import Certifications from './pages/Certifications';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';

// ─── Route guards ─────────────────────────────────────────────────────────────

/**
 * Requires: authenticated + has chosen at least one plan (subscription not null).
 * Flow: Login → Select Plan (free or paid) → Dashboard
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, subscription } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!subscription) return <Navigate to="/pricing" replace />;
  return <>{children}</>;
}

/**
 * Blocks login/register pages for already-authenticated users.
 * If they have a subscription → dashboard; otherwise → pricing (force plan selection).
 */
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, subscription } = useStore();
  if (!isAuthenticated) return <>{children}</>;
  return <Navigate to={subscription ? '/dashboard' : '/pricing'} replace />;
}

// ─── Rehydrate user on first load ─────────────────────────────────────────────

function AppInit() {
  const { isAuthenticated, refreshUser } = useStore();
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser().catch(() => undefined);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

      {/* Protected — inside PageLayout */}
      <Route path="/" element={<ProtectedRoute><PageLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="daily" element={<DailyChallenge />} />
        <Route path="paths" element={<LearningPaths />} />
        <Route path="practice/mcq" element={<MCQPractice />} />
        <Route path="practice/coding" element={<CodingPractice />} />
        <Route path="practice/design" element={<SystemDesignLab />} />
        <Route path="interview/ai" element={<AIInterview />} />
        <Route path="interview/mock" element={<MockInterview />} />
        <Route path="resume" element={<ResumeAnalyzer />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="community" element={<Community />} />
        <Route path="certifications" element={<Certifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="jobs" element={<Jobs />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AppInit />
      <AppRoutes />
    </HashRouter>
  );
}

export default App;
