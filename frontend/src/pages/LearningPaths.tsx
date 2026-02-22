import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, ChevronRight, Lock, CheckCircle2, Play, Search } from 'lucide-react';
import { Card, Badge, Progress, Button, Input, DifficultyBadge } from '../components/ui';
import { learningPaths, pathModules } from '../data/mockData';
import { useStore } from '../store/useStore';

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-700',
  purple: 'from-purple-500 to-purple-700',
  green: 'from-green-500 to-green-700',
  pink: 'from-pink-500 to-pink-700',
  cyan: 'from-cyan-500 to-cyan-700',
  orange: 'from-orange-500 to-orange-700',
  yellow: 'from-yellow-500 to-yellow-700',
  teal: 'from-teal-500 to-teal-700',
};

const filters = [
  { id: 'all', label: 'All Paths' },
  { id: 'enrolled', label: 'Enrolled' },
  { id: 'role', label: 'By Role' },
  { id: 'topic', label: 'By Topic' },
  { id: 'free', label: 'Free' },
];

const LearningPaths: React.FC = () => {
  const { enrollPath, enrolledPaths } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const filtered = learningPaths.filter(p => {
    if (filter === 'enrolled') return enrolledPaths.includes(p.id);
    if (filter === 'role') return p.category === 'role';
    if (filter === 'topic') return p.category === 'topic';
    if (filter === 'free') return !p.isPremium;
    return true;
  }).filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (selectedPath) {
    const path = learningPaths.find(p => p.id === selectedPath);
    if (!path) return null;
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedPath(null)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800">
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{path.title}</h1>
            <p className="text-sm text-slate-400">{path.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module list */}
          <div className="lg:col-span-2 space-y-2">
            <h2 className="font-semibold text-white mb-3">Course Content — {pathModules.length} modules</h2>
            {pathModules.map((mod, idx) => (
              <div
                key={mod.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                  ${mod.locked ? 'border-slate-800 opacity-50 cursor-not-allowed' : 'border-slate-800 hover:border-slate-600 cursor-pointer bg-slate-900 hover:bg-slate-800'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0
                  ${mod.completed ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                  {mod.completed ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${mod.locked ? 'text-slate-600' : 'text-white'}`}>{mod.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={11} /> {mod.duration} min</span>
                    <Badge variant="default" size="sm">{mod.type}</Badge>
                  </div>
                </div>
                {mod.locked ? <Lock size={14} className="text-slate-600" /> : mod.completed ? <CheckCircle2 size={16} className="text-green-400" /> : <Play size={14} className="text-blue-400" />}
              </div>
            ))}
          </div>

          {/* Path info sidebar */}
          <div className="space-y-4">
            <Card className={`bg-gradient-to-br ${colorMap[path.color]} p-6 border-0`}>
              <div className="text-4xl mb-3">{path.icon}</div>
              <h3 className="text-xl font-bold text-white">{path.title}</h3>
              <p className="text-white/80 text-sm mt-2">{path.description}</p>
              {enrolledPaths.includes(path.id) ? (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Progress</span><span>{path.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full">
                    <div className="h-2 bg-white rounded-full transition-all" style={{ width: `${path.progress}%` }} />
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full mt-4 bg-white text-slate-900 hover:bg-white/90"
                  onClick={() => enrollPath(path.id)}
                >
                  {path.isPremium ? '🔒 Enroll (Pro)' : 'Enroll Free'}
                </Button>
              )}
            </Card>

            <Card>
              <h3 className="font-medium text-white mb-3">Path Details</h3>
              <div className="space-y-2.5">
                {[
                  { icon: Clock, label: 'Duration', value: `${path.estimatedHours} hours` },
                  { icon: BookOpen, label: 'Modules', value: `${path.modulesCount} modules` },
                  { icon: Users, label: 'Enrolled', value: `${(path.enrolledCount / 1000).toFixed(1)}K learners` },
                  { icon: Star, label: 'Rating', value: `${path.rating}/5` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5"><item.icon size={12} />{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-medium text-white mb-3">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {path.topics.map(t => <Badge key={t} variant="blue">{t}</Badge>)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Learning Paths</h1>
          <p className="text-slate-400 text-sm mt-1">Structured paths to master your target role</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto w-full sm:w-64">
          <Input
            placeholder="Search paths..."
            icon={<Search size={14} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Path Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((path) => {
          const isEnrolled = enrolledPaths.includes(path.id);
          return (
            <Card
              key={path.id}
              hover
              onClick={() => setSelectedPath(path.id)}
              className="group flex flex-col"
            >
              {/* Header */}
              <div className={`h-2 w-full rounded-t-xl -mt-5 -mx-5 mb-4 bg-gradient-to-r ${colorMap[path.color]}`} style={{ marginTop: '-20px', marginLeft: '-20px', width: 'calc(100% + 40px)', borderRadius: '12px 12px 0 0' }} />

              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{path.icon}</div>
                <div className="flex items-center gap-2">
                  {path.isPremium && <Badge variant="yellow" size="sm">Pro</Badge>}
                  {isEnrolled && <Badge variant="green" size="sm">Enrolled</Badge>}
                </div>
              </div>

              <h3 className="font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors">{path.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{path.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {path.topics.slice(0, 3).map(t => <Badge key={t} variant="default" size="sm">{t}</Badge>)}
                {path.topics.length > 3 && <Badge variant="default" size="sm">+{path.topics.length - 3}</Badge>}
              </div>

              {isEnrolled && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Progress</span><span>{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} color="blue" size="xs" />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
                <span className="flex items-center gap-1"><Clock size={11} /> {path.estimatedHours}h</span>
                <span className="flex items-center gap-1"><Users size={11} /> {(path.enrolledCount / 1000).toFixed(1)}K</span>
                <span className="flex items-center gap-1"><Star size={11} /> {path.rating}</span>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-400">No paths match your filters</p>
          <Button variant="ghost" size="sm" className="mt-3 text-blue-400" onClick={() => { setFilter('all'); setSearch(''); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default LearningPaths;
