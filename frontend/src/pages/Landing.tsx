import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Star, Zap, Code2, Brain,
  BarChart3, Award, Target, ChevronRight, Play,
  Sparkles, TrendingUp, Shield, Clock, Users, Linkedin,
  Menu, X as XClose,
} from 'lucide-react';
import logo from '../assets/logo.png';

// Inline SVGs for deprecated lucide icons
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

// ─── Static data ───────────────────────────────────────────────────────────────

const NAV_LINKS = ['Features', 'How it works', 'Domains', 'Pricing'];

const FEATURES = [
  { icon: Brain,     title: 'AI Interview Coach',   gradient: 'from-violet-500 to-purple-600', glow: 'group-hover:shadow-violet-500/20',  desc: 'Claude-powered mock interviews with real-time feedback on answers, tone, and technical depth.' },
  { icon: Code2,     title: 'Coding Playground',    gradient: 'from-blue-500 to-cyan-600',     glow: 'group-hover:shadow-blue-500/20',    desc: '5,000+ problems, multi-language editor, test cases, and AI code review — all in one tab.' },
  { icon: Zap,       title: 'Skill Gap Analyzer',   gradient: 'from-amber-500 to-orange-600',  glow: 'group-hover:shadow-amber-500/20',   desc: 'AI maps your weak areas to your target role and builds a personalized daily study plan.' },
  { icon: BarChart3, title: 'Progress Analytics',   gradient: 'from-emerald-500 to-teal-600',  glow: 'group-hover:shadow-emerald-500/20', desc: 'Streaks, skill radars, accuracy trends, and weekly scorecards to keep you motivated.' },
  { icon: Target,    title: 'Resume Analyzer',      gradient: 'from-pink-500 to-rose-600',     glow: 'group-hover:shadow-pink-500/20',    desc: 'ATS scoring, one-click bullet improvements, and keyword gap analysis. Offer-ready in minutes.' },
  { icon: Award,     title: 'Certifications',       gradient: 'from-cyan-500 to-sky-600',      glow: 'group-hover:shadow-cyan-500/20',    desc: 'Earn verifiable DSA, System Design & Frontend certs. One-click LinkedIn profile sync.' },
];

const STEPS = [
  { num: '01', emoji: '🎯', title: 'Create your profile',     desc: 'Tell us your target role, dream company, and timeline. Takes 30 seconds.' },
  { num: '02', emoji: '🗺️', title: 'Get your learning path',  desc: 'AI builds a personalized daily plan covering DSA, System Design, and MCQs.' },
  { num: '03', emoji: '🤖', title: 'Practice with AI coach',  desc: 'Mock interviews, code reviews, resume analysis — everything scored in real time.' },
  { num: '04', emoji: '🏆', title: 'Land your dream job',     desc: 'Match with top recruiters, track applications, and celebrate your offer.' },
];

const DOMAINS = [
  { emoji: '🧩', name: 'DSA & Algorithms', count: '5,000+', bg: 'from-blue-600/20 to-blue-600/5',       border: 'border-blue-500/30'    },
  { emoji: '🏗️', name: 'System Design',    count: '200+',   bg: 'from-violet-600/20 to-violet-600/5',   border: 'border-violet-500/30'  },
  { emoji: '☕', name: 'Java / Spring',     count: '450+',   bg: 'from-amber-600/20 to-amber-600/5',     border: 'border-amber-500/30'   },
  { emoji: '🐍', name: 'Python',           count: '380+',   bg: 'from-emerald-600/20 to-emerald-600/5', border: 'border-emerald-500/30' },
  { emoji: '⚛️', name: 'React & Frontend', count: '350+',   bg: 'from-cyan-600/20 to-cyan-600/5',       border: 'border-cyan-500/30'    },
  { emoji: '☁️', name: 'Cloud & AWS',      count: '320+',   bg: 'from-yellow-600/20 to-yellow-600/5',   border: 'border-yellow-500/30'  },
  { emoji: '🐳', name: 'Docker & K8s',     count: '200+',   bg: 'from-teal-600/20 to-teal-600/5',       border: 'border-teal-500/30'    },
  { emoji: '🤖', name: 'AI Engineering',   count: '150+',   bg: 'from-pink-600/20 to-pink-600/5',       border: 'border-pink-500/30'    },
];

const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Flipkart', 'Swiggy', 'Zomato', 'Razorpay', 'Atlassian', 'Adobe', 'Uber', 'Stripe', 'Paytm'];

const TESTIMONIALS = [
  { name: 'Riya Verma',  role: 'SDE2 @ Google',          avatar: 'RV', color: 'from-blue-500 to-cyan-500',     rating: 5, quote: 'The AI interview bot asked exactly the follow-up questions I faced in my real Google interview. Genuinely uncanny.' },
  { name: 'Karan Shah',  role: 'Senior SDE @ Amazon',     avatar: 'KS', color: 'from-violet-500 to-purple-600', rating: 5, quote: 'Went from 45% MCQ accuracy to 89% in 8 weeks. The personalized learning path was an absolute game changer.' },
  { name: 'Ananya Iyer', role: 'ML Engineer @ Microsoft', avatar: 'AI', color: 'from-emerald-500 to-teal-600',  rating: 5, quote: 'Resume analyzer helped me rewrite bullets with actual metrics. Got callbacks from 8 out of 10 applications!' },
];

const PLANS = [
  {
    name: 'Free', price: '₹0', period: '', cta: 'Get Started Free', link: '/register', highlight: false, badge: null,
    features: ['5 daily challenges', '50 MCQ questions', 'Basic learning paths', 'Community access', '1 mock interview / month'],
  },
  {
    name: 'Pro', price: '₹999', period: '/month', cta: 'Upgrade to Pro', link: '/pricing', highlight: true, badge: 'Most Popular',
    features: ['Unlimited MCQ + Coding', 'AI Interview Coach (unlimited)', 'Resume analyzer', 'System design lab', 'Analytics & reports', 'Certifications'],
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', cta: 'Contact Sales', link: '/pricing', highlight: false, badge: 'Teams',
    features: ['Everything in Pro', 'Team management (20 seats)', 'Custom learning paths', 'Dedicated account manager', 'White-label options', 'Priority 24/7 support'],
  },
];

// ─── Animated counter ──────────────────────────────────────────────────────────

function AnimatedCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const dur = 1800, start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        setCount(Math.floor((1 - Math.pow(1 - t, 3)) * end));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl sm:text-4xl font-black text-white tabular-nums">
        {count >= 1000 ? `${(count / 1000).toFixed(count >= 100000 ? 0 : 1)}K` : count}
        <span className="text-violet-400">{suffix}</span>
      </p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}

// ─── Section label pill ────────────────────────────────────────────────────────

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${color}`}>{children}</p>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── NAVBAR ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="Avantika" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-black text-lg text-white tracking-tight">Avantika</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Sign in
            </button>
            <button onClick={() => navigate('/register')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/25 flex items-center gap-1.5">
              Get started free <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(p => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XClose size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-1">
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                {l}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-slate-800 mt-3">
              <button onClick={() => { navigate('/login'); setMobileOpen(false); }}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
                Sign in
              </button>
              <button onClick={() => { navigate('/register'); setMobileOpen(false); }}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors">
                Get started free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-24 px-4 sm:px-6 dot-grid overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-40 left-[8%] w-[320px] h-[320px] bg-blue-600/12 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-32 right-[6%] w-[280px] h-[280px] bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8 fade-up">
            <Sparkles size={13} />
            AI-Powered Technical Interview Preparation
            <span className="px-1.5 py-0.5 text-xs font-bold rounded bg-violet-500/30 text-violet-200">NEW</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 fade-up" style={{ animationDelay: '0.1s' }}>
            Crack your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              dream tech job
            </span>
            <br />
            <span className="text-slate-300 text-4xl sm:text-5xl lg:text-6xl">with AI coaching</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed fade-up" style={{ animationDelay: '0.2s' }}>
            AI mock interviews · 5,000+ coding problems · system design labs · resume analysis.
            <br className="hidden sm:block" />
            Everything to take you from prep to placement.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 fade-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => navigate('/register')}
              className="group px-7 py-3.5 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2.5 text-base">
              Start for free — no credit card
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="px-7 py-3.5 rounded-xl font-semibold text-slate-300 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2.5 text-base">
              <Play size={14} fill="currentColor" className="text-slate-400" />
              Watch 2-min demo
            </button>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500 mb-16 fade-up" style={{ animationDelay: '0.35s' }}>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-500" /> Free forever plan</span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-500" /> No credit card required</span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-500" /> 75,000+ engineers trust us</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-16 fade-up" style={{ animationDelay: '0.4s' }}>
            <AnimatedCounter end={75}   suffix="K+" label="Active Learners" />
            <AnimatedCounter end={2400} suffix="K+" label="Problems Solved" />
            <AnimatedCounter end={12}   suffix="K+" label="Offers Received" />
            <AnimatedCounter end={500}  suffix="+"  label="Company Partners" />
          </div>

          {/* Dashboard preview */}
          <div className="relative max-w-4xl mx-auto float-slow fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-cyan-600/10 rounded-3xl blur-2xl" />
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser bar */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-800 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 text-center max-w-xs mx-auto">
                  app.avantika.io/dashboard
                </div>
              </div>

              {/* Preview cards */}
              <div className="p-5 grid grid-cols-3 gap-4 bg-slate-950/50">
                {/* Card 1 */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400 font-medium">Interview Readiness</span>
                    <TrendingUp size={12} className="text-green-400" />
                  </div>
                  <p className="text-3xl font-black text-white mb-2.5">72<span className="text-sm font-medium text-slate-500">%</span></p>
                  <div className="h-1.5 bg-slate-700 rounded-full">
                    <div className="h-full w-[72%] bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" />
                  </div>
                  <p className="text-xs text-green-400 mt-2">↑ 8% this week</p>
                </div>
                {/* Card 2 */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-3 font-medium">Current Streak</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔥</span>
                    <span className="text-3xl font-black text-white">14</span>
                    <span className="text-xs text-slate-500">days</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,1,1,1,1,0,1,1,1,1,1,1,1,1].map((d, i) => (
                      <div key={i} className={`flex-1 h-1.5 rounded-sm ${d ? 'bg-orange-400' : 'bg-slate-700'}`} />
                    ))}
                  </div>
                </div>
                {/* Card 3 */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-3 font-medium">Today's Tasks</p>
                  <div className="space-y-2">
                    {[
                      { t: 'Merge Intervals', done: true,  tag: 'DSA' },
                      { t: '5 Java MCQs',     done: false, tag: 'MCQ' },
                      { t: 'CAP Theorem',     done: false, tag: 'SD'  },
                    ].map(item => (
                      <div key={item.t} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${item.done ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                          {item.done && <CheckCircle2 size={9} className="text-white" />}
                        </div>
                        <span className={`text-xs flex-1 truncate ${item.done ? 'line-through text-slate-600' : 'text-slate-300'}`}>{item.t}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-700 text-slate-400 font-mono">{item.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANY MARQUEE ──────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-slate-800 bg-slate-900/50 overflow-hidden">
        <p className="text-center text-xs text-slate-600 font-semibold uppercase tracking-widest mb-6">
          Trusted by engineers at
        </p>
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <span key={i} className="mx-8 text-slate-500 hover:text-slate-300 font-bold text-sm tracking-wide transition-colors whitespace-nowrap cursor-default">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel color="text-violet-400">Features</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Everything you need to get hired
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              One platform. All the tools. From your first line of code to your final offer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title}
                className={`group bg-slate-900 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${f.glow}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─�� HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel color="text-emerald-400">How it works</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              From zero to offer in 4 steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.num}
                className="relative bg-slate-900 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-colors">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-[calc(100%+2px)] w-5 h-px bg-gradient-to-r from-slate-600 to-transparent z-10" />
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-xs font-bold text-slate-600 font-mono tracking-wider">STEP {s.num}</span>
                </div>
                <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS ──────────────────────────────────────────────────────────── */}
      <section id="domains" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel color="text-cyan-400">Domains</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Cover every domain
            </h2>
            <p className="text-slate-400 text-lg">Fresher to Staff Engineer — we have content for every level.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DOMAINS.map(d => (
              <div key={d.name}
                className={`group bg-gradient-to-br ${d.bg} border ${d.border} rounded-2xl p-5 text-center hover:-translate-y-1 transition-all duration-200 cursor-default`}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{d.emoji}</div>
                <div className="font-semibold text-white text-sm mb-1">{d.name}</div>
                <div className="text-xs text-slate-400">{d.count} questions</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel color="text-yellow-400">Success Stories</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Engineers love Avantika
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} onClick={() => setActiveTestimonial(i)}
                className={`bg-slate-900 rounded-2xl p-6 cursor-pointer transition-all duration-300 border
                  ${activeTestimonial === i
                    ? 'border-violet-500/60 shadow-xl shadow-violet-500/10 -translate-y-1'
                    : 'border-slate-700/60 hover:border-slate-600'}`}>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-violet-500 w-6' : 'bg-slate-700 w-1.5 hover:bg-slate-600'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel color="text-violet-400">Pricing</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400 text-lg">Start free. Upgrade when you're ready. All prices in INR.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {PLANS.map(plan => (
              <div key={plan.name}
                className={`relative rounded-2xl p-7 transition-all
                  ${plan.highlight
                    ? 'bg-gradient-to-b from-violet-950/70 to-slate-900 border-2 border-violet-500/50 shadow-2xl shadow-violet-500/15 md:scale-[1.04]'
                    : 'bg-slate-900 border border-slate-700/60 hover:border-slate-600'}`}>

                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap
                    ${plan.highlight ? 'bg-violet-500 text-white' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}>
                    {plan.badge}
                  </div>
                )}

                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-green-400 mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to={plan.link}
                  className={`block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all
                    ${plan.highlight
                      ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="relative py-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/60 via-slate-950 to-blue-950/40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full blur-[100px]" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-8">
            <Users size={13} /> Join 75,000+ engineers on their journey
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Ready to land your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              dream role?
            </span>
          </h2>
          <p className="text-slate-400 text-xl mb-10">Start free today. No credit card. No commitments.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')}
              className="group px-8 py-4 rounded-xl font-bold text-white text-base bg-violet-600 hover:bg-violet-500 shadow-2xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2.5">
              Create free account
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <Link to="/pricing"
              className="px-8 py-4 rounded-xl font-bold text-slate-300 text-base border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-all flex items-center justify-center">
              View all plans
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Avantika" className="w-8 h-8 rounded-lg object-contain" />
                <span className="font-black text-white text-lg">Avantika</span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                AI-powered interview prep for the modern software engineer.
              </p>
              <div className="flex gap-2">
                {([
                  { label: 'X',        el: <XIcon /> },
                  { label: 'LinkedIn', el: <Linkedin size={13} /> },
                  { label: 'GitHub',   el: <GithubIcon /> },
                ] as const).map(({ label, el }) => (
                  <a key={label} href="#" aria-label={label}
                    className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 transition-colors">
                    {el}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Domains', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal',   links: ['Privacy', 'Terms', 'Security', 'Status'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-slate-600">© 2026 Avantika Technologies Pvt. Ltd.</p>
            <p className="text-xs text-slate-700">Made with ❤️ for engineers in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
