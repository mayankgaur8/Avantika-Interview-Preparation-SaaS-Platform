import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';
import { useStore } from '../store/useStore';
import logo from '../assets/logo.png';

// ─── Shared left panel ───────────────────────────────────────────────────────
const AuthPanel = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="hidden lg:flex flex-col justify-between flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-950/30 to-slate-900 border-r border-slate-800/60 px-14 py-12">
    {/* Background orbs */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

    {/* Logo */}
    <Link to="/" className="relative flex items-center gap-3 w-fit">
      <img src={logo} alt="Avantika" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-violet-500/20" />
      <div>
        <p className="font-black text-white text-lg leading-none">Avantika</p>
        <p className="text-xs text-violet-400 font-medium">Interview Prep</p>
      </div>
    </Link>

    {/* Hero text */}
    <div className="relative">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-medium mb-6">
        <Sparkles size={11} />
        AI-Powered Preparation
      </div>
      <h2 className="text-4xl font-black text-white leading-tight mb-4">{title}</h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-10">{subtitle}</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { value: '75K+', label: 'Active Learners', icon: '👥' },
          { value: '12K+', label: 'Offers Cracked',  icon: '🎉' },
          { value: '5K+',  label: 'Practice Problems', icon: '💻' },
          { value: '4.9★', label: 'Average Rating',  icon: '⭐' },
        ].map(s => (
          <div key={s.label} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Testimonial */}
    <div className="relative bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        "Avantika's AI mock interviews were eerily similar to my actual Google interview. Got the offer after just 6 weeks!"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">RV</div>
        <div>
          <p className="text-sm font-semibold text-white">Riya Verma</p>
          <p className="text-xs text-slate-500">SDE-2 @ Google</p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// LOGIN
// ============================================================
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useStore();
  const from = (location.state as { from?: string })?.from ?? '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email) { setError('Please enter your email'); return; }
    if (!form.password) { setError('Please enter your password'); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? 'Login failed. Check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AuthPanel
        title="Welcome back! Keep the momentum going."
        subtitle="Your personalized AI coach is ready. Pick up right where you left off."
      />

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Avantika" className="w-9 h-9 object-contain rounded-xl" />
              <span className="font-black text-white text-xl">Avantika</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Sign in</h1>
            <p className="text-slate-400">
              No account yet?{' '}
              <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Create one free →
              </Link>
            </p>
          </div>

          {/* Quick demo login hint */}
          <div className="flex items-start gap-2.5 bg-violet-500/8 border border-violet-500/20 rounded-xl px-4 py-3 mb-6 text-sm">
            <Sparkles size={14} className="text-violet-400 mt-0.5 shrink-0" />
            <p className="text-slate-300">
              <span className="font-semibold text-violet-300">Demo: </span>
              use any email + password to explore the platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={15} />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock size={15} />}
              iconRight={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {error && (
              <div className="flex items-center gap-2.5 text-sm text-red-400 bg-red-400/8 border border-red-400/20 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-violet-500" />
                Remember me
              </label>
              <a href="#" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-8">
            Protected by enterprise-grade security · SOC 2 compliant
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REGISTER
// ============================================================
export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'mid', targetRole: 'Senior Backend Engineer', targetCompany: 'Google', timeline: '3months',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.email.trim()) { setError('Email is required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setStep(2);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error ?? 'Registration failed. Please try again.');
      setStep(1);
    }
    setLoading(false);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-violet-400" />
              </div>
              Account
            </div>
            <div className="w-10 h-px bg-violet-500/30" />
            <div className="flex items-center gap-2 text-sm font-medium text-violet-300">
              <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">2</div>
              Your Goals
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Set your goals</h1>
            <p className="text-slate-400">Help us build your perfect learning path</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleComplete} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">Experience Level</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { value: 'fresher', label: '🎓 Fresher', desc: '0–1 year' },
                    { value: 'mid',     label: '💼 Mid-Level', desc: '2–5 years' },
                    { value: 'senior',  label: '🏆 Senior',    desc: '6–10 years' },
                    { value: 'staff',   label: '⭐ Staff+',    desc: '10+ years' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: opt.value })}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                        form.role === opt.value
                          ? 'border-violet-500/60 bg-violet-500/10 text-violet-300 shadow-sm shadow-violet-500/10'
                          : 'border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="text-sm font-semibold mb-0.5">{opt.label}</div>
                      <div className="text-xs opacity-60">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Target Role</label>
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/60 transition-all"
                  value={form.targetRole}
                  onChange={e => setForm({ ...form, targetRole: e.target.value })}
                >
                  {['Senior Backend Engineer','Senior Frontend Engineer','Full Stack Engineer','ML/AI Engineer','Cloud Architect','DevOps Engineer','Data Engineer'].map(r => (
                    <option key={r} value={r} className="bg-slate-800">{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2.5">Target Company</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Google','Amazon','Microsoft','Meta','Startup','Any'].map(co => (
                    <button
                      key={co}
                      type="button"
                      onClick={() => setForm({ ...form, targetCompany: co })}
                      className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        form.targetCompany === co
                          ? 'border-violet-500/60 bg-violet-500/10 text-violet-300'
                          : 'border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      {co}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Preparation Timeline</label>
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/60 transition-all"
                  value={form.timeline}
                  onChange={e => setForm({ ...form, timeline: e.target.value })}
                >
                  <option value="1month" className="bg-slate-800">⚡ 1 month — intensive sprint</option>
                  <option value="3months" className="bg-slate-800">⚖️ 3 months — balanced pace</option>
                  <option value="6months" className="bg-slate-800">🌿 6 months — comfortable journey</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 text-sm text-red-400 bg-red-400/8 border border-red-400/20 rounded-xl px-4 py-3">
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>🚀 Start My Journey</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AuthPanel
        title="Join 75,000+ engineers cracking top tech interviews."
        subtitle="AI-powered coaching, personalized learning paths, and real interview simulations."
      />

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Avantika" className="w-9 h-9 object-contain rounded-xl" />
              <span className="font-black text-white text-xl">Avantika</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Create your account</h1>
            <p className="text-slate-400">
              Already have one?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Sign in →
              </Link>
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-2 mb-7">
            {['Free forever plan — no credit card needed', 'Personalized AI learning path in 30 seconds', 'Instant access to 5,000+ practice problems'].map(perk => (
              <div key={perk} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                {perk}
              </div>
            ))}
          </div>

          <form onSubmit={handleStep1} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Avantika Sharma"
              icon={<User size={15} />}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={15} />}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Create password"
              type="password"
              placeholder="At least 6 characters"
              icon={<Lock size={15} />}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            {error && (
              <div className="flex items-center gap-2.5 text-sm text-red-400 bg-red-400/8 border border-red-400/20 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-600/25 transition-all duration-200 active:scale-[0.98] mt-2"
            >
              Continue <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            By creating an account you agree to our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400">Terms</a>
            {' & '}
            <a href="#" className="text-slate-500 hover:text-slate-400">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};
