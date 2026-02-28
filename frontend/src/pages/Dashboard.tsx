import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame, Zap, Target, TrendingUp, Code2, Brain, FileText,
  Video, ArrowRight, CheckCircle2, Clock, BookOpen, Award, BarChart3, Sparkles
} from 'lucide-react';
import { Card, Badge, Progress, Button, StatCard } from '../components/ui';
import { useStore } from '../store/useStore';
import { interviewHistory, learningPaths } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const weeklyData = [
  { day: 'Mon', value: 5 }, { day: 'Tue', value: 3 }, { day: 'Wed', value: 7 },
  { day: 'Thu', value: 4 }, { day: 'Fri', value: 6 }, { day: 'Sat', value: 10 }, { day: 'Sun', value: 2 },
];

const recentActivity = [
  { icon: '✅', text: 'Solved Two Sum', time: '2h ago' },
  { icon: '🧠', text: 'Completed Java MCQ Quiz (89%)', time: '3h ago' },
  { icon: '🤖', text: 'AI Interview: System Design (8.2/10)', time: 'Yesterday' },
  { icon: '📚', text: 'Binary Search module completed', time: 'Yesterday' },
  { icon: '🔥', text: '14-day streak maintained!', time: '2 days ago' },
];

const quickActions = [
  { icon: Brain,     label: 'MCQ Quiz',       desc: '5 questions ready', color: 'from-violet-500/15 to-violet-500/5 text-violet-300 border border-violet-500/20', to: '/practice/mcq' },
  { icon: Code2,     label: 'Code Problem',   desc: 'Daily challenge',   color: 'from-blue-500/15 to-blue-500/5 text-blue-300 border border-blue-500/20',     to: '/practice/coding' },
  { icon: Zap,       label: 'AI Interview',   desc: 'Practice DSA',      color: 'from-cyan-500/15 to-cyan-500/5 text-cyan-300 border border-cyan-500/20',     to: '/interview/ai' },
  { icon: FileText,  label: 'Resume Check',   desc: 'Get ATS score',     color: 'from-pink-500/15 to-pink-500/5 text-pink-300 border border-pink-500/20',     to: '/resume' },
];

const Dashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const enrolledPaths = learningPaths.filter(p => p.enrolled);
  const upcomingInterview = interviewHistory.find(i => i.status === 'scheduled');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, <span className="gradient-text">{user?.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {' · '}
            <span className="text-amber-400 font-medium">🔥 {user?.streak ?? 14}-day streak</span>
          </p>
        </div>
        <Button
          icon={<Flame size={15} />}
          variant="secondary"
          onClick={() => navigate('/daily')}
          className="hidden sm:flex"
        >
          Daily Challenge
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Interview Readiness" value={`${user?.interviewReadiness ?? 72}%`}
          icon={<Target size={18} />} color="purple" subtitle="Senior Backend Engineer" />
        <StatCard label="Current Streak"      value={`${user?.streak ?? 14} days`}
          icon={<Flame size={18} />}  color="yellow" subtitle="Longest: 21 days" />
        <StatCard label="Total XP"            value={(user?.xp ?? 4850).toLocaleString()}
          icon={<Zap size={18} />}    color="blue"   subtitle={`Level ${user?.level ?? 12}`} />
        <StatCard label="Problems Solved"     value="137"
          icon={<TrendingUp size={18} />} color="green" trend={{ value: 12, positive: true }} />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-5">

          {/* Quick Actions */}
          <Card>
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" /> Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  className={`flex flex-col items-center gap-2 p-4 bg-gradient-to-b ${action.color} rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-center group`}
                >
                  <action.icon size={20} className="transition-transform group-hover:scale-110" />
                  <div>
                    <p className="text-xs font-semibold text-white">{action.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-400" /> Weekly Activity
              </h2>
              <Badge variant="blue">37 problems this week</Badge>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyData} barSize={20}>
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10 }}
                  labelStyle={{ color: '#94a3b8', fontSize: 12 }}
                  itemStyle={{ color: '#a78bfa', fontSize: 12 }}
                  cursor={{ fill: 'rgba(139,92,246,0.06)' }}
                />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[5, 5, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Enrolled Paths */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <BookOpen size={16} className="text-cyan-400" /> Enrolled Paths
              </h2>
              <button onClick={() => navigate('/paths')} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {enrolledPaths.map((path) => (
                <div
                  key={path.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group"
                  onClick={() => navigate('/paths')}
                >
                  <span className="text-2xl">{path.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-white truncate">{path.title}</p>
                      <span className="text-xs text-slate-500 ml-2 font-medium">{path.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-5">

          {/* Today's Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Today's Tasks</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300">2/3</span>
            </div>
            <div className="space-y-2">
              {[
                { done: true,  icon: '🧩', text: 'Solve Two Sum',      xp: '+50 XP' },
                { done: true,  icon: '🧠', text: '5 Java MCQs',        xp: '+25 XP' },
                { done: false, icon: '📖', text: 'Read CAP Theorem',   xp: '+15 XP' },
              ].map((task, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${task.done ? 'opacity-50' : 'bg-slate-800/60 hover:bg-slate-800'}`}>
                  {task.done
                    ? <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                    : <div className="w-4 h-4 rounded-full border-2 border-violet-500/50 flex-shrink-0" />
                  }
                  <span className="text-xs text-white flex-1">{task.icon} {task.text}</span>
                  <span className="text-[10px] text-amber-400 font-bold">{task.xp}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Skill Breakdown */}
          <Card>
            <h2 className="font-semibold text-white mb-4">Skill Breakdown</h2>
            <div className="space-y-3">
              {[
                { skill: 'DSA',           score: 78, color: 'violet' as const },
                { skill: 'System Design', score: 55, color: 'blue'   as const },
                { skill: 'Java',          score: 88, color: 'green'  as const },
                { skill: 'Behavioral',    score: 70, color: 'yellow' as const },
                { skill: 'Cloud / AWS',   score: 42, color: 'red'    as const },
              ].map((item) => (
                <div key={item.skill}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">{item.skill}</span>
                    <span className="text-slate-300 font-bold">{item.score}%</span>
                  </div>
                  <Progress value={item.score} color={item.color === 'violet' ? 'purple' : item.color} size="xs" />
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="w-full mt-4 text-xs text-violet-400 hover:text-violet-300 flex items-center justify-center gap-1 transition-colors"
            >
              Full Analytics <ArrowRight size={11} />
            </button>
          </Card>

          {/* Upcoming Interview */}
          {upcomingInterview && (
            <Card className="border-violet-500/25 bg-gradient-to-b from-violet-500/8 to-transparent">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-violet-500/12 rounded-lg">
                  <Video size={16} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Mock Interview</p>
                  <p className="text-xs text-slate-400">{upcomingInterview.domain} · AI Session</p>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                    <Clock size={11} /> Tomorrow, 10:00 AM
                  </div>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full" onClick={() => navigate('/interview/mock')}>
                Join Room
              </Button>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-sm leading-none mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Certificate nudge ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900/40 via-slate-900 to-blue-900/40 border border-violet-500/20 p-5">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-400 via-transparent to-blue-400 pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-bold text-white">Earn your DSA Proficiency Certificate</p>
              <p className="text-sm text-slate-400 mt-0.5">You're 80% ready — take the assessment and showcase on LinkedIn.</p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate('/certifications')} iconRight={<ArrowRight size={14} />}>
            Take Exam
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
