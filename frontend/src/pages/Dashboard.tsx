import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame, Zap, Target, TrendingUp, Code2, Brain, FileText,
  Video, ArrowRight, CheckCircle2, Clock, BookOpen, Award, BarChart3
} from 'lucide-react';
import { Card, Badge, Progress, Button, StatCard, Avatar } from '../components/ui';
import { useStore } from '../store/useStore';
import { interviewHistory, learningPaths } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const weeklyData = [
  { day: 'Mon', value: 5 }, { day: 'Tue', value: 3 }, { day: 'Wed', value: 7 },
  { day: 'Thu', value: 4 }, { day: 'Fri', value: 6 }, { day: 'Sat', value: 10 }, { day: 'Sun', value: 2 },
];

const recentActivity = [
  { icon: '✅', text: 'Solved Two Sum', time: '2h ago', color: 'text-green-400' },
  { icon: '🧠', text: 'Completed Java MCQ Quiz (89%)', time: '3h ago', color: 'text-blue-400' },
  { icon: '🤖', text: 'AI Interview: System Design (8.2/10)', time: 'Yesterday', color: 'text-purple-400' },
  { icon: '📚', text: 'Binary Search module completed', time: 'Yesterday', color: 'text-cyan-400' },
  { icon: '🔥', text: '14-day streak maintained!', time: '2 days ago', color: 'text-orange-400' },
];

const quickActions = [
  { icon: Brain, label: 'Take MCQ Quiz', desc: '5 Java questions', color: 'bg-blue-500/10 text-blue-400', to: '/practice/mcq' },
  { icon: Code2, label: 'Solve a Problem', desc: 'Daily challenge', color: 'bg-green-500/10 text-green-400', to: '/practice/coding' },
  { icon: Zap, label: 'AI Interview', desc: 'Practice DSA', color: 'bg-purple-500/10 text-purple-400', to: '/interview/ai' },
  { icon: FileText, label: 'Resume Check', desc: 'Get ATS score', color: 'bg-pink-500/10 text-pink-400', to: '/resume' },
];

const Dashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const enrolledPaths = learningPaths.filter(p => p.enrolled);
  const upcomingInterview = interviewHistory.find(i => i.status === 'scheduled');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good morning, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button icon={<Flame size={15} />} variant="outline" onClick={() => navigate('/daily')}>
          Daily Challenge
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Interview Readiness"
          value={`${user?.interviewReadiness ?? 72}%`}
          icon={<Target size={18} />}
          color="blue"
          subtitle="Target: Senior Backend Engineer"
        />
        <StatCard
          label="Current Streak"
          value={`${user?.streak ?? 14} days`}
          icon={<Flame size={18} />}
          color="yellow"
          subtitle="Longest: 21 days"
        />
        <StatCard
          label="Total XP"
          value={(user?.xp ?? 4850).toLocaleString()}
          icon={<Zap size={18} />}
          color="purple"
          subtitle={`Level ${user?.level ?? 12}`}
        />
        <StatCard
          label="Problems Solved"
          value="137"
          icon={<TrendingUp size={18} />}
          color="green"
          trend={{ value: 12, positive: true }}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Actions */}
          <Card>
            <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-left group"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Weekly Activity</h2>
              <Badge variant="green">37 problems this week</Badge>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyData} barSize={24}>
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Learning Paths Progress */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Enrolled Paths</h2>
              <button onClick={() => navigate('/paths')} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-4">
              {enrolledPaths.map((path) => (
                <div
                  key={path.id}
                  className="flex items-center gap-4 cursor-pointer hover:bg-slate-800 -mx-2 px-2 py-2 rounded-lg transition-colors"
                  onClick={() => navigate('/paths')}
                >
                  <div className="text-2xl">{path.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white truncate">{path.title}</p>
                      <span className="text-xs text-slate-400 ml-2">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} color="blue" size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Today's Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Today's Tasks</h2>
              <Badge variant="blue">2/3</Badge>
            </div>
            <div className="space-y-2.5">
              {[
                { done: true, icon: '🧩', text: 'Solve Two Sum', xp: '+50 XP' },
                { done: true, icon: '🧠', text: '5 Java MCQs', xp: '+25 XP' },
                { done: false, icon: '📖', text: 'Read CAP Theorem', xp: '+15 XP' },
              ].map((task, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${task.done ? 'opacity-60' : 'bg-slate-800'}`}>
                  {task.done
                    ? <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                    : <div className="w-4 h-4 rounded-full border-2 border-slate-600 flex-shrink-0" />
                  }
                  <span className="text-sm text-white">{task.icon} {task.text}</span>
                  <span className="ml-auto text-xs text-yellow-400">{task.xp}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Interview Readiness */}
          <Card>
            <h2 className="font-semibold text-white mb-4">Skill Breakdown</h2>
            <div className="space-y-3">
              {[
                { skill: 'DSA', score: 78, color: 'blue' as const },
                { skill: 'System Design', score: 55, color: 'purple' as const },
                { skill: 'Java', score: 88, color: 'green' as const },
                { skill: 'Behavioral', score: 70, color: 'yellow' as const },
                { skill: 'Cloud', score: 42, color: 'red' as const },
              ].map((item) => (
                <div key={item.skill}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{item.skill}</span>
                    <span className="text-slate-300">{item.score}%</span>
                  </div>
                  <Progress value={item.score} color={item.color} size="xs" />
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4 text-blue-400" onClick={() => navigate('/analytics')}>
              Full Analytics <ArrowRight size={12} />
            </Button>
          </Card>

          {/* Upcoming Interview */}
          {upcomingInterview && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Video size={16} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Upcoming Mock Interview</p>
                  <p className="text-xs text-slate-400 mt-0.5">{upcomingInterview.domain} · AI Session</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <Clock size={11} />
                    <span>Tomorrow, 10:00 AM</span>
                  </div>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full mt-3" onClick={() => navigate('/interview/mock')}>
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
                  <span className="text-base">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Certifications nudge */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🏆</div>
            <div>
              <p className="font-semibold text-white">Earn your DSA Proficiency Certificate</p>
              <p className="text-sm text-slate-400">You're 80% ready. Take the assessment and showcase your skills on LinkedIn.</p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate('/certifications')} iconRight={<ArrowRight size={14} />}>
            Take Exam
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
