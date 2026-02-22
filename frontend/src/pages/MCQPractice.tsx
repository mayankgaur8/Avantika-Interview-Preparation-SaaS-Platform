import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Clock, ChevronRight, RotateCcw, Trophy, Target, CheckCircle2, XCircle } from 'lucide-react';
import { Card, Badge, Button, Progress, DifficultyBadge } from '../components/ui';
import { mcqTopics, mcqQuestions } from '../data/mockData';
import { useStore } from '../store/useStore';

type Stage = 'select' | 'quiz' | 'result';

const MCQPractice: React.FC = () => {
  const { updateXP } = useStore();
  const [stage, setStage] = useState<Stage>('select');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [questions, setQuestions] = useState(mcqQuestions.slice(0, 10));

  const startQuiz = () => {
    const qs = difficulty === 'all'
      ? mcqQuestions.slice(0, questionCount)
      : mcqQuestions.filter(q => q.difficulty === difficulty).slice(0, questionCount);
    setQuestions(qs.length > 0 ? qs : mcqQuestions.slice(0, questionCount));
    setAnswers(new Array(Math.min(questionCount, qs.length)).fill(null));
    setCurrentIndex(0);
    setSelected(null);
    setShowExplain(false);
    setTimeLeft(30);
    setTimerActive(true);
    setStage('quiz');
  };

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplain(true);
    setTimerActive(false);
    const updated = [...answers];
    updated[currentIndex] = idx;
    setAnswers(updated);
  }, [selected, answers, currentIndex]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, handleAnswer]);

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setShowExplain(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setTimerActive(false);
      const score = answers.filter((a, i) => a === questions[i]?.correct).length;
      updateXP(score * 5);
      setStage('result');
    }
  };

  const reset = () => {
    setStage('select');
    setSelectedTopic(null);
    setSelected(null);
    setShowExplain(false);
  };

  const score = answers.filter((a, i) => a === questions[i]?.correct).length;
  const currentQ = questions[currentIndex];

  // ── SELECT ──
  if (stage === 'select') return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">MCQ Practice</h1>
        <p className="text-slate-400 text-sm mt-1">15,000+ questions across all domains</p>
      </div>

      {/* Topic Grid */}
      <Card>
        <h2 className="font-semibold text-white mb-4">Choose a Topic</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {mcqTopics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id === selectedTopic ? null : topic.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedTopic === topic.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
              }`}
            >
              <div className="text-xl mb-1">{topic.icon}</div>
              <p className="text-sm font-medium text-white truncate">{topic.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{topic.questionsCount} Qs</p>
              <div className="mt-2 h-1 bg-slate-700 rounded-full">
                <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${topic.avgScore}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">Avg: {topic.avgScore}%</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-semibold text-white mb-3">Number of Questions</h2>
          <div className="flex gap-2">
            {[5, 10, 20, 30].map(n => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  questionCount === n ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >{n}</button>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold text-white mb-3">Difficulty</h2>
          <div className="flex gap-2">
            {['all', 'easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all capitalize ${
                  difficulty === d ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >{d}</button>
            ))}
          </div>
        </Card>
      </div>

      <Button size="lg" className="w-full" onClick={startQuiz} icon={<Brain size={18} />}>
        Start Quiz — {questionCount} Questions
      </Button>
    </div>
  );

  // ── RESULT ──
  if (stage === 'result') {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <Card className="text-center py-10">
          <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className="text-3xl font-black text-white mb-1">{pct}%</h2>
          <p className="text-slate-400 mb-6">{score} out of {questions.length} correct</p>
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{score}</p>
              <p className="text-xs text-slate-500">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{questions.length - score}</p>
              <p className="text-xs text-slate-500">Wrong</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{score * 5}</p>
              <p className="text-xs text-slate-500">XP Earned</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={reset} icon={<RotateCcw size={14} />}>Try Again</Button>
            <Button variant="secondary" onClick={() => setStage('quiz')}>Review Answers</Button>
          </div>
        </Card>

        {/* Answer review */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white">Answer Review</h3>
          {questions.map((q, i) => {
            const correct = answers[i] === q.correct;
            return (
              <Card key={q.id} className={`border ${correct ? 'border-green-500/20' : 'border-red-500/20'}`}>
                <div className="flex items-start gap-3">
                  {correct ? <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium mb-1">{q.question}</p>
                    {!correct && (
                      <p className="text-xs text-green-400 mb-1">✓ Correct: {q.options[q.correct]}</p>
                    )}
                    {!correct && answers[i] !== null && answers[i]! >= 0 && (
                      <p className="text-xs text-red-400 mb-2">✗ Your answer: {q.options[answers[i]!]}</p>
                    )}
                    <p className="text-xs text-slate-500">{q.explanation}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── QUIZ ──
  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Quiz header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Question {currentIndex + 1} / {questions.length}</span>
          <Badge variant="default"><DifficultyBadge difficulty={currentQ?.difficulty ?? 'medium'} /></Badge>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
          <Clock size={16} />
          {timeLeft}s
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 bg-slate-700 rounded-full">
        <div
          className={`h-1.5 rounded-full transition-all ${timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        {questions.map((_, i) => {
          const answered = answers[i] !== null;
          const correct = answered && answers[i] === questions[i]?.correct;
          return (
            <div key={i} className={`flex-1 h-1 rounded-full ${
              i < currentIndex ? (correct ? 'bg-green-500' : 'bg-red-500') :
              i === currentIndex ? 'bg-blue-500' : 'bg-slate-700'
            }`} />
          );
        })}
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="blue">{currentQ?.topic}</Badge>
        </div>
        <p className="text-white text-base font-medium leading-relaxed mb-6">{currentQ?.question}</p>

        <div className="space-y-2.5">
          {currentQ?.options.map((opt, idx) => {
            let cls = 'border-slate-700 text-slate-300 hover:border-blue-500/50 hover:bg-slate-800 cursor-pointer';
            if (showExplain) {
              if (idx === currentQ.correct) cls = 'border-green-500 bg-green-500/10 text-green-300 cursor-default';
              else if (idx === selected) cls = 'border-red-500 bg-red-500/10 text-red-300 cursor-default';
              else cls = 'border-slate-800 text-slate-600 opacity-40 cursor-default';
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showExplain}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${cls}`}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-800 text-xs font-mono font-bold mr-3">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {showExplain && (
          <div className={`mt-4 p-4 rounded-xl text-sm border ${selected === currentQ?.correct ? 'bg-green-500/5 border-green-500/20 text-green-300' : 'bg-red-500/5 border-red-500/20 text-red-300'}`}>
            <p className="font-semibold mb-1">{selected === currentQ?.correct ? '✅ Correct!' : '❌ Incorrect'}</p>
            <p className="text-slate-300 leading-relaxed">{currentQ?.explanation}</p>
          </div>
        )}

        {showExplain && (
          <Button className="w-full mt-4" onClick={nextQuestion} iconRight={<ChevronRight size={14} />}>
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default MCQPractice;
