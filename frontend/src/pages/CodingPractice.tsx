import React, { useState } from 'react';
import { Search, Filter, Bookmark, CheckCircle2, Play, Send, ChevronDown, ChevronUp, RotateCcw, Cpu, MemoryStick } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Card, Badge, Button, Input, DifficultyBadge, TabBar } from '../components/ui';
import { dsaProblems } from '../data/mockData';
import { useStore } from '../store/useStore';

const languages = [
  { value: 'java', label: 'Java', ext: java },
  { value: 'python', label: 'Python', ext: python },
  { value: 'javascript', label: 'JavaScript', ext: javascript },
];

const statusStyles: Record<string, string> = {
  accepted: 'text-green-400',
  attempted: 'text-yellow-400',
  not_attempted: 'text-slate-500',
};

const statusIcons: Record<string, string> = {
  accepted: '✓',
  attempted: '~',
  not_attempted: '○',
};

const fakeTestResults = [
  { id: 1, status: 'accepted', input: '[2,7,11,15], target=9', expected: '[0,1]', got: '[0,1]', time: '1ms', memory: '41.8MB' },
  { id: 2, status: 'accepted', input: '[3,2,4], target=6', expected: '[1,2]', got: '[1,2]', time: '0ms', memory: '41.6MB' },
  { id: 3, status: 'wrong_answer', input: '[3,3], target=6', expected: '[0,1]', got: '[1,0]', time: '0ms', memory: '41.5MB' },
];

const CodingPractice: React.FC = () => {
  const { solvedProblems, bookmarkedProblems, toggleBookmark, markProblemSolved } = useStore();
  const [selectedProblem, setSelectedProblem] = useState(dsaProblems[0]);
  const [lang, setLang] = useState('java');
  const [code, setCode] = useState<Record<string, string>>(
    Object.fromEntries(dsaProblems.map(p => [p.id + '_java', p.starterCode.java]))
  );
  const [activeTab, setActiveTab] = useState('description');
  const [resultTab, setResultTab] = useState<'testcases' | 'result' | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<typeof fakeTestResults | null>(null);
  const [submitResult, setSubmitResult] = useState<{ status: string; runtime: number; memory: string; percentile: number } | null>(null);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');
  const [panelOpen, setPanelOpen] = useState(true);

  const codeKey = `${selectedProblem.id}_${lang}`;
  const currentCode = code[codeKey] ?? (selectedProblem.starterCode as Record<string, string>)[lang] ?? '';

  const handleRun = async () => {
    setRunning(true);
    setResultTab('result');
    await new Promise(r => setTimeout(r, 1500));
    setTestResults(fakeTestResults);
    setRunning(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResultTab('result');
    await new Promise(r => setTimeout(r, 2000));
    const accepted = Math.random() > 0.3;
    setSubmitResult({
      status: accepted ? 'Accepted' : 'Wrong Answer',
      runtime: Math.floor(Math.random() * 5) + 1,
      memory: '41.8 MB',
      percentile: accepted ? Math.floor(Math.random() * 30) + 70 : 0,
    });
    if (accepted) markProblemSolved(selectedProblem.id);
    setSubmitting(false);
  };

  const filtered = dsaProblems.filter(p => {
    if (diffFilter !== 'all' && p.difficulty !== diffFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const langExt = languages.find(l => l.value === lang)?.ext ?? javascript;

  return (
    <div className="flex h-[calc(100vh-4rem)] -mx-5 -my-5 lg:-mx-6 lg:-my-6 overflow-hidden">
      {/* Problem List */}
      <div className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-slate-800 space-y-2">
          <Input placeholder="Search problems..." icon={<Search size={13} />} value={search} onChange={e => setSearch(e.target.value)} className="text-xs" />
          <div className="flex gap-1">
            {['all','easy','medium','hard'].map(d => (
              <button key={d} onClick={() => setDiffFilter(d)} className={`flex-1 py-1 rounded text-xs capitalize transition-all ${diffFilter === d ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{d}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((p, i) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProblem(p);
                setTestResults(null);
                setSubmitResult(null);
                setResultTab(null);
              }}
              className={`flex items-start gap-2.5 px-3 py-2.5 cursor-pointer border-b border-slate-800/50 transition-colors ${selectedProblem.id === p.id ? 'bg-blue-500/10' : 'hover:bg-slate-800'}`}
            >
              <span className={`text-sm mt-0.5 font-mono ${statusStyles[p.status]}`}>{statusIcons[p.status]}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${selectedProblem.id === p.id ? 'text-blue-400' : 'text-white'}`}>
                  {i + 1}. {p.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <DifficultyBadge difficulty={p.difficulty} />
                  <span className="text-xs text-slate-600">{p.acceptance}%</span>
                </div>
              </div>
              {bookmarkedProblems.has(p.id) && <Bookmark size={11} className="text-yellow-400 mt-1 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main: Problem + Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Panel */}
        <div className="w-[45%] flex-shrink-0 flex flex-col border-r border-slate-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-800 bg-slate-900">
            {[
              { id: 'description', label: 'Description' },
              { id: 'hints', label: 'Hints' },
              { id: 'solutions', label: 'Solutions' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5">
              <button onClick={() => toggleBookmark(selectedProblem.id)}
                className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${bookmarkedProblems.has(selectedProblem.id) ? 'text-yellow-400' : 'text-slate-400'}`}>
                <Bookmark size={14} />
              </button>
              {solvedProblems.has(selectedProblem.id) && <CheckCircle2 size={14} className="text-green-400" />}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-bold text-white">{selectedProblem.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <DifficultyBadge difficulty={selectedProblem.difficulty} />
                    <span className="text-xs text-slate-500">Acceptance: {selectedProblem.acceptance}%</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedProblem.description}</p>
                </div>

                {selectedProblem.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-semibold mb-2">Example {i + 1}:</p>
                    <div className="font-mono text-xs space-y-1">
                      <div><span className="text-slate-400">Input: </span><span className="text-slate-200">{ex.input}</span></div>
                      <div><span className="text-slate-400">Output: </span><span className="text-green-400">{ex.output}</span></div>
                      {ex.explanation && <div><span className="text-slate-400">Explanation: </span><span className="text-slate-300">{ex.explanation}</span></div>}
                    </div>
                  </div>
                ))}

                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">CONSTRAINTS</p>
                  <ul className="space-y-1">
                    {selectedProblem.constraints.map((c, i) => (
                      <li key={i} className="text-xs text-slate-300 font-mono bg-slate-800 rounded px-2 py-1">{c}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">COMPANIES</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProblem.companies.map(c => <Badge key={c} variant="blue" size="sm">{c}</Badge>)}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'hints' && (
              <div className="space-y-3">
                {['Try using a hash map to store values you\'ve seen.', 'For each number, check if (target - number) exists in your map.', 'Return indices of the two numbers that add up to target.'].map((hint, i) => (
                  <details key={i} className="bg-slate-800 rounded-xl">
                    <summary className="px-4 py-3 text-sm text-blue-400 cursor-pointer">Hint {i + 1}</summary>
                    <p className="px-4 pb-3 text-sm text-slate-300">{hint}</p>
                  </details>
                ))}
              </div>
            )}
            {activeTab === 'solutions' && (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">🔒</div>
                <p className="text-slate-400 text-sm">Solutions available for Pro users</p>
                <Button size="sm" className="mt-3">Upgrade to Pro</Button>
              </div>
            )}
          </div>
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800">
            <div className="flex gap-1">
              {languages.map(l => (
                <button key={l.value} onClick={() => setLang(l.value)}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${lang === l.value ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  {l.label}
                </button>
              ))}
            </div>
            <button
              className="ml-auto text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
              onClick={() => {
                const starter = (selectedProblem.starterCode as Record<string, string>)[lang];
                setCode(c => ({ ...c, [codeKey]: starter }));
              }}
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={currentCode}
              height="100%"
              extensions={[langExt()]}
              theme={oneDark}
              onChange={(val) => setCode(c => ({ ...c, [codeKey]: val }))}
              basicSetup={{ lineNumbers: true, foldGutter: true, tabSize: 2 }}
            />
          </div>

          {/* Bottom panel */}
          <div className={`border-t border-slate-800 bg-slate-900 flex flex-col transition-all ${panelOpen ? 'h-56' : 'h-12'}`}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPanelOpen(!panelOpen)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  {panelOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
                <span className="text-xs text-slate-400 font-medium">Test Cases</span>
                {testResults && (
                  <Badge variant={testResults.every(r => r.status === 'accepted') ? 'green' : 'red'} size="sm">
                    {testResults.filter(r => r.status === 'accepted').length}/{testResults.length} passed
                  </Badge>
                )}
                {submitResult && (
                  <Badge variant={submitResult.status === 'Accepted' ? 'green' : 'red'} size="sm">
                    {submitResult.status}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="xs" variant="secondary" icon={<Play size={12} />} loading={running} onClick={handleRun}>Run</Button>
                <Button size="xs" icon={<Send size={12} />} loading={submitting} onClick={handleSubmit}>Submit</Button>
              </div>
            </div>

            {panelOpen && (
              <div className="flex-1 overflow-y-auto p-3">
                {running && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Running test cases...
                  </div>
                )}
                {submitting && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Submitting solution...
                  </div>
                )}
                {submitResult && !submitting && (
                  <div className={`space-y-3 ${submitResult.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                    <div className="flex items-center gap-2">
                      {submitResult.status === 'Accepted' ? <CheckCircle2 size={18} /> : <span>✗</span>}
                      <span className="font-bold text-base">{submitResult.status}</span>
                    </div>
                    {submitResult.status === 'Accepted' && (
                      <div className="flex gap-6 text-xs text-slate-400">
                        <div><span className="text-slate-300 font-medium">{submitResult.runtime}ms</span> runtime · beats {submitResult.percentile}%</div>
                        <div><span className="text-slate-300 font-medium">{submitResult.memory}</span> memory</div>
                      </div>
                    )}
                  </div>
                )}
                {testResults && !submitting && !submitResult && (
                  <div className="space-y-2">
                    {testResults.map((r, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2 rounded-lg text-xs border ${r.status === 'accepted' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                        <span className={r.status === 'accepted' ? 'text-green-400' : 'text-red-400'}>
                          {r.status === 'accepted' ? '✓' : '✗'} Case {i + 1}
                        </span>
                        <span className="text-slate-500 font-mono">{r.input}</span>
                        {r.status !== 'accepted' && (
                          <>
                            <span className="text-red-400">Got: {r.got}</span>
                            <span className="text-green-400">Expected: {r.expected}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {!running && !submitting && !testResults && !submitResult && (
                  <p className="text-xs text-slate-600">Click Run to test your code against sample test cases</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
