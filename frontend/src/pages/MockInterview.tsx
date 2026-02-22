import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Users, CheckCircle2, ChevronRight, Mic, MicOff, VideoOff, PhoneOff, MessageSquare } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Card, Badge, Button, Avatar } from '../components/ui';
import { interviewHistory } from '../data/mockData';

const upcomingSlots = [
  { date: 'Tomorrow', time: '10:00 AM IST', domain: 'System Design', type: 'AI', available: true },
  { date: 'Tomorrow', time: '2:00 PM IST', domain: 'DSA', type: 'Peer', available: true },
  { date: 'Sat, Apr 20', time: '11:00 AM IST', domain: 'Full Stack', type: 'AI', available: true },
  { date: 'Sat, Apr 20', time: '4:00 PM IST', domain: 'Behavioral', type: 'Peer', available: false },
];

const MockInterview: React.FC = () => {
  const [view, setView] = useState<'list' | 'room'>('list');
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [code, setCode] = useState(`// Design a rate limiter\n// Think about: algorithm, data structures, edge cases\n\nclass RateLimiter {\n  // Your implementation here\n}\n`);

  useEffect(() => {
    if (view !== 'room') return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [view]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (view === 'room') return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-5 -my-5 lg:-mx-6 lg:-my-6 overflow-hidden bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Badge variant="red" size="md">● LIVE</Badge>
          <span className="font-mono text-white text-sm">{fmt(elapsed)}</span>
          <span className="text-slate-400 text-sm">System Design Interview · AI Session</span>
        </div>
        <Button variant="danger" size="sm" onClick={() => setView('list')} icon={<PhoneOff size={14} />}>
          End Interview
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Question + AI feedback */}
        <div className="w-96 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-900 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <Badge variant="blue" size="sm">System Design</Badge>
            <h3 className="font-semibold text-white mt-2">Design a Rate Limiter</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Design a rate limiting system that can handle 1M requests/second. Support per-user, per-IP, and per-API-endpoint rate limits.
            </p>
          </div>

          {/* AI Chat */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {[
              { role: 'assistant', text: "Let's start by clarifying requirements. What rate limiting algorithms do you know? Walk me through their trade-offs." },
              { role: 'user', text: "I know Token Bucket and Sliding Window. Token Bucket is smoother, Sliding Window is more accurate but memory-intensive." },
              { role: 'assistant', text: "Good! For 1M req/s, what's the bottleneck in a single Redis-based rate limiter? How would you solve it?" },
            ].map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${m.role === 'assistant' ? 'bg-blue-500' : 'bg-slate-600'}`}>
                  {m.role === 'assistant' ? '🤖' : '👤'}
                </div>
                <div className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed ${m.role === 'assistant' ? 'bg-slate-800 text-slate-200' : 'bg-blue-600 text-white'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-800">
            <div className="flex gap-2">
              <input className="flex-1 input-base text-xs py-2" placeholder="Type response..." />
              <button className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Shared Editor</span>
            <Badge variant="green" size="sm">● Live</Badge>
            <div className="ml-auto flex gap-1">
              {['JavaScript', 'Python', 'Java'].map(l => (
                <button key={l} className="px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded">{l}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={code}
              height="100%"
              extensions={[javascript()]}
              theme={oneDark}
              onChange={val => setCode(val)}
            />
          </div>

          {/* AI Feedback Bar */}
          <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center gap-3">
            <span className="text-xs text-slate-500">🤖 AI Feedback:</span>
            <span className="text-xs text-yellow-400">Consider using Redis INCR with EXPIRE for distributed rate limiting</span>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-4 py-4 bg-slate-900 border-t border-slate-800">
        <button onClick={() => setMuted(!muted)} className={`p-3 rounded-full transition-all ${muted ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
          {muted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button onClick={() => setCamOff(!camOff)} className={`p-3 rounded-full transition-all ${camOff ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
          {camOff ? <VideoOff size={18} /> : <Video size={18} />}
        </button>
        <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600">
          <MessageSquare size={18} />
        </button>
        <button onClick={() => setView('list')} className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700">
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Mock Interview Simulator</h1>
        <p className="text-slate-400 text-sm mt-1">Full 45-minute mock interviews with AI or peers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Available Slots</h2>
              <Badge variant="blue">Next 7 days</Badge>
            </div>
            <div className="space-y-2.5">
              {upcomingSlots.map((slot, i) => (
                <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${slot.available ? 'border-slate-700 hover:border-slate-600' : 'border-slate-800 opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">{slot.date}</p>
                      <p className="text-sm font-bold text-white">{slot.time}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-700" />
                    <div>
                      <p className="text-sm font-medium text-white">{slot.domain}</p>
                      <Badge variant={slot.type === 'AI' ? 'blue' : 'purple'} size="sm">{slot.type}</Badge>
                    </div>
                  </div>
                  {slot.available ? (
                    <Button size="sm" onClick={() => setView('room')} iconRight={<ChevronRight size={12} />}>
                      Join
                    </Button>
                  ) : (
                    <Badge variant="default">Full</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Past Interviews */}
          <Card>
            <h2 className="font-semibold text-white mb-4">Interview History</h2>
            <div className="space-y-2">
              {interviewHistory.filter(i => i.status === 'completed').map(interview => (
                <div key={interview.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    interview.score! >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {interview.score}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{interview.domain}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={interview.type === 'AI' ? 'blue' : 'purple'} size="sm">{interview.type}</Badge>
                      <span className="text-xs text-slate-500"><Clock size={10} className="inline" /> {interview.duration}min</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{interview.date}</p>
                    <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">View Report</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border-blue-500/20">
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold text-white mb-1">Start Instant AI Interview</h3>
              <p className="text-xs text-slate-400 mb-4">No scheduling needed. Start right now!</p>
              <Button className="w-full" onClick={() => setView('room')} icon={<Zap size={14} />}>
                Start Now
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-3">What to Expect</h3>
            <div className="space-y-2.5">
              {[
                { icon: Clock, text: '45 minutes, just like real interviews' },
                { icon: Video, text: 'Screen share + voice + code editor' },
                { icon: CheckCircle2, text: 'Detailed scorecard after session' },
                { icon: Users, text: 'Option for peer or AI interviews' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <item.icon size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-3">Avg Performance</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-black text-white">7.9</span>
              <span className="text-green-400 text-sm">↑ 0.4 vs last month</span>
            </div>
            <p className="text-xs text-slate-500">Based on last 4 interviews</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Fix missing import
const Zap = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

export default MockInterview;
