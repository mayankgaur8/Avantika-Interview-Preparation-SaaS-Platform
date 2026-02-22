import React, { useState } from 'react';
import { User, Mail, MapPin, Globe, Github, Linkedin, Bell, Shield, CreditCard, Moon, Sun, ChevronRight, Edit3, Check, Zap, Award, Target, BookOpen } from 'lucide-react';
import { Card, Badge, Button, Progress, Avatar, StatCard } from '../components/ui';
import { useStore } from '../store/useStore';

type ProfileTab = 'overview' | 'settings' | 'subscription';

const Profile: React.FC = () => {
  const { user, theme, toggleTheme } = useStore();
  const [tab, setTab] = useState<ProfileTab>('overview');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    bio: 'Senior Software Engineer targeting FAANG. Passionate about distributed systems and algorithms.',
    location: 'Bangalore, India',
    github: 'github.com/avantika',
    linkedin: 'linkedin.com/in/avantika',
    website: 'avantika.dev',
    targetRole: 'Senior Backend Engineer',
    targetCompany: 'Google',
    yearsExp: '3',
    notifyEmail: true,
    notifyPush: true,
    notifyWeekly: true,
  });

  const xpForNextLevel = 500;
  const xpCurrent = (user?.xp ?? 4850) % xpForNextLevel;
  const xpPercent = (xpCurrent / xpForNextLevel) * 100;

  const activityData = [
    { label: 'Problems Solved', value: '137', icon: <Target size={16} />, color: 'text-blue-400' },
    { label: 'MCQs Answered', value: '412', icon: <Zap size={16} />, color: 'text-yellow-400' },
    { label: 'Paths Enrolled', value: '4', icon: <BookOpen size={16} />, color: 'text-purple-400' },
    { label: 'Certifications', value: '2', icon: <Award size={16} />, color: 'text-green-400' },
  ];

  const recentActivity = [
    { type: 'problem', text: 'Solved "LRU Cache" (Hard)', time: '2h ago', color: 'bg-blue-500' },
    { type: 'interview', text: 'Completed System Design mock interview — Score: 8.5/10', time: '1d ago', color: 'bg-purple-500' },
    { type: 'cert', text: 'Earned DSA Fundamentals certificate', time: '3d ago', color: 'bg-yellow-500' },
    { type: 'streak', text: 'Reached 14-day streak!', time: '4d ago', color: 'bg-orange-500' },
    { type: 'path', text: 'Completed "Trees & Graphs" module', time: '5d ago', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <Avatar initials={user?.avatar ?? 'A'} size="xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <Badge variant="blue" size="md">{user?.tier} Plan</Badge>
              <Badge variant="purple" size="md">Level {user?.level}</Badge>
            </div>
            <p className="text-slate-400 text-sm mt-1">{formData.bio}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin size={11} />{formData.location}</span>
              <span className="flex items-center gap-1"><Target size={11} />Targeting: {formData.targetRole} @ {formData.targetCompany}</span>
              <span className="flex items-center gap-1"><Github size={11} />{formData.github}</span>
              <span className="flex items-center gap-1"><Linkedin size={11} />{formData.linkedin}</span>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={() => { setTab('settings'); setEditing(true); }} icon={<Edit3 size={14} />}>
            Edit Profile
          </Button>
        </div>

        {/* XP Progress */}
        <div className="mt-5 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Level {user?.level} → Level {(user?.level ?? 9) + 1}</span>
            <span className="text-slate-500">{xpCurrent} / {xpForNextLevel} XP</span>
          </div>
          <Progress value={xpPercent} color="blue" size="sm" />
          <p className="text-xs text-slate-500 mt-1">{xpForNextLevel - xpCurrent} XP to next level</p>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        {(['overview', 'settings', 'subscription'] as ProfileTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-all ${tab === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activityData.map(a => (
                <Card key={a.label} className="text-center py-3">
                  <div className={`flex justify-center mb-1 ${a.color}`}>{a.icon}</div>
                  <p className="text-xl font-bold text-white">{a.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.label}</p>
                </Card>
              ))}
            </div>

            {/* Skills */}
            <Card>
              <h2 className="font-semibold text-white mb-4">Skill Proficiency</h2>
              <div className="space-y-3">
                {[
                  { skill: 'Java', level: 88, color: 'blue' as const },
                  { skill: 'System Design', level: 55, color: 'purple' as const },
                  { skill: 'DSA', level: 72, color: 'green' as const },
                  { skill: 'Cloud / AWS', level: 42, color: 'yellow' as const },
                  { skill: 'Behavioral', level: 70, color: 'blue' as const },
                  { skill: 'Spring Boot', level: 80, color: 'green' as const },
                ].map(s => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">{s.skill}</span>
                      <span className="text-slate-500">{s.level}%</span>
                    </div>
                    <Progress value={s.level} color={s.color} size="xs" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">{a.text}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Badges */}
            <Card>
              <h3 className="font-semibold text-white mb-3">Earned Badges</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🔥', label: '14-Day Streak' },
                  { icon: '⚡', label: 'Speed Solver' },
                  { icon: '🧠', label: 'MCQ Master' },
                  { icon: '🏆', label: 'Top 10%' },
                  { icon: '💻', label: 'Code Warrior' },
                  { icon: '🎯', label: '100 Problems' },
                ].map(b => (
                  <div key={b.label} className="text-center p-2 bg-slate-800 rounded-xl">
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <p className="text-xs text-slate-400 leading-tight">{b.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Interview Readiness */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border-blue-500/20">
              <h3 className="font-semibold text-white mb-3">Interview Readiness</h3>
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="12"
                    strokeDasharray={`${(user?.interviewReadiness ?? 72) * 3.14} 314`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-white">{user?.interviewReadiness ?? 72}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center">Ready for interviews at mid-level companies. Keep improving System Design!</p>
            </Card>

            {/* Goals */}
            <Card>
              <h3 className="font-semibold text-white mb-3">Goals</h3>
              <div className="space-y-2">
                {[
                  { goal: 'Target: Google L5', done: false },
                  { goal: 'Complete System Design path', done: false },
                  { goal: '150 problems solved', done: false },
                  { goal: 'Mock interview score 9+', done: false },
                ].map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${g.done ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                      {g.done && <Check size={10} className="text-white" />}
                    </div>
                    <span className={`text-sm ${g.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{g.goal}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="max-w-2xl space-y-5">
          <Card>
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><User size={16} />Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name', icon: <User size={14} /> },
                { label: 'Location', key: 'location', icon: <MapPin size={14} /> },
                { label: 'GitHub', key: 'github', icon: <Github size={14} /> },
                { label: 'LinkedIn', key: 'linkedin', icon: <Linkedin size={14} /> },
                { label: 'Website', key: 'website', icon: <Globe size={14} /> },
                { label: 'Target Role', key: 'targetRole', icon: <Target size={14} /> },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                  <div className="flex items-center gap-2 input-base">
                    <span className="text-slate-500">{f.icon}</span>
                    <input
                      value={(formData as any)[f.key]}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      className="flex-1 bg-transparent text-sm text-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs text-slate-400 mb-1 block">Bio</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                rows={3}
                className="input-base w-full resize-none text-sm"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button size="sm">Save Changes</Button>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Bell size={16} />Notifications</h2>
            <div className="space-y-3">
              {[
                { label: 'Email notifications', desc: 'Receive updates about your progress', key: 'notifyEmail' },
                { label: 'Push notifications', desc: 'Browser notifications for reminders', key: 'notifyPush' },
                { label: 'Weekly digest', desc: 'Summary of your weekly progress', key: 'notifyWeekly' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-white font-medium">{n.label}</p>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setFormData(p => ({ ...p, [n.key]: !(p as any)[n.key] }))}
                    className={`w-10 h-5 rounded-full transition-all relative ${(formData as any)[n.key] ? 'bg-blue-600' : 'bg-slate-700'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${(formData as any)[n.key] ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Shield size={16} />Appearance</h2>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white font-medium">Dark Mode</p>
                <p className="text-xs text-slate-500">Toggle between light and dark theme</p>
              </div>
              <button onClick={toggleTheme} className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
          </Card>

          <Card className="border-red-500/20">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2 text-red-400"><Shield size={16} />Danger Zone</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white">Delete Account</p>
                  <p className="text-xs text-slate-500">Permanently delete your account and all data</p>
                </div>
                <Button variant="danger" size="sm">Delete</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Subscription Tab */}
      {tab === 'subscription' && (
        <div className="max-w-3xl space-y-5">
          <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Current Plan</p>
                <h2 className="text-2xl font-bold text-white capitalize">{user?.tier} Plan</h2>
                <p className="text-slate-400 text-sm mt-1">Renews on March 1, 2026</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-white">₹799</p>
                <p className="text-xs text-slate-400">per month</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Unlimited MCQ Practice', 'AI Mock Interviews', 'Resume Analyzer', 'Priority Support'].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Check size={12} className="text-green-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Free', price: '₹0', features: ['10 MCQs/day', '3 problems/day', 'Basic analytics', '1 mock interview/month'], current: false, color: 'slate' },
              { name: 'Pro', price: '₹799', features: ['Unlimited MCQs', 'All 300+ problems', 'AI interviews', 'Resume analyzer', 'Analytics dashboard'], current: true, color: 'blue' },
              { name: 'Enterprise', price: '₹1,999', features: ['Everything in Pro', 'Peer matching', 'Priority support', 'Team dashboard', 'Custom paths'], current: false, color: 'purple' },
            ].map(plan => (
              <Card key={plan.name} className={`relative ${plan.current ? 'border-blue-500/50 bg-blue-500/5' : ''}`}>
                {plan.current && <Badge variant="blue" size="sm" className="absolute top-3 right-3">Current</Badge>}
                <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                <p className="text-2xl font-black text-white mt-1">{plan.price}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                <div className="mt-4 space-y-2">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check size={11} className="text-green-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                {!plan.current && (
                  <Button size="sm" className="w-full mt-4" variant={plan.name === 'Free' ? 'secondary' : 'primary'}>
                    {plan.name === 'Free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </Card>
            ))}
          </div>

          <Card>
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><CreditCard size={16} />Billing History</h2>
            <div className="space-y-2">
              {[
                { date: 'Feb 1, 2026', amount: '₹799', status: 'Paid', invoice: 'INV-2026-02' },
                { date: 'Jan 1, 2026', amount: '₹799', status: 'Paid', invoice: 'INV-2026-01' },
                { date: 'Dec 1, 2025', amount: '₹799', status: 'Paid', invoice: 'INV-2025-12' },
              ].map(b => (
                <div key={b.invoice} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm text-white">{b.date}</p>
                    <p className="text-xs text-slate-500">{b.invoice}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-white">{b.amount}</span>
                    <Badge variant="green" size="sm">{b.status}</Badge>
                    <button className="text-xs text-blue-400 hover:text-blue-300">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
