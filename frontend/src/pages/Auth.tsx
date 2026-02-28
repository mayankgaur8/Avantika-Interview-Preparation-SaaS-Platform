import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';
import { useStore } from '../store/useStore';
import logo from '../assets/logo.png';

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
      {/* Left — decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 border-r border-slate-800 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="relative text-center px-12">
          <img src={logo} alt="Avantika" className="w-20 h-20 object-contain mx-auto mb-6 rounded-xl" />
          <h2 className="text-3xl font-black text-white mb-4">Welcome back!</h2>
          <p className="text-slate-400 text-lg">Continue your interview preparation journey.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-center">
            {[
              { value: '75K+', label: 'Learners' },
              { value: '12K+', label: 'Offers' },
              { value: '5K+', label: 'Problems' },
              { value: '4.9★', label: 'Rating' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-800/50 rounded-xl p-4">
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img src={logo} alt="Avantika" className="w-8 h-8 object-contain rounded-md" />
              <span className="font-bold text-white">Avantika</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Sign in to your account</h1>
            <p className="text-slate-400 mt-1">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300">Sign up free</Link>
            </p>
          </div>

          <Card>
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
                  <button type="button" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" />
                  Remember me
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300">Forgot password?</a>
              </div>

              <Button type="submit" className="w-full" loading={loading} iconRight={<ArrowRight size={16} />}>
                Sign in
              </Button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300">Create one free</Link>
            </p>
          </Card>
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Set your goals</h1>
            <p className="text-slate-400 mt-1">Help us personalize your experience</p>
          </div>

          <Card>
            <form onSubmit={handleComplete} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'fresher', label: '🎓 Fresher', desc: '0-1 year' },
                    { value: 'mid', label: '💼 Mid-Level', desc: '2-5 years' },
                    { value: 'senior', label: '🏆 Senior', desc: '6-10 years' },
                    { value: 'staff', label: '⭐ Staff+', desc: '10+ years' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: opt.value })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        form.role === opt.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-xs opacity-70">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
                <select
                  className="input-base"
                  value={form.targetRole}
                  onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                >
                  {['Senior Backend Engineer', 'Senior Frontend Engineer', 'Full Stack Engineer', 'ML/AI Engineer', 'Cloud Architect', 'DevOps Engineer', 'Data Engineer'].map((r) => (
                    <option key={r} value={r} className="bg-slate-800">{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Company</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Google', 'Amazon', 'Startup', 'Europe', 'Any'].map((co) => (
                    <button
                      key={co}
                      type="button"
                      onClick={() => setForm({ ...form, targetCompany: co })}
                      className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                        form.targetCompany === co
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {co}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Timeline</label>
                <select
                  className="input-base"
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                >
                  <option value="1month" className="bg-slate-800">1 month (intensive)</option>
                  <option value="3months" className="bg-slate-800">3 months (balanced)</option>
                  <option value="6months" className="bg-slate-800">6 months (comfortable)</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" loading={loading} iconRight={<ArrowRight size={16} />}>
                Start My Journey 🚀
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="Avantika" className="w-8 h-8 object-contain rounded-md" />
            <span className="font-bold text-white">Avantika</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your free account</h1>
          <p className="text-slate-400 mt-1">
            Already have one?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleStep1} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Avantika Sharma"
              icon={<User size={15} />}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={15} />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Create password"
              type="password"
              placeholder="Min 6 characters"
              icon={<Lock size={15} />}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" iconRight={<ArrowRight size={16} />}>
              Continue →
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            By creating an account, you agree to our Terms of Service & Privacy Policy
          </p>
        </Card>
      </div>
    </div>
  );
};
