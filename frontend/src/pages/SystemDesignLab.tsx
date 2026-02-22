import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Building2, PenTool, Lightbulb, ChevronRight } from 'lucide-react';
import { Card, Badge, Button, Input, DifficultyBadge } from '../components/ui';
import { systemDesignProblems } from '../data/mockData';

const components = [
  { icon: '⚖️', label: 'Load Balancer' },
  { icon: '🗄️', label: 'Database' },
  { icon: '⚡', label: 'Cache (Redis)' },
  { icon: '📬', label: 'Message Queue' },
  { icon: '🌐', label: 'CDN' },
  { icon: '🔐', label: 'Auth Service' },
  { icon: '📊', label: 'Analytics' },
  { icon: '☁️', label: 'Object Store' },
  { icon: '🔍', label: 'Search Engine' },
  { icon: '📡', label: 'API Gateway' },
];

const estimationFactors = [
  { label: 'Daily Active Users', default: '10M' },
  { label: 'Requests/day', default: '100M' },
  { label: 'Peak QPS', default: '1,160/s' },
  { label: 'Data Storage/year', default: '36.5 TB' },
  { label: 'Bandwidth', default: '10 Gbps' },
];

const SystemDesignLab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<typeof systemDesignProblems[0] | null>(null);
  const [activePhase, setActivePhase] = useState('requirements');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [droppedComponents, setDroppedComponents] = useState<{ icon: string; label: string; x: number; y: number }[]>([]);
  const [canvasMsg, setCanvasMsg] = useState('');

  const filtered = systemDesignProblems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const addComponent = (comp: typeof components[0]) => {
    setDroppedComponents(prev => [...prev, {
      ...comp,
      x: Math.random() * 500 + 50,
      y: Math.random() * 250 + 50,
    }]);
    setCanvasMsg(`Added ${comp.label} to canvas`);
    setTimeout(() => setCanvasMsg(''), 2000);
  };

  if (selectedProblem) return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => { setSelectedProblem(null); setDroppedComponents([]); setActivePhase('requirements'); }}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800">← Back</button>
        <div>
          <h1 className="text-xl font-bold text-white">{selectedProblem.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <DifficultyBadge difficulty={selectedProblem.difficulty} />
            <Badge variant="default">{selectedProblem.category}</Badge>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" icon={<Lightbulb size={14} />}>Get Hints</Button>
          <Button size="sm" icon={<PenTool size={14} />}>Save Design</Button>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'requirements', label: '1. Requirements', icon: '📋' },
          { id: 'estimation', label: '2. Estimation', icon: '📊' },
          { id: 'design', label: '3. Design', icon: '🏗️' },
          { id: 'deep-dive', label: '4. Deep Dive', icon: '🔍' },
        ].map(phase => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activePhase === phase.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {phase.icon} {phase.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Canvas */}
        <div className="lg:col-span-2 space-y-4">
          {activePhase === 'requirements' && (
            <Card>
              <h3 className="font-semibold text-white mb-4">Clarify Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-green-400 mb-2">FUNCTIONAL REQUIREMENTS</p>
                  <textarea
                    className="input-base text-sm font-mono h-40 resize-none"
                    placeholder="e.g.&#10;- Users can shorten URLs&#10;- Redirect to original URL&#10;- Custom aliases..."
                    value={notes['functional'] ?? ''}
                    onChange={e => setNotes(n => ({ ...n, functional: e.target.value }))}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-400 mb-2">NON-FUNCTIONAL REQUIREMENTS</p>
                  <textarea
                    className="input-base text-sm font-mono h-40 resize-none"
                    placeholder="e.g.&#10;- 100M URLs/day&#10;- 99.9% availability&#10;- Low latency < 100ms..."
                    value={notes['nonfunctional'] ?? ''}
                    onChange={e => setNotes(n => ({ ...n, nonfunctional: e.target.value }))}
                  />
                </div>
              </div>
            </Card>
          )}

          {activePhase === 'estimation' && (
            <Card>
              <h3 className="font-semibold text-white mb-4">Capacity Estimation</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {estimationFactors.map(f => (
                  <div key={f.label} className="bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">{f.label}</p>
                    <input
                      className="w-full bg-transparent text-blue-400 font-mono font-bold text-base outline-none"
                      defaultValue={f.default}
                    />
                  </div>
                ))}
              </div>
              <textarea
                className="input-base text-sm font-mono h-32 resize-none"
                placeholder="Calculation notes:&#10;100M requests/day ÷ 86400s = ~1160 req/s&#10;Peak = 3x = 3,500 req/s..."
                value={notes['estimation'] ?? ''}
                onChange={e => setNotes(n => ({ ...n, estimation: e.target.value }))}
              />
            </Card>
          )}

          {activePhase === 'design' && (
            <div className="space-y-3">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Architecture Canvas</h3>
                  {canvasMsg && <span className="text-xs text-green-400 animate-fade-in">{canvasMsg}</span>}
                  <Button variant="secondary" size="xs" onClick={() => setDroppedComponents([])}>Clear</Button>
                </div>
                <div className="relative bg-slate-950 border border-slate-700 rounded-xl overflow-hidden" style={{ height: 360 }}>
                  {/* Grid background */}
                  <svg className="absolute inset-0 w-full h-full opacity-10">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {droppedComponents.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <PenTool size={32} className="text-slate-700 mx-auto mb-2" />
                        <p className="text-slate-600 text-sm">Add components from the palette →</p>
                      </div>
                    </div>
                  )}

                  {droppedComponents.map((comp, i) => (
                    <div
                      key={i}
                      className="absolute bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-1.5 cursor-move shadow-lg"
                      style={{ left: comp.x % 550, top: comp.y % 320 }}
                    >
                      <span className="text-base">{comp.icon}</span>
                      {comp.label}
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="font-semibold text-white mb-2">Design Notes</h3>
                <textarea
                  className="input-base text-sm font-mono h-28 resize-none"
                  placeholder="Describe your design decisions..."
                  value={notes['design'] ?? ''}
                  onChange={e => setNotes(n => ({ ...n, design: e.target.value }))}
                />
              </Card>
            </div>
          )}

          {activePhase === 'deep-dive' && (
            <Card>
              <h3 className="font-semibold text-white mb-4">Deep Dive Topics</h3>
              {[
                { title: 'URL Shortening Algorithm', desc: 'Base62 encoding vs. MD5 hash. Trade-offs and collision handling.' },
                { title: 'Database Choice', desc: 'SQL vs NoSQL — why a key-value store (DynamoDB) is optimal here.' },
                { title: 'Cache Strategy', desc: 'Cache popular URLs in Redis. LRU eviction, TTL considerations.' },
                { title: 'Scalability', desc: 'Horizontal scaling, consistent hashing, partition strategy.' },
              ].map((item, i) => (
                <div key={i} className="mb-4">
                  <p className="font-medium text-white text-sm mb-1">{item.title}</p>
                  <textarea
                    className="input-base text-sm h-20 resize-none"
                    placeholder={item.desc}
                    value={notes[`deep_${i}`] ?? ''}
                    onChange={e => setNotes(n => ({ ...n, [`deep_${i}`]: e.target.value }))}
                  />
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Right: Component Palette + Reference */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-white mb-3">Component Palette</h3>
            <div className="grid grid-cols-2 gap-2">
              {components.map(comp => (
                <button
                  key={comp.label}
                  onClick={() => addComponent(comp)}
                  className="flex items-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 hover:text-white transition-all text-left"
                >
                  <span className="text-lg">{comp.icon}</span>
                  <span className="truncate">{comp.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-3">Reference Architecture</h3>
            <div className="text-xs text-slate-400 font-mono bg-slate-950 rounded-xl p-3 leading-6">
              <div>Client → CDN</div>
              <div className="ml-4">→ Load Balancer</div>
              <div className="ml-8">→ App Servers</div>
              <div className="ml-12">→ Redis Cache</div>
              <div className="ml-12">→ DynamoDB</div>
              <div className="ml-8">→ Redirect (301)</div>
            </div>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <p className="text-xs font-semibold text-yellow-400 mb-2">💡 INTERVIEWER TIP</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Always start with requirements clarification. Estimate scale before drawing. Design top-down: high-level → APIs → data model → deep dive.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">System Design Lab</h1>
        <p className="text-slate-400 text-sm mt-1">Practice real-world architecture problems with an interactive canvas</p>
      </div>

      <Input placeholder="Search design problems..." icon={<Search size={14} />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} hover onClick={() => setSelectedProblem(p)} className="group flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="text-2xl">🏗️</div>
              <div className="flex items-center gap-2">
                <DifficultyBadge difficulty={p.difficulty} />
                {p.completed && <CheckCircle2 size={14} className="text-green-400" />}
              </div>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1.5 group-hover:text-blue-400 transition-colors">{p.title}</h3>
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-800">
              <Badge variant="default" size="sm">{p.category}</Badge>
              <div className="flex gap-1 ml-auto">
                {p.companies.map(c => <Badge key={c} variant="blue" size="sm">{c}</Badge>)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SystemDesignLab;
