import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Clock, CheckCircle2, ChevronRight, Star, Zap } from 'lucide-react';
import { Card, Badge, Button, DifficultyBadge, Avatar } from '../components/ui';
import { dailyChallenge, mcqQuestions } from '../data/mockData';
import { useStore } from '../store/useStore';

const DailyChallenge: React.FC = () => {
  const { user, markProblemSolved, updateXP } = useStore();
  const [mcqIndex, setMcqIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [mcqDone, setMcqDone] = useState(false);
  const [dsaDone, setDsaDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(86400);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const currentQ = dailyChallenge.mcqs[mcqIndex];

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === currentQ.correct) setMcqScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (mcqIndex < dailyChallenge.mcqs.length - 1) {
      setMcqIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setMcqDone(true);
      updateXP(25);
    }
  };

  const completeDSA = () => {
    setDsaDone(true);
    markProblemSolved(dailyChallenge.problem.id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Daily Challenge</h1>
            <Badge variant="orange" size="md">🔥 Day {user?.streak ?? 14}</Badge>
          </div>
          <p className="text-slate-400 text-sm">{dailyChallenge.date}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-1">Resets in</p>
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 font-mono text-lg font-bold text-white">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <Card className="bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-slate-900 border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-xl">
              <Zap size={24} className="text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Today's XP Target: 90 XP</p>
              <p className="text-sm text-slate-400">Complete all 3 tasks to maintain your streak</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{(dsaDone ? 50 : 0) + (mcqDone ? 25 : 0)} / 90</p>
            <p className="text-xs text-slate-500">XP earned today</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-slate-700/50 rounded-full">
          <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${(((dsaDone ? 50 : 0) + (mcqDone ? 25 : 0)) / 90) * 100}%` }} />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: DSA + MCQ */}
        <div className="lg:col-span-2 space-y-5">
          {/* DSA Problem */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">1</span>
                </div>
                <div>
                  <h2 className="font-semibold text-white">Today's DSA Problem</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <DifficultyBadge difficulty={dailyChallenge.problem.difficulty} />
                    <span className="text-xs text-slate-500">+50 XP</span>
                  </div>
                </div>
              </div>
              {dsaDone && <CheckCircle2 className="text-green-400" size={20} />}
            </div>

            <div className={`${dsaDone ? 'opacity-60' : ''}`}>
              <h3 className="font-medium text-white text-lg mb-2">{dailyChallenge.problem.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{dailyChallenge.problem.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {dailyChallenge.problem.topics.map(t => <Badge key={t} variant="blue" size="sm">{t}</Badge>)}
              </div>
            </div>

            {!dsaDone ? (
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => window.location.href = '/practice/coding'} iconRight={<ChevronRight size={14} />}>
                  Solve in Editor
                </Button>
                <Button variant="secondary" size="md" onClick={completeDSA}>
                  Mark Done ✓
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <CheckCircle2 size={16} />
                Completed! +50 XP earned
              </div>
            )}
          </Card>

          {/* MCQ Quiz */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-sm">2</span>
                </div>
                <div>
                  <h2 className="font-semibold text-white">5 Quick MCQs</h2>
                  <p className="text-xs text-slate-500">+5 XP each · Various topics</p>
                </div>
              </div>
              {mcqDone
                ? <CheckCircle2 className="text-green-400" size={20} />
                : <Badge variant="purple">{mcqIndex + 1} / {dailyChallenge.mcqs.length}</Badge>
              }
            </div>

            {mcqDone ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">{mcqScore >= 4 ? '🎉' : mcqScore >= 3 ? '👍' : '💪'}</div>
                <p className="text-xl font-bold text-white">{mcqScore}/{dailyChallenge.mcqs.length} Correct</p>
                <p className="text-slate-400 text-sm mt-1">{mcqScore * 5} XP earned · {mcqScore >= 4 ? 'Excellent!' : 'Keep practicing!'}</p>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div className="flex gap-1 mb-5">
                  {dailyChallenge.mcqs.map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full ${i < mcqIndex ? 'bg-green-500' : i === mcqIndex ? 'bg-blue-500' : 'bg-slate-700'}`} />
                  ))}
                </div>

                <div className="bg-slate-800 rounded-xl p-4 mb-4">
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">{currentQ.question}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default" size="sm">{currentQ.topic}</Badge>
                    <DifficultyBadge difficulty={currentQ.difficulty} />
                  </div>
                </div>

                <div className="space-y-2">
                  {currentQ.options.map((opt, idx) => {
                    let style = 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800';
                    if (showResult) {
                      if (idx === currentQ.correct) style = 'border-green-500 bg-green-500/10 text-green-400';
                      else if (idx === selectedAnswer) style = 'border-red-500 bg-red-500/10 text-red-400';
                      else style = 'border-slate-700 text-slate-600 opacity-50';
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={showResult}
                        className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${style}`}
                      >
                        <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <>
                    <div className={`mt-4 p-3 rounded-xl text-sm ${selectedAnswer === currentQ.correct ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                      <p className="font-medium mb-1">{selectedAnswer === currentQ.correct ? '✅ Correct!' : '❌ Incorrect'}</p>
                      <p className="text-xs opacity-80">{currentQ.explanation}</p>
                    </div>
                    <Button className="w-full mt-3" onClick={nextQuestion} iconRight={<ChevronRight size={14} />}>
                      {mcqIndex < dailyChallenge.mcqs.length - 1 ? 'Next Question' : 'See Results'}
                    </Button>
                  </>
                )}
              </>
            )}
          </Card>

          {/* Concept of the day */}
          <Card className="border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold text-sm">3</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-white">Concept of the Day</h2>
                  <Badge variant="cyan" size="sm">+15 XP</Badge>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{dailyChallenge.concept.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{dailyChallenge.concept.summary}</p>
                <div className="flex items-center gap-3">
                  <Badge variant="default" size="sm"><Clock size={10} className="mr-1" />{dailyChallenge.concept.readTime} read</Badge>
                  <Button size="sm" variant="outline" iconRight={<ChevronRight size={12} />}>Read Article</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Leaderboard */}
        <div className="space-y-5">
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <Trophy size={18} className="text-yellow-400" />
              <h2 className="font-semibold text-white">Today's Leaderboard</h2>
            </div>
            <div className="space-y-2">
              {dailyChallenge.leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 p-2.5 rounded-xl ${entry.isCurrentUser ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-slate-800'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' : entry.rank === 2 ? 'bg-slate-400 text-slate-900' : entry.rank === 3 ? 'bg-amber-600 text-amber-100' : 'bg-slate-700 text-slate-400'}`}>
                    {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank}
                  </div>
                  <span className="text-sm">{entry.country}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${entry.isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                      {entry.name} {entry.isCurrentUser ? '(You)' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Zap size={12} />
                    <span className="text-sm font-semibold">{entry.xp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border-orange-500/20">
            <div className="text-center">
              <Flame size={40} className="text-orange-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white">{user?.streak ?? 14}</p>
              <p className="text-slate-400 text-sm">Day Streak</p>
              <p className="text-xs text-slate-500 mt-1">Longest: 21 days</p>
              <div className="mt-4 grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`h-6 rounded flex items-center justify-center text-xs ${i < 6 ? 'bg-orange-400/20 text-orange-400' : 'bg-slate-700 text-slate-600'}`}>
                    {['M','T','W','T','F','S','S'][i]}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
