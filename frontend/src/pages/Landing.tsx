import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Star, Zap, Code2, Brain, BarChart3, Users, Award, Target, ChevronRight, Play } from 'lucide-react';
import { Button, Badge, Card } from '../components/ui';
import logo from '../assets/logo.png';

const features = [
  { icon: Brain, title: 'AI Interview Bot', desc: 'Practice with Claude-powered interviewer. Real questions, real-time feedback.', color: 'text-blue-400' },
  { icon: Code2, title: 'Coding Playground', desc: '5,000+ problems with CodeMirror editor, multiple languages, AI code review.', color: 'text-green-400' },
  { icon: Zap, title: 'Skill Gap Analyzer', desc: 'Know exactly what to study next. AI maps your gaps to target role requirements.', color: 'text-yellow-400' },
  { icon: BarChart3, title: 'Progress Analytics', desc: 'Track consistency, skill radar charts, interview score trends.', color: 'text-purple-400' },
  { icon: Target, title: 'Resume Analyzer', desc: 'ATS scoring, bullet improvement suggestions, keyword optimization.', color: 'text-pink-400' },
  { icon: Award, title: 'Certifications', desc: 'Earn verifiable certificates. Sync directly to LinkedIn.', color: 'text-cyan-400' },
];

const domains = [
  { icon: '🧩', name: 'DSA & Algorithms', count: '5,000+ problems' },
  { icon: '🏗️', name: 'System Design', count: '200+ scenarios' },
  { icon: '☕', name: 'Java / Spring', count: '450+ questions' },
  { icon: '🐍', name: 'Python', count: '380+ questions' },
  { icon: '⚛️', name: 'React & Frontend', count: '350+ questions' },
  { icon: '☁️', name: 'Cloud & AWS', count: '320+ questions' },
  { icon: '🐳', name: 'Docker & K8s', count: '200+ questions' },
  { icon: '🤖', name: 'AI Engineering', count: '150+ questions' },
];

const testimonials = [
  { name: 'Riya Verma', role: 'SDE2 @ Google', avatar: 'RV', text: 'The AI interview bot is uncannily realistic. It asked exactly the follow-up questions I faced in my actual Google interview.', rating: 5 },
  { name: 'Karan Shah', role: 'Senior SDE @ Amazon', avatar: 'KS', text: 'Went from 45% MCQ accuracy to 89% in 8 weeks. The personalized learning path was a game changer.', rating: 5 },
  { name: 'Ananya Iyer', role: 'ML Engineer @ Microsoft', avatar: 'AI', text: 'Resume analyzer helped me rewrite bullet points with actual metrics. Got callbacks from 8 of 10 applications!', rating: 5 },
];

const stats = [
  { label: 'Active Learners', value: '75,000+' },
  { label: 'Problems Solved', value: '2.4M+' },
  { label: 'Offers Received', value: '12,000+' },
  { label: 'Company Partners', value: '500+' },
];

const plans = [
  {
    name: 'Free', price: '$0', period: '', badge: null, color: 'border-slate-700',
    features: ['1 Learning Path', '500 MCQ Questions', '100 DSA Problems', '2 AI Interviews/month', 'Community Forum'],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro', price: '$19', period: '/month', badge: 'Most Popular', color: 'border-blue-500',
    features: ['All Learning Paths', 'Unlimited MCQs', '5,000+ Problems', '20 AI Interviews/month', 'AI Code Review', 'Resume Analyzer', 'Certifications', 'Recruiter Matching'],
    cta: 'Start Pro Trial',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', badge: null, color: 'border-slate-700',
    features: ['Everything in Pro', 'Custom Learning Paths', 'Team Analytics Dashboard', 'SSO & Admin Panel', 'White-label Option', 'Dedicated CSM', '99.9% SLA'],
    cta: 'Contact Sales',
  },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Avantika" className="w-8 h-8 object-contain rounded-md" />
            <span className="font-bold text-white text-lg">Avantika</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            {['Features', 'Domains', 'Pricing', 'Community'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')} icon={<ArrowRight size={14} />} iconRight={undefined}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <Badge variant="blue" size="md" className="mb-6 inline-flex">
            🚀 AI-Powered Technical Interview Preparation
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Land Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Dream Tech Job
            </span>
            <br />with AI Coaching
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 text-balance">
            The only platform that combines AI interviews, 5,000+ coding problems, system design labs,
            and career coaching in one place. Used by engineers at Google, Amazon, Microsoft & more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" onClick={() => navigate('/register')} iconRight={<ArrowRight size={18} />}>
              Start for Free — No Credit Card
            </Button>
            <Button size="lg" variant="secondary" icon={<Play size={16} />}>
              Watch 2-min Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform preview card */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            {/* Fake browser chrome */}
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-4 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 text-center">app.avantika.io/dashboard</div>
            </div>
            {/* Dashboard preview */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-bold text-white">72</div>
                <div className="text-xs text-slate-400 mt-1">Interview Readiness</div>
                <div className="mt-3 h-1.5 bg-slate-700 rounded-full">
                  <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-orange-400">🔥</span>
                  <span className="text-2xl font-bold text-white">14</span>
                  <span className="text-xs text-slate-400">day streak</span>
                </div>
                <div className="text-xs text-slate-500">Keep going! Personal best: 21 days</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-xs text-slate-400 mb-2">Today's Tasks</div>
                {['Merge Intervals', '5 Java MCQs', 'CAP Theorem'].map((task, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-green-400' : 'bg-slate-600'}`} />
                    <span className={`text-xs ${i === 0 ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company logos */}
      <section className="py-10 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 mb-8">Trusted by engineers at world-class companies</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
            {['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Flipkart', 'Swiggy'].map((co) => (
              <span key={co} className="text-slate-300 font-semibold text-sm tracking-wider">{co}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="purple" size="md" className="mb-4 inline-flex">Features</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to get hired</h2>
            <p className="text-slate-400 max-w-xl mx-auto">One platform. All tools. From your first line of code to your final offer letter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <Card key={feature.title} hover className="group">
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={20} className={feature.color} />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Domains */}
      <section id="domains" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="green" size="md" className="mb-4 inline-flex">Domains</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Cover every domain</h2>
            <p className="text-slate-400">Whether you're a Fresher or a Senior Engineer, we have content for your level.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {domains.map((domain) => (
              <Card key={domain.name} hover className="text-center py-6">
                <div className="text-3xl mb-3">{domain.icon}</div>
                <div className="font-medium text-white text-sm mb-1">{domain.name}</div>
                <div className="text-xs text-slate-500">{domain.count}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="yellow" size="md" className="mb-4 inline-flex">Success Stories</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Engineers love Avantika</h2>
          </div>

          <div className="relative">
            <Card className="p-8 text-center">
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-slate-300 mb-6 italic">"{testimonials[activeTestimonial].text}"</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{testimonials[activeTestimonial].name}</p>
                  <p className="text-sm text-slate-400">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </Card>
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? 'bg-blue-500 w-6' : 'bg-slate-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="cyan" size="md" className="mb-4 inline-flex">Pricing</Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-slate-900 border ${plan.color} rounded-2xl p-6 ${plan.badge ? 'ring-2 ring-blue-500/50' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="blue" size="md">{plan.badge}</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-400 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.badge ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => navigate('/register')}
                  iconRight={<ChevronRight size={14} />}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to land your<br />
            <span className="gradient-text">dream role?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">Join 75,000+ engineers preparing smarter with Avantika.</p>
          <Button size="lg" onClick={() => navigate('/register')} iconRight={<ArrowRight size={18} />}>
            Start Free Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Avantika" className="w-7 h-7 object-contain rounded-md" />
            <span className="font-bold text-white">Avantika</span>
            <span className="text-slate-500 text-sm ml-2">© 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            {['Privacy', 'Terms', 'Blog', 'Contact', 'Status'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex gap-3">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a key={social} href="#" className="text-slate-500 hover:text-white transition-colors text-sm">{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
