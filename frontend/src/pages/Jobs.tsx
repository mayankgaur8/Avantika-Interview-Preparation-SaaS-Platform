import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Star, ChevronRight, Filter, Search, Bookmark, ExternalLink, Building, Zap, TrendingUp } from 'lucide-react';
import { Card, Badge, Button, Avatar, Progress } from '../components/ui';
import { useStore } from '../store/useStore';

const jobListings = [
  {
    id: '1', title: 'Senior Software Engineer', company: 'Google', logo: 'G', location: 'Bangalore / Hybrid',
    salary: '₹50-80 LPA', type: 'Full-time', posted: '2d ago', match: 87, tags: ['Java', 'Distributed Systems', 'Kubernetes'],
    description: 'Join Google\'s core infrastructure team to build scalable systems serving billions of users.',
    requirements: ['5+ years experience', 'Strong DSA', 'System Design', 'Java/Go/C++'],
    deadline: 'Mar 15, 2026', hot: true,
  },
  {
    id: '2', title: 'Backend Engineer L4', company: 'Amazon', logo: 'A', location: 'Hyderabad / Remote',
    salary: '₹35-55 LPA', type: 'Full-time', posted: '1d ago', match: 79, tags: ['Python', 'AWS', 'Microservices'],
    description: 'Work on Amazon\'s e-commerce platform, handling millions of transactions daily.',
    requirements: ['3+ years', 'AWS certified', 'Distributed systems', 'Python/Java'],
    deadline: 'Mar 20, 2026', hot: true,
  },
  {
    id: '3', title: 'Full Stack Developer', company: 'Microsoft', logo: 'M', location: 'Noida / Onsite',
    salary: '₹25-40 LPA', type: 'Full-time', posted: '3d ago', match: 72, tags: ['React', 'Node.js', 'Azure'],
    description: 'Build next-generation developer tools used by millions of developers worldwide.',
    requirements: ['3+ years full stack', 'React + Node.js', 'Azure knowledge', 'TypeScript'],
    deadline: 'Mar 25, 2026', hot: false,
  },
  {
    id: '4', title: 'SDE-II Backend', company: 'Flipkart', logo: 'F', location: 'Bangalore / Hybrid',
    salary: '₹28-45 LPA', type: 'Full-time', posted: '5d ago', match: 91, tags: ['Java', 'Spring Boot', 'Kafka'],
    description: 'Scale Flipkart\'s payment and checkout infrastructure for India\'s largest e-commerce platform.',
    requirements: ['2+ years', 'Strong Java', 'Spring Boot', 'High scale systems'],
    deadline: 'Feb 28, 2026', hot: false,
  },
  {
    id: '5', title: 'Platform Engineer', company: 'Swiggy', logo: 'S', location: 'Bangalore / Remote',
    salary: '₹20-32 LPA', type: 'Full-time', posted: '1w ago', match: 68, tags: ['Go', 'Docker', 'PostgreSQL'],
    description: 'Build the platform that powers food delivery for millions of hungry Indians.',
    requirements: ['2+ years', 'Go/Python', 'Container orchestration', 'Databases'],
    deadline: 'Mar 10, 2026', hot: false,
  },
  {
    id: '6', title: 'ML Engineer', company: 'Meesho', logo: 'Me', location: 'Bangalore / Hybrid',
    salary: '₹22-38 LPA', type: 'Full-time', posted: '3d ago', match: 55, tags: ['Python', 'TensorFlow', 'SQL'],
    description: 'Build ML models to power Meesho\'s product recommendations and seller analytics.',
    requirements: ['2+ years ML', 'Python', 'PyTorch/TensorFlow', 'Data pipelines'],
    deadline: 'Mar 18, 2026', hot: false,
  },
];

const companyColors: Record<string, string> = {
  'G': 'from-blue-500 to-green-500',
  'A': 'from-orange-400 to-yellow-400',
  'M': 'from-blue-400 to-cyan-400',
  'F': 'from-yellow-400 to-orange-400',
  'S': 'from-orange-500 to-red-500',
  'Me': 'from-pink-500 to-rose-500',
};

const Jobs: React.FC = () => {
  const { user } = useStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<typeof jobListings[0] | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const filtered = jobListings.filter(j =>
    (typeFilter === 'All' || j.type === typeFilter) &&
    (search === '' || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSave = (id: string) => {
    setSavedJobs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getMatchColor = (match: number) => {
    if (match >= 85) return 'text-green-400';
    if (match >= 70) return 'text-blue-400';
    return 'text-yellow-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Matching</h1>
          <p className="text-slate-400 text-sm mt-1">AI-matched opportunities based on your profile</p>
        </div>
        <Badge variant="green" size="md">
          <Zap size={12} className="mr-1" />
          {jobListings.filter(j => j.match >= 80).length} strong matches
        </Badge>
      </div>

      {/* Profile Match Summary */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Your Job Match Profile</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeting <span className="text-blue-400 font-medium">Senior Backend Engineer</span> roles at top-tier companies
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Java', 'Spring Boot', 'System Design', 'AWS', 'Microservices'].map(s => (
                <span key={s} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-white">82%</div>
            <p className="text-xs text-slate-400">Avg match score</p>
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Update Preferences</Button>
        </div>

        {/* Gap areas */}
        <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="text-xs">
            <p className="text-slate-400 font-medium mb-1.5">Skills to improve for better matches:</p>
            <div className="space-y-1.5">
              {[{ skill: 'System Design', gap: 15 }, { skill: 'Cloud/AWS', gap: 28 }, { skill: 'Go/Rust', gap: 40 }].map(g => (
                <div key={g.skill} className="flex items-center gap-2">
                  <span className="text-slate-400 w-24">{g.skill}</span>
                  <div className="flex-1 h-1 bg-slate-700 rounded-full">
                    <div className="h-1 bg-yellow-400 rounded-full" style={{ width: `${100 - g.gap}%` }} />
                  </div>
                  <span className="text-yellow-400 text-xs">{g.gap}% gap</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs sm:col-span-2">
            <p className="text-slate-400 font-medium mb-1.5">💡 AI Recommendation:</p>
            <p className="text-slate-300">Complete the System Design Mastery path and earn AWS certification to unlock 12+ more high-match opportunities at Google, Amazon, and Meta.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search + Filter */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
              <Search size={14} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs, companies..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Full-time', 'Contract'].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${typeFilter === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filtered.map(job => (
            <Card key={job.id}
              className={`hover:border-slate-600 transition-all cursor-pointer ${selectedJob?.id === job.id ? 'border-blue-500/50' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${companyColors[job.logo] ?? 'from-slate-600 to-slate-700'} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">{job.title}</h3>
                        {job.hot && <Badge variant="red" size="sm">🔥 Hot</Badge>}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{job.company}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${getMatchColor(job.match)}`}>{job.match}% match</p>
                      <p className="text-xs text-slate-500">{job.posted}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={10} />{job.salary}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />Deadline: {job.deadline}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1 flex-wrap">
                      {job.tags.map(t => (
                        <span key={t} className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={e => { e.stopPropagation(); toggleSave(job.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${savedJobs.has(job.id) ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-500 hover:text-yellow-400'}`}>
                        <Bookmark size={13} />
                      </button>
                      {applied.has(job.id) ? (
                        <Badge variant="green" size="sm">Applied</Badge>
                      ) : (
                        <Button size="sm" onClick={e => { e.stopPropagation(); setSelectedJob(job); }}>
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right: Job Detail or Sidebar */}
        <div className="space-y-4">
          {selectedJob ? (
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${companyColors[selectedJob.logo] ?? 'from-slate-600 to-slate-700'} flex items-center justify-center text-white font-bold`}>
                    {selectedJob.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedJob.title}</h3>
                    <p className="text-xs text-slate-400">{selectedJob.company} · {selectedJob.location}</p>
                  </div>
                </div>
                <span className={`text-lg font-black ${getMatchColor(selectedJob.match)}`}>{selectedJob.match}%</span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">About</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Requirements</p>
                  <ul className="space-y-1">
                    {selectedJob.requirements.map(r => (
                      <li key={r} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800 rounded-lg p-2.5">
                    <p className="text-slate-500 mb-0.5">Salary</p>
                    <p className="text-white font-semibold">{selectedJob.salary}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2.5">
                    <p className="text-slate-500 mb-0.5">Deadline</p>
                    <p className="text-white font-semibold">{selectedJob.deadline}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {applied.has(selectedJob.id) ? (
                  <div className="flex-1 flex items-center justify-center gap-2 py-2 text-green-400 text-sm font-medium">
                    ✓ Application Submitted
                  </div>
                ) : (
                  <Button className="flex-1" onClick={() => setApplied(prev => new Set([...prev, selectedJob.id]))}>
                    Apply Now
                  </Button>
                )}
                <button onClick={() => toggleSave(selectedJob.id)}
                  className={`p-2.5 rounded-xl border transition-colors ${savedJobs.has(selectedJob.id) ? 'border-yellow-500/40 text-yellow-400 bg-yellow-400/10' : 'border-slate-700 text-slate-400 hover:text-yellow-400'}`}>
                  <Bookmark size={16} />
                </button>
              </div>
            </Card>
          ) : (
            <>
              {/* Quick Stats */}
              <Card>
                <h3 className="font-semibold text-white mb-3 text-sm">Application Tracker</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Saved Jobs', value: savedJobs.size, color: 'text-yellow-400' },
                    { label: 'Applied', value: applied.size, color: 'text-blue-400' },
                    { label: 'Interview Scheduled', value: 1, color: 'text-green-400' },
                    { label: 'Offer Received', value: 0, color: 'text-purple-400' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between py-1 text-sm">
                      <span className="text-slate-400">{s.label}</span>
                      <span className={`font-bold ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Interview Prep */}
              <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 border-purple-500/20">
                <h3 className="font-semibold text-white mb-2 text-sm">Prep for Google Interview</h3>
                <p className="text-xs text-slate-400 mb-3">You're 87% matched! Complete these to increase your chances:</p>
                <div className="space-y-2">
                  {[
                    { task: 'System Design: Design YouTube', done: false },
                    { task: 'Practice 5 hard DP problems', done: true },
                    { task: 'Mock behavioral interview', done: false },
                  ].map(t => (
                    <div key={t.task} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                        {t.done && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={t.done ? 'text-slate-500 line-through' : 'text-slate-300'}>{t.task}</span>
                    </div>
                  ))}
                </div>
                <Button size="sm" className="w-full mt-3" variant="outline">Start Prep Plan</Button>
              </Card>

              {/* Top Companies Hiring */}
              <Card>
                <h3 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-400" />
                  Top Hiring Now
                </h3>
                <div className="space-y-2">
                  {['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Swiggy'].map((c, i) => (
                    <div key={c} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded bg-gradient-to-br ${Object.values(companyColors)[i]} flex items-center justify-center text-white text-xs font-bold`}>
                          {c[0]}
                        </div>
                        <span className="text-slate-300">{c}</span>
                      </div>
                      <span className="text-xs text-slate-500">{[12, 8, 15, 6, 9][i]} openings</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
