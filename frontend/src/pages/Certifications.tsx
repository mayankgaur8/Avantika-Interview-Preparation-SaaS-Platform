import React, { useState } from 'react';
import { Award, Clock, CheckCircle2, ChevronRight, Star, Trophy, Shield, Check } from 'lucide-react';
import { Card, Badge, Button, Progress, DifficultyBadge } from '../components/ui';
import { certifications } from '../data/mockData';
import { useStore } from '../store/useStore';

const examQuestions = [
  { q: 'What is the time complexity of QuickSort in the average case?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 1, explanation: 'QuickSort has O(n log n) average time complexity due to the divide-and-conquer approach with balanced partitions.' },
  { q: 'Which data structure uses LIFO ordering?', options: ['Queue', 'Heap', 'Stack', 'Linked List'], correct: 2, explanation: 'Stack uses Last-In-First-Out (LIFO) ordering where the last element added is the first to be removed.' },
  { q: 'What does CAP theorem state in distributed systems?', options: ['You can have all 3: C, A, P', 'You can only choose 2 of 3: C, A, P', 'Consistency always takes priority', 'Availability is optional'], correct: 1, explanation: 'CAP theorem states that a distributed system can only guarantee two of the three properties simultaneously.' },
  { q: 'Which sorting algorithm is stable and has O(n log n) worst case?', options: ['QuickSort', 'HeapSort', 'MergeSort', 'BubbleSort'], correct: 2, explanation: 'MergeSort is stable and guarantees O(n log n) in all cases.' },
  { q: 'In a BST, where are smaller values stored?', options: ['Right subtree', 'Left subtree', 'Root', 'Random'], correct: 1, explanation: 'In a BST, all values in the left subtree are less than the node, and all values in the right subtree are greater.' },
];

type ExamView = 'list' | 'exam' | 'result';

const difficultyMap: Record<string, 'Easy' | 'Medium' | 'Hard'> = {
  'Beginner': 'Easy',
  'Intermediate': 'Medium',
  'Advanced': 'Hard',
};

const Certifications: React.FC = () => {
  const { user } = useStore();
  const [examView, setExamView] = useState<ExamView>('list');
  const [activeCert, setActiveCert] = useState<typeof certifications[0] | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  const startExam = (cert: typeof certifications[0]) => {
    setActiveCert(cert);
    setQIndex(0);
    setAnswers([]);
    setSelected(null);
    setShowExplain(false);
    setTimeLeft(1800);
    setExamView('exam');
  };

  const submitAnswer = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setShowExplain(true);
    setTimeout(() => {
      if (qIndex < examQuestions.length - 1) {
        setQIndex(i => i + 1);
        setSelected(null);
        setShowExplain(false);
      } else {
        setExamView('result');
      }
    }, 1500);
  };

  const score = answers.filter((a, i) => a === examQuestions[i]?.correct).length;
  const passed = score >= Math.ceil(examQuestions.length * 0.7);

  const earnedCerts = certifications.filter(c => c.earned);
  const availableCerts = certifications.filter(c => !c.earned);

  if (examView === 'exam' && activeCert) {
    const q = examQuestions[qIndex];
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">{activeCert.title}</h2>
            <p className="text-sm text-slate-400">Question {qIndex + 1} of {examQuestions.length}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
              <Clock size={14} className="text-orange-400" />
              <span className="font-mono text-sm text-white">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setExamView('list')}>Exit</Button>
          </div>
        </div>

        <div className="flex gap-1">
          {examQuestions.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < qIndex ? 'bg-green-500' : i === qIndex ? 'bg-blue-500' : 'bg-slate-700'}`} />
          ))}
        </div>

        <Card>
          <p className="text-white font-medium text-lg leading-relaxed mb-6">{q.q}</p>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let cls = 'border-slate-700 text-slate-300 hover:border-blue-500 hover:bg-blue-500/5';
              if (selected === idx) cls = 'border-blue-500 bg-blue-500/10 text-blue-300';
              if (showExplain) {
                if (idx === q.correct) cls = 'border-green-500 bg-green-500/10 text-green-300';
                else if (idx === selected) cls = 'border-red-500 bg-red-500/10 text-red-300';
                else cls = 'border-slate-700 text-slate-600 opacity-40';
              }
              return (
                <button key={idx} onClick={() => !showExplain && setSelected(idx)} disabled={showExplain}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${cls}`}>
                  <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + idx)}.</span>{opt}
                </button>
              );
            })}
          </div>
          {showExplain && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
              <p className="font-medium mb-1">💡 Explanation</p>
              <p className="text-xs opacity-80">{q.explanation}</p>
            </div>
          )}
          {!showExplain && (
            <Button className="w-full mt-5" onClick={submitAnswer} disabled={selected === null}>Submit Answer</Button>
          )}
        </Card>
      </div>
    );
  }

  if (examView === 'result' && activeCert) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in text-center">
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl ${passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {passed ? '🏆' : '😞'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{passed ? 'Congratulations!' : 'Better luck next time!'}</h2>
          <p className="text-slate-400 mt-1">{passed ? 'You passed the certification exam!' : 'You need 70% to pass. Keep practicing!'}</p>
        </div>

        <Card>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-black text-white">{score}/{examQuestions.length}</p>
              <p className="text-xs text-slate-500 mt-1">Score</p>
            </div>
            <div>
              <p className={`text-3xl font-black ${passed ? 'text-green-400' : 'text-red-400'}`}>{Math.round((score / examQuestions.length) * 100)}%</p>
              <p className="text-xs text-slate-500 mt-1">Accuracy</p>
            </div>
            <div>
              <p className={`text-lg font-bold mt-1 ${passed ? 'text-green-400' : 'text-red-400'}`}>{passed ? 'PASSED' : 'FAILED'}</p>
              <p className="text-xs text-slate-500 mt-1">Result</p>
            </div>
          </div>
        </Card>

        {passed && (
          <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-yellow-500/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center text-3xl">{activeCert.icon}</div>
              <div className="text-left">
                <p className="font-bold text-white">{activeCert.title}</p>
                <p className="text-sm text-slate-400">Certificate issued to {user?.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Valid for 2 years · ID: CERT-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => setExamView('list')}>Back to Certs</Button>
          {!passed && <Button onClick={() => startExam(activeCert)}>Retry Exam</Button>}
          {passed && <Button>Download Certificate</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Certifications</h1>
          <p className="text-slate-400 text-sm mt-1">Prove your expertise with industry-recognized certifications</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-lg">
          <Trophy size={14} className="text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">{earnedCerts.length} earned</span>
        </div>
      </div>

      {/* Earned Certificates */}
      {earnedCerts.length > 0 && (
        <div>
          <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Award size={16} className="text-yellow-400" />Your Certificates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedCerts.map(cert => (
              <Card key={cert.id} className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {cert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{cert.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cert.subtitle}</p>
                    {cert.earnedDate && <p className="text-xs text-slate-500 mt-1">Issued {cert.earnedDate}</p>}
                    {cert.score && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-xs text-green-400 font-semibold">Score: {cert.score}%</span>
                      </div>
                    )}
                  </div>
                  <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                </div>
                <Button variant="secondary" size="sm" className="w-full mt-3">Download PDF</Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Certifications */}
      <div>
        <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Shield size={16} className="text-blue-400" />Available Certifications
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {availableCerts.map(cert => (
            <Card key={cert.id} className="hover:border-slate-600 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-3xl flex-shrink-0">
                  {cert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white text-sm">{cert.title}</h3>
                    <DifficultyBadge difficulty={difficultyMap[cert.difficulty] ?? 'Medium'} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{cert.subtitle}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cert.description}</p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={10} />{cert.duration} min</span>
                    <span>{cert.questions} questions</span>
                    <span>{cert.passingScore}% to pass</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {cert.skills.slice(0, 3).map(s => (
                      <span key={s} className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-700">
                <Button size="sm" onClick={() => startExam(cert)} iconRight={<ChevronRight size={12} />}>
                  Start Exam
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How it works */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <h2 className="font-semibold text-white mb-4">How Certifications Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { icon: '📚', title: 'Study', desc: 'Complete learning path modules and practice problems' },
            { icon: '🎯', title: 'Practice', desc: 'Take mock exams to assess your readiness' },
            { icon: '✍️', title: 'Exam', desc: 'Pass the timed assessment (70%+ required)' },
            { icon: '🏆', title: 'Certify', desc: 'Download your certificate and share on LinkedIn' },
          ].map(s => (
            <div key={s.title} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="font-semibold text-white text-sm">{s.title}</p>
              <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Certifications;
