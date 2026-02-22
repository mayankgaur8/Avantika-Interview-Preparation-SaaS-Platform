import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, BarChart3, RefreshCw, ChevronRight, Mic, Square } from 'lucide-react';
import { Card, Badge, Button, Progress, DifficultyBadge } from '../components/ui';
import { useStore } from '../store/useStore';

type Stage = 'setup' | 'interview' | 'report';

interface Message { role: 'assistant' | 'user'; content: string; timestamp: Date }

const domains = [
  { id: 'dsa', label: 'Data Structures & Algorithms', icon: '🧩', desc: 'Arrays, Trees, Graphs, DP' },
  { id: 'system_design', label: 'System Design', icon: '🏗️', desc: 'HLD, Distributed Systems, Scale' },
  { id: 'behavioral', label: 'Behavioral / HR', icon: '🎯', desc: 'Leadership, STAR method' },
  { id: 'backend', label: 'Backend Engineering', icon: '⚙️', desc: 'APIs, Databases, Microservices' },
  { id: 'frontend', label: 'Frontend Development', icon: '⚛️', desc: 'React, TypeScript, Performance' },
  { id: 'fullstack', label: 'Full Stack', icon: '🔗', desc: 'End-to-end questions' },
];

const difficulties = [
  { id: 'fresher', label: 'Fresher', desc: '0–1 year experience', color: 'green' },
  { id: 'mid', label: 'Mid-Level', desc: '2–5 years', color: 'yellow' },
  { id: 'senior', label: 'Senior', desc: '6–10 years', color: 'red' },
];

const aiResponses: Record<string, string[]> = {
  dsa: [
    `Welcome! I'm your interviewer today. Let's start with a classic problem.\n\n**Problem: Merge Intervals**\n\nGiven an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals.\n\n**Example:**\n- Input: [[1,3],[2,6],[8,10],[15,18]]\n- Output: [[1,6],[8,10],[15,18]]\n\nBefore jumping to code, walk me through your approach. What's the brute force, and can we do better?`,
    `Good thinking! I like that you're considering the sorting approach. Let me ask a follow-up:\n\nIf we sort by start time first, how would that simplify the merging step? What's the time complexity of this approach versus brute force?\n\nAlso, can you handle the edge case where one interval completely swallows another, like [1,10] and [2,5]?`,
    `Excellent! Your O(n log n) solution is correct and handles all edge cases. Let me push you a bit further:\n\n1. Can you code this up and handle the edge cases we discussed?\n2. What would change if instead of merging, we needed to find the **minimum number of rooms** needed to schedule all intervals? (Hint: this is a different problem!)`,
    `That's a great solution! Your code looks clean. Just one thing — in your merge condition, you're using \`intervals[i][0] <= last[1]\`, but what about when intervals[i][0] == last[1]? Should those be merged?\n\nFor example: [[1,3],[3,5]] — are these overlapping?\n\nThis is a common edge case that catches many candidates. How would you handle it?`,
    `Excellent work! This was a strong performance. You demonstrated clear problem-solving methodology — you clarified the problem, considered edge cases, and arrived at an optimal O(n log n) solution.\n\nLet me generate your interview report...`,
  ],
  system_design: [
    `Welcome! Let's dive into a system design interview.\n\n**Design Question: URL Shortener (like bit.ly)**\n\nBefore we start designing, I'd like you to clarify some requirements. What questions would you ask to scope this problem?\n\nThink about: scale, functionality, non-functional requirements, constraints.`,
    `Great clarifying questions! Let me answer them:\n\n- **Scale:** 100M URL shortening requests per day\n- **Read/Write ratio:** 100:1 (mostly redirects)\n- **Custom aliases:** Yes, users can request custom short codes\n- **Analytics:** Basic click tracking\n- **Expiration:** Optional, URLs can expire\n\nNow let's move to capacity estimation. What are the key numbers you'd calculate first?`,
    `Good estimation! You correctly identified:\n- ~1,160 requests/second average\n- Peak ~3,500 req/s\n- Storage: ~50GB/day for URL data\n\nNow draw the high-level architecture. What are the core components? How does a redirect request flow through the system?\n\nThink about: what happens when a user visits http://avnt.ka/abc123`,
    `Solid architecture! I particularly like that you called out:\n✅ Read path optimization with CDN/Redis cache\n✅ Separate read and write services\n\nNow let me ask about the URL shortening algorithm specifically:\n- How do you generate the 6-character code?\n- What prevents collisions?\n- What happens in a distributed setup — could two servers generate the same code?\n\nCompare: **Counter + Base62 encoding** vs **MD5 hash + truncation**`,
    `You've handled the design well. Final question:\n\nIf this system needs to go from 1 server to handling 1 Billion redirects/day, walk me through the scaling steps. What breaks first, and how do you fix it?\n\nThis will complete our interview — excellent session!`,
  ],
  behavioral: [
    `Welcome to your behavioral interview! I'll be using Amazon's Leadership Principles as our framework.\n\nLet's start with the first question:\n\n**"Tell me about a time when you had to deliver a project under a tight deadline. What did you do?"**\n\nPlease use the STAR format in your answer:\n- **Situation:** What was the context?\n- **Task:** What was your specific responsibility?\n- **Action:** What did you do?\n- **Result:** What was the outcome?`,
    `That's a good example! I noticed you covered Situation and Task well. Let me push you on the Action part:\n\n- You mentioned you "worked harder" — can you be more specific about what actions you took?\n- Did you involve others? How did you prioritize?\n- What trade-offs did you make?\n\n**Follow-up:** At Amazon, we value "Deliver Results." In your story, what was the concrete, measurable impact of your actions? Numbers always strengthen an answer.`,
    `Much better with the specifics! The quantified result (30% faster delivery) is strong.\n\nNext question:\n\n**"Tell me about a time you disagreed with your manager or tech lead. How did you handle it?"**\n\nThis tests "Have Backbone; Disagree and Commit." I'm looking for you to show you can voice disagreement respectfully but then commit to the decision once it's made.`,
    `Good self-awareness in your answer! I see you understand that respectful disagreement is valued here.\n\nOne final question:\n\n**"Describe a situation where you had to learn something completely new quickly to deliver a project."**\n\nThis maps to "Learn and Be Curious." I'm looking for genuine intellectual humility and a structured approach to learning.`,
    `Excellent behavioral interview! You demonstrated strong command of STAR format and connected your stories to concrete outcomes.\n\nYour strongest area: **Deliver Results** — great quantified outcomes.\nArea to strengthen: **Disagree and Commit** — consider a story where you advocated more firmly before aligning.\n\nGenerating your full report now...`,
  ],
};

const getAIResponse = (domain: string, messageIndex: number): string => {
  const responses = aiResponses[domain] ?? aiResponses.dsa;
  return responses[Math.min(messageIndex, responses.length - 1)];
};

const reportData = {
  overall: 8.2,
  dimensions: [
    { name: 'Problem Understanding', score: 9, max: 10 },
    { name: 'Solution Approach', score: 8, max: 10 },
    { name: 'Communication', score: 8.5, max: 10 },
    { name: 'Code Quality', score: 7.5, max: 10 },
    { name: 'Edge Cases', score: 8, max: 10 },
  ],
  strengths: ['Clear problem clarification', 'Good complexity analysis', 'Explained thought process throughout'],
  improvements: ['Handle all edge cases more systematically', 'Write cleaner variable names under pressure', 'Discuss space-time trade-offs more explicitly'],
  verdict: 'Strong Hire',
  verdictColor: 'text-green-400',
};

const AIInterview: React.FC = () => {
  const { user, updateXP } = useStore();
  const [stage, setStage] = useState<Stage>('setup');
  const [domain, setDomain] = useState('dsa');
  const [difficulty, setDifficulty] = useState('mid');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (stage === 'interview') {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const startInterview = async () => {
    setStage('interview');
    setMessages([]);
    setMsgCount(0);
    setElapsed(0);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    const opening = getAIResponse(domain, 0);
    setMessages([{ role: 'assistant', content: opening, timestamp: new Date() }]);
    setIsTyping(false);
    setMsgCount(1);
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

    const responseIdx = msgCount;
    const responses = aiResponses[domain] ?? aiResponses.dsa;
    const isLast = responseIdx >= responses.length - 1;
    const aiMsg = getAIResponse(domain, responseIdx);
    setMessages(prev => [...prev, { role: 'assistant', content: aiMsg, timestamp: new Date() }]);
    setIsTyping(false);
    setMsgCount(c => c + 1);

    if (isLast) {
      await new Promise(r => setTimeout(r, 800));
      if (timerRef.current) clearInterval(timerRef.current);
      setStage('report');
      updateXP(100);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── SETUP ──
  if (stage === 'setup') return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Interview Simulator</h1>
        <p className="text-slate-400 text-sm mt-1">Practice with an AI interviewer that adapts to your level</p>
      </div>

      <Card>
        <h2 className="font-semibold text-white mb-4">Select Interview Domain</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {domains.map(d => (
            <button key={d.id} onClick={() => setDomain(d.id)}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                domain === d.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
              }`}>
              <span className="text-2xl">{d.icon}</span>
              <div>
                <p className={`font-medium text-sm ${domain === d.id ? 'text-blue-400' : 'text-white'}`}>{d.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-white mb-4">Difficulty Level</h2>
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map(d => (
            <button key={d.id} onClick={() => setDifficulty(d.id)}
              className={`p-4 rounded-xl border text-center transition-all ${
                difficulty === d.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'
              }`}>
              <p className={`font-medium ${difficulty === d.id ? 'text-blue-400' : 'text-white'}`}>{d.label}</p>
              <p className="text-xs text-slate-500 mt-1">{d.desc}</p>
            </button>
          ))}
        </div>
      </Card>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-400">
        <p className="font-medium text-white mb-1">📋 Interview Format</p>
        <ul className="space-y-1 text-xs">
          <li>• AI will ask 4–5 questions with follow-ups</li>
          <li>• Respond naturally — type as you would speak</li>
          <li>• Estimated duration: 25–45 minutes</li>
          <li>• You'll receive a detailed scorecard after</li>
        </ul>
      </div>

      <Button size="lg" className="w-full" onClick={startInterview} icon={<Zap size={18} />}>
        Start Interview — {domains.find(d => d.id === domain)?.label}
      </Button>
    </div>
  );

  // ── REPORT ──
  if (stage === 'report') return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <div className="text-5xl mb-3">📊</div>
        <h1 className="text-2xl font-bold text-white">Interview Complete!</h1>
        <p className="text-slate-400 mt-1">Duration: {formatTime(elapsed)} · {domains.find(d => d.id === domain)?.label}</p>
      </div>

      {/* Overall score */}
      <Card className="text-center py-8 bg-gradient-to-br from-blue-900/30 to-purple-900/20 border-blue-500/20">
        <div className="text-6xl font-black text-white mb-1">{reportData.overall}</div>
        <div className="text-slate-400 mb-3">out of 10</div>
        <Badge variant="green" size="md" className="text-base px-4 py-1">{reportData.verdict}</Badge>
        <p className="text-slate-400 text-sm mt-2">+100 XP earned!</p>
      </Card>

      {/* Dimension scores */}
      <Card>
        <h3 className="font-semibold text-white mb-4">Performance Breakdown</h3>
        <div className="space-y-3">
          {reportData.dimensions.map(dim => (
            <div key={dim.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{dim.name}</span>
                <span className="text-white font-medium">{dim.score}/10</span>
              </div>
              <Progress value={dim.score * 10} color={dim.score >= 8 ? 'green' : dim.score >= 6 ? 'blue' : 'yellow'} size="sm" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-green-400 mb-3">✅ Strengths</h3>
          <ul className="space-y-1.5">
            {reportData.strengths.map((s, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>{s}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-yellow-400 mb-3">💡 Areas to Improve</h3>
          <ul className="space-y-1.5">
            {reportData.improvements.map((s, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>{s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1" icon={<RefreshCw size={14} />} onClick={() => setStage('setup')}>
          New Interview
        </Button>
        <Button variant="secondary" className="flex-1" iconRight={<ChevronRight size={14} />}>
          Share Report
        </Button>
      </div>
    </div>
  );

  // ── INTERVIEW ──
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-5 -my-5 lg:-mx-6 lg:-my-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">AI Interviewer</p>
            <p className="text-xs text-slate-400">{domains.find(d => d.id === domain)?.label} · {difficulties.find(d => d.id === difficulty)?.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm bg-slate-800 px-3 py-1 rounded-lg text-white">{formatTime(elapsed)}</div>
          <Button variant="danger" size="sm" onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setStage('report'); updateXP(50); }}>
            End Interview
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-slate-700'
            }`}>
              {msg.role === 'assistant' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-white" />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'assistant' ? 'bg-slate-800 text-slate-200 rounded-tl-sm' : 'bg-blue-600 text-white rounded-tr-sm'
            }`}>
              {msg.content.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : <span key={j}>{part}</span>)}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your response... (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="input-base resize-none pr-10 text-sm leading-relaxed"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setRecording(!recording)}
              className={`p-2.5 rounded-xl border transition-all ${recording ? 'bg-red-500 border-red-500 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'}`}
              title="Voice input"
            >
              {recording ? <Square size={14} /> : <Mic size={14} />}
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        <p className="text-xs text-center text-slate-600 mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default AIInterview;
