import React, { useState } from 'react';
import { TrendingUp, Target, Zap, Clock } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card, Badge, Button, Progress, StatCard } from '../components/ui';
import { analyticsData } from '../data/mockData';
import { useStore } from '../store/useStore';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ActivityHeatmap({ data }: { data: { date: string; count: number }[] }) {
  const weeks: { date: string; count: number }[][] = [];
  let week: { date: string; count: number }[] = [];
  data.forEach((d, i) => {
    week.push(d);
    if (week.length === 7 || i === data.length - 1) {
      weeks.push(week);
      week = [];
    }
  });
  const getColor = (count: number) => {
    if (count === 0) return '#1e293b';
    if (count <= 2) return '#1e40af';
    if (count <= 4) return '#2563eb';
    if (count <= 6) return '#3b82f6';
    return '#60a5fa';
  };
  const monthLabels = MONTHS.slice(0, 12);
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 mb-2">
        {monthLabels.map((m, i) => (
          <span key={m} className="text-xs text-slate-600" style={{ flex: Math.ceil(weeks.length / 12) + 'px' }}>{i % 2 === 0 ? m : ''}</span>
        ))}
      </div>
      <div className="flex gap-0.5">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {w.map((day, di) => (
              <div
                key={di}
                className="heatmap-cell"
                style={{ backgroundColor: getColor(day.count) }}
                title={`${day.date}: ${day.count} activities`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
        <span>Less</span>
        {[0, 2, 4, 6, 8].map(c => (
          <div key={c} className="heatmap-cell" style={{ backgroundColor: getColor(c) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

const Analytics: React.FC = () => {
  const { user } = useStore();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Progress Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Track your preparation journey</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${period === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {p === 'all' ? 'All Time' : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Interview Readiness" value={`${user?.interviewReadiness ?? 72}%`} icon={<Target size={18} />} color="blue" />
        <StatCard label="Problems Solved" value="137" icon={<TrendingUp size={18} />} color="green" trend={{ value: 15, positive: true }} />
        <StatCard label="Study Hours" value="64h" icon={<Clock size={18} />} color="purple" trend={{ value: 8, positive: true }} />
        <StatCard label="XP Earned" value={(user?.xp ?? 4850).toLocaleString()} icon={<Zap size={18} />} color="yellow" />
      </div>

      {/* Activity Heatmap */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Activity Calendar</h2>
          <Badge variant="green">137 days active</Badge>
        </div>
        <ActivityHeatmap data={analyticsData.heatmapData} />
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Interview Score Trend */}
        <Card>
          <h2 className="font-semibold text-white mb-4">Interview Score Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analyticsData.interviewScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <h2 className="font-semibold text-white mb-4">Weekly Activity Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.weeklyActivity} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend formatter={(val) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{val}</span>} />
              <Bar dataKey="problems" name="Problems" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="mcqs" name="MCQs" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Skill Radar + Topic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Skill Radar */}
        <Card>
          <h2 className="font-semibold text-white mb-4">Skill Radar</h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={analyticsData.skillScores}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="Your Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Radar name="Required" dataKey="required" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeDasharray="4 4" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend formatter={(val) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{val}</span>} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Topic Breakdown */}
        <Card>
          <h2 className="font-semibold text-white mb-4">DSA Topic Breakdown</h2>
          <div className="space-y-3">
            {analyticsData.topicBreakdown.map(topic => (
              <div key={topic.topic}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{topic.topic}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{topic.solved}/{topic.total}</span>
                    <span className={topic.accuracy >= 80 ? 'text-green-400' : topic.accuracy >= 65 ? 'text-blue-400' : 'text-yellow-400'}>
                      {topic.accuracy}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-700/50 rounded-full">
                  <div
                    className={`h-1.5 rounded-full ${topic.accuracy >= 80 ? 'bg-green-500' : topic.accuracy >= 65 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    style={{ width: `${(topic.solved / topic.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skill Gap Report */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white">Skill Gap Analysis</h2>
            <p className="text-sm text-slate-400 mt-0.5">Target: Senior Backend Engineer @ Google</p>
          </div>
          <Badge variant="blue" size="md">68% Ready</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-green-400 mb-2">✅ STRONG AREAS</p>
            {['Java (88%)', 'Arrays & Strings (82%)', 'Spring Boot (80%)'].map(s => (
              <p key={s} className="text-sm text-slate-300 py-1 border-b border-slate-800">{s}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-yellow-400 mb-2">⚠️ NEEDS WORK</p>
            {['Behavioral (70%)', 'Databases (72%)', 'Heaps (68%)'].map(s => (
              <p key={s} className="text-sm text-slate-300 py-1 border-b border-slate-800">{s}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-red-400 mb-2">❌ CRITICAL GAPS</p>
            {['System Design (55%)', 'Cloud/AWS (42%)', 'Backtracking (55%)'].map(s => (
              <p key={s} className="text-sm text-slate-300 py-1 border-b border-slate-800">{s}</p>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            📅 <strong className="text-white">Recommendation:</strong> Focus 60% of your time on System Design and Cloud this month.
            Complete the System Design Mastery path and take 3 mock interviews.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
