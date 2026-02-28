import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Star, Zap, Code2, Brain,
  BarChart3, Award, Target, ChevronRight, Play,
  Sparkles, TrendingUp, Shield, Clock, Users, Linkedin,
} from 'lucide-react';

// Inline SVGs for social icons (lucide Twitter/Github are deprecated)
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
import logo from '../assets/logo.png';

// ─── static data ──────────────────────────────────────────────────────────────

const features = [
  { icon: Brain,    title: 'AI Interview Coach',   desc: 'Claude-powered mock interviewer. Real-world questions, real-time feedback on depth, tone, and accuracy.',       gradient: 'from-blue-600 to-cyan-500',     glow: 'hover:shadow-blue-500/20' },
  { icon: Code2,    title: 'Coding Playground',    desc: '5,000+ problems, multi-language editor, test cases, and AI code review — all in one tab.',                     gradient: 'from-emerald-600 to-teal-500',  glow: 'hover:shadow-emerald-500/20' },
  { icon: Zap,      title: 'Skill Gap Analyzer',   desc: 'AI maps your weak areas to your target role. Tells you exactly what to study next, every day.',                gradient: 'from-yellow-500 to-orange-500', glow: 'hover:shadow-yellow-500/20' },
  { icon: BarChart3,title: 'Progress Analytics',   desc: 'Streaks, skill radars, accuracy trends, and weekly score cards — data that keeps you motivated.',              gradient: 'from-purple-600 to-violet-500', glow: 'hover:shadow-purple-500/20' },
  { icon: Target,   title: 'Resume Analyzer',      desc: 'ATS scoring, one-click bullet improvements, keyword gap fix. From upload to offer-ready in minutes.',          gradient: 'from-pink-600 to-rose-500',     glow: 'hover:shadow-pink-500/20' },
  { icon: Award,    title: 'Certifications',       desc: 'Earn verifiable DSA, System Design & Frontend certs. One-click sync to your LinkedIn profile.',                gradient: 'from-cyan-600 to-sky-500',      glow: 'hover:shadow-cyan-500/20' },
];

const domains = [
  { icon: '🧩', name: 'DSA & Algorithms', count: '5,000+', bg: 'from-blue-500/15 to-cyan-500/5    border-blue-500/20' },
  { icon: '🏗️', name: 'System Design',    count: '200+',   bg: 'from-purple-500/15 to-violet-500/5 border-purple-500/20' },
  { icon: '☕', name: 'Java / Spring',     count: '450+',   bg: 'from-orange-500/15 to-amber-500/5  border-orange-500/20' },
  { icon: '🐍', name: 'Python',           count: '380+',   bg: 'from-emerald-500/15 to-teal-500/5  border-emerald-500/20' },
  { icon: '⚛️', name: 'React & Frontend', count: '350+',   bg: 'from-sky-500/15 to-blue-500/5      border-sky-500/20' },
  { icon: '☁️', name: 'Cloud & AWS',      count: '320+',   bg: 'from-yellow-500/15 to-amber-500/5  border-yellow-500/20' },
  { icon: '🐳', name: 'Docker & K8s',     count: '200+',   bg: 'from-cyan-500/15 to-teal-500/5     border-cyan-500/20' },
  { icon: '🤖', name: 'AI Engineering',   count: '150+',   bg: 'from-pink-500/15 to-rose-500/5     border-pink-500/20' },
];

const companies = ['Google','Amazon','Microsoft','Meta','Apple','Netflix','Flipkart','Swiggy','Zomato','Razorpay','Atlassian','Adobe','Uber','Stripe','Paytm'];

const testimonials = [
  { name: 'Riya Verma',  role: 'SDE2 @ Google',          avatar: 'RV', color: 'from-blue-600 to-cyan-500',    rating: 5, text: 'The AI interview bot is uncannily realistic. It asked exactly the follow-up questions I faced in my actual Google interview.' },
  { name: 'Karan Shah',  role: 'Senior SDE @ Amazon',     avatar: 'KS', color: 'from-purple-600 to-pink-500',  rating: 5, text: 'Went from 45% MCQ accuracy to 89% in 8 weeks. The personalized learning path was a complete game changer for me.' },
  { name: 'Ananya Iyer', role: 'ML Engineer @ Microsoft', avatar: 'AI', color: 'from-emerald-600 to-teal-500', rating: 5, text: 'Resume analyzer helped me rewrite bullet points with actual metrics. Got callbacks from 8 of 10 applications!' },
];

const steps = [
  { step: '01', icon: '🎯', title: 'Create your account',      desc: 'Sign up free in 30 seconds. Set your target role, company, and timeline.' },
  { step: '02', icon: '🗺️', title: 'Follow your learning path', desc: 'AI-curated daily plan. DSA, System Design, MCQs — all sequenced for you.' },
  { step: '03', icon: '🤖', title: 'Practice & get feedback',   desc: 'Mock interviews, AI code review, resume analysis — everything scored.' },
  { step: '04', icon: '🏆', title: 'Land your dream role',      desc: 'Match with top recruiters. Track applications. Celebrate your offer.' },
];

const plans = [
  { name: 'Free',       price: '₹0',    period: '',       highlight: false, badge: null,           cta: 'Get Started Free', link: '/register',
    features: ['5 Daily challenges','50 MCQ questions','Basic learning paths','Community access','1 mock interview/month'] },
  { name: 'Pro',        price: '₹999',  period: '/month', highlight: true,  badge: 'Most Popular', cta: 'Upgrade to Pro',   link: '/pricing',
    features: ['Everything in Basic','Unlimited MCQ + Coding','Unlimited mock interviews','AI Interview Coach (unlimited)','Resume analyzer','System design lab','Analytics & reports','Certifications'] },
  { name: 'Enterprise', price: 'Custom', period: '',       highlight: false, badge: 'Teams',        cta: 'Contact Sales',    link: '/pricing',
    features: ['Everything in Pro','Team management (20 seats)','Custom learning paths','Dedicated account manager','White-label options','Priority 24/7 support','API access'] },
];

// ─── animated counter ─────────────────────────────────────────────────────────

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
        const ease = 1 - Math.pow(1 - t, 3);
        setCount(Math.floor(ease * end));
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
        <span className="text-blue-400">{suffix}</span>
      </p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ───────── NAVBAR ───────── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Avantika" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-black text-lg tracking-tight text-white">Avantika</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features','Domains','Pricing','Community'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign in</button>
            <button onClick={() => navigate('/register')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5">
              Get Started <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* ───────── HERO ───────── */}
      <section className="relative pt-28 pb-24 px-4 dot-grid overflow-hidden">
        {/* Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-600/8 rounded-full blur-[140px] pointer-events-none glow-pulse" />
        <div className="absolute top-32 left-[12%] w-[380px] h-[380px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none glow-pulse" style={{animationDelay:'2s'}} />
        <div className="absolute top-40 right-[8%] w-[300px] h-[300px] bg-cyan-600/8 rounded-full blur-[90px] pointer-events-none glow-pulse" style={{animationDelay:'1s'}} />

        <div className="max-w-6xl mx-auto text-center">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8 fade-up">
            <Sparkles size={13} className="text-blue-400" />
            AI-Powered Technical Interview Preparation
            <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-md bg-blue-500/25 text-blue-200">NEW</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] mb-6 fade-up" style={{animationDelay:'0.1s'}}>
            Land Your{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Dream Tech Job</span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 opacity-50 rounded-full" />
            </span>
            <br />
            <span className="text-slate-300">with AI Coaching</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed fade-up" style={{animationDelay:'0.2s'}}>
            The only platform combining AI mock interviews, 5,000+ coding problems, system design labs, and
            resume analysis. Used by engineers at Google, Amazon, Microsoft & more.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-up" style={{animationDelay:'0.3s'}}>
            <button onClick={() => navigate('/register')}
              className="group px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 text-base">
              Start for Free — No Credit Card
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="px-7 py-3.5 rounded-xl font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2.5 text-base">
              <Play size={15} className="text-slate-400" /> Watch 2-min Demo
            </button>
          </div>

          {/* Animated stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16 fade-up" style={{animationDelay:'0.4s'}}>
            <AnimatedCounter end={75}    suffix="K+"  label="Active Learners" />
            <AnimatedCounter end={2400}  suffix="K+"  label="Problems Solved" />
            <AnimatedCounter end={12}    suffix="K+"  label="Offers Received" />
            <AnimatedCounter end={500}   suffix="+"   label="Company Partners" />
          </div>

          {/* Platform mockup */}
          <div className="relative max-w-4xl mx-auto float-slow fade-up" style={{animationDelay:'0.5s'}}>
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/15 via-violet-600/15 to-cyan-600/15 rounded-3xl blur-2xl" />
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/70 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 bg-slate-700/50 rounded-lg px-3 py-1 text-xs text-slate-500 text-center max-w-xs mx-auto">
                  app.avantika.io/dashboard
                </div>
                <div className="w-14 h-1.5 rounded bg-slate-700/40" />
              </div>
              {/* Dashboard preview cards */}
              <div className="p-5 grid grid-cols-3 gap-4">
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Interview Readiness</span>
                    <TrendingUp size={12} className="text-green-400" />
                  </div>
                  <p className="text-3xl font-black text-white mb-2">72<span className="text-sm font-medium text-slate-500">%</span></p>
                  <div className="h-1.5 bg-slate-700 rounded-full"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" /></div>
                  <p className="text-xs text-green-400 mt-2">↑ 8% this week</p>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-3 font-medium">Current Streak</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔥</span>
                    <span className="text-3xl font-black text-white">14</span>
                    <span className="text-xs text-slate-400">days</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,1,1,1,1,0,1,1,1,1,1,1,1,1].map((d,i)=>(
                      <div key={i} className={`flex-1 h-1.5 rounded-sm ${d?'bg-orange-400':'bg-slate-700'}`} />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-3 font-medium">Today's Tasks</p>
                  <div className="space-y-2">
                    {[{t:'Merge Intervals',done:true,tag:'DSA'},{t:'5 Java MCQs',done:false,tag:'MCQ'},{t:'CAP Theorem',done:false,tag:'SD'}].map(item=>(
                      <div key={item.t} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center ${item.done?'bg-green-500 border-green-500':'border-slate-600'}`}>
                          {item.done && <CheckCircle2 size={8} className="text-white" />}
                        </div>
                        <span className={`text-xs flex-1 ${item.done?'line-through text-slate-600':'text-slate-300'}`}>{item.t}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-400">{item.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── MARQUEE ───────── */}
      <section className="py-10 border-y border-white/5 bg-slate-900/30 overflow-hidden">
        <p className="text-center text-xs text-slate-600 font-semibold uppercase tracking-widest mb-6">Trusted by engineers at</p>
        <div className="overflow-hidden">
          <div className="marquee-track gap-14 px-8">
            {[...companies, ...companies].map((c, i) => (
              <span key={i} className="text-slate-500 hover:text-slate-300 font-bold text-sm tracking-wider transition-colors whitespace-nowrap cursor-default">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-5">
              <Zap size={13} /> Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">Everything you need to get hired</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">One platform. All tools. From your first line of code to your final offer.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className={`group relative bg-slate-900/60 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${f.glow} cursor-default`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={15} className="text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-24 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-5">
              <Clock size={13} /> How it works
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Go from zero to offer</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.step} className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-slate-700 to-transparent z-0 -translate-y-0.5" />
                )}
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-xs font-bold text-slate-600 font-mono mb-1">STEP {s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── DOMAINS ───────── */}
      <section id="domains" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-5">
              <Code2 size={13} /> Domains
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">Cover every domain</h2>
            <p className="text-slate-400 text-lg">Fresher to Staff Engineer — we have content for every level.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {domains.map(d => (
              <div key={d.name} className={`group bg-gradient-to-br ${d.bg} border rounded-2xl p-5 text-center hover:-translate-y-1 transition-all duration-200 cursor-default`}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{d.icon}</div>
                <div className="font-semibold text-white text-sm mb-1">{d.name}</div>
                <div className="text-xs text-slate-400">{d.count} questions</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="py-24 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium mb-5">
              <Star size={13} /> Success Stories
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Engineers love Avantika</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {testimonials.map((t, i) => (
              <div key={t.name} onClick={() => setActiveTestimonial(i)}
                className={`relative bg-slate-900/60 border rounded-2xl p-6 cursor-pointer transition-all duration-300
                  ${activeTestimonial === i ? 'border-white/20 shadow-2xl -translate-y-1' : 'border-white/5 hover:border-white/10'}`}>
                <div className="text-4xl font-serif text-slate-700 leading-none mb-3 select-none">"</div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({length:t.rating}).map((_,j) => (
                    <Star key={j} size={12} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            {testimonials.map((_,i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i===activeTestimonial?'bg-blue-500 w-6':'bg-slate-700 w-1.5'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PRICING ───────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-5">
              <Shield size={13} /> Pricing
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-lg">Start free. Upgrade when you're ready. All plans in INR.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {plans.map(plan => (
              <div key={plan.name}
                className={`relative rounded-2xl p-6 transition-all duration-300
                  ${plan.highlight
                    ? 'bg-gradient-to-b from-blue-950/80 to-violet-950/70 border border-blue-500/40 shadow-2xl shadow-blue-500/15 scale-[1.03]'
                    : 'bg-slate-900/60 border border-white/5 hover:border-white/10'}`}>
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap
                    ${plan.highlight?'bg-blue-500 text-white':'bg-slate-700 text-slate-300 border border-slate-600'}`}>
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-green-400 mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to={plan.link}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                    ${plan.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/5'}`}>
                  {plan.cta} <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="relative py-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-violet-950/40 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/12 rounded-full blur-[100px] glow-pulse" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-8">
            <Users size={13} /> Join 75,000+ engineers
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Ready to land your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              dream role?
            </span>
          </h2>
          <p className="text-slate-400 text-xl mb-10">Start free today. No credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')}
              className="group px-8 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3">
              Start Free Today
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <Link to="/pricing"
              className="px-8 py-4 rounded-xl font-bold text-slate-300 text-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-white/5 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Avantika" className="w-8 h-8 rounded-lg object-contain" />
                <span className="font-black text-white text-lg">Avantika</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">AI-powered interview prep for the modern software engineer.</p>
              <div className="flex gap-2">
                {([
                  { href: '#', label: 'X', el: <XIcon /> },
                  { href: '#', label: 'LinkedIn', el: <Linkedin size={13} /> },
                  { href: '#', label: 'GitHub', el: <GithubIcon /> },
                ] as const).map(({ href, label, el }) => (
                  <a key={label} href={href} aria-label={label} className="w-8 h-8 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 transition-colors">
                    {el}
                  </a>
                ))}
              </div>
            </div>
            {[
              {title:'Product', links:['Features','Pricing','Domains','Roadmap']},
              {title:'Company', links:['About','Blog','Careers','Press']},
              {title:'Legal',   links:['Privacy','Terms','Security','Status']},
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-slate-600">© 2026 Avantika Technologies Pvt. Ltd.</p>
            <p className="text-xs text-slate-700">Made with ❤️ for engineers in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
