import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, XCircle, ChevronRight, Sparkles, Download, RefreshCw } from 'lucide-react';
import { Card, Badge, Button, Progress } from '../components/ui';

const sampleAnalysis = {
  atsScore: 78,
  scores: { ats: 78, keywords: 65, impact: 82, format: 90, overall: 79 },
  sections: {
    experience: { status: 'good', issues: [] },
    skills: { status: 'warning', issues: ['Missing: Kubernetes, Terraform, System Design'] },
    education: { status: 'good', issues: [] },
    projects: { status: 'error', issues: ['No quantified impact metrics', 'Missing tech stack details'] },
    summary: { status: 'warning', issues: ['Generic summary — tailor to target role'] },
  },
  missingKeywords: ['distributed systems', 'kafka', 'kubernetes', 'terraform', 'microservices', 'system design'],
  suggestions: [
    {
      priority: 'high', section: 'Experience',
      original: 'Worked on backend services for e-commerce platform',
      improved: 'Engineered 5 Spring Boot microservices processing 2M+ daily transactions, reducing API latency by 40% through Redis caching',
      reason: 'Add quantified impact: scale, performance improvement, and specific technologies',
    },
    {
      priority: 'high', section: 'Projects',
      original: 'Built a chat application using WebSockets',
      improved: 'Architected real-time chat system supporting 10K concurrent connections using WebSockets + Redis Pub/Sub, deployed on AWS EKS',
      reason: 'Specify scale, architecture decisions, and deployment details',
    },
    {
      priority: 'medium', section: 'Skills',
      original: 'Java, Python, SQL, Spring Boot, React',
      improved: 'Java 17+, Python 3.11, Spring Boot 3, PostgreSQL, Redis, Docker, Kubernetes, AWS (EC2/RDS/S3)',
      reason: 'Use specific versions and add cloud/DevOps skills expected for Senior role',
    },
    {
      priority: 'low', section: 'Summary',
      original: 'Software engineer with 3 years of experience',
      improved: 'Backend Software Engineer with 3 years building distributed systems at scale. Strong in Java/Spring Boot, PostgreSQL, and cloud-native architecture. Targeting senior roles requiring system design expertise.',
      reason: 'Make it specific to your target role and highlight key value proposition',
    },
  ],
};

const statusIcon = (status: string) => {
  if (status === 'good') return <CheckCircle2 size={14} className="text-green-400" />;
  if (status === 'warning') return <AlertCircle size={14} className="text-yellow-400" />;
  return <XCircle size={14} className="text-red-400" />;
};

const scoreColor = (score: number) => score >= 80 ? 'green' : score >= 60 ? 'blue' : 'yellow';

const ResumeAnalyzer: React.FC = () => {
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setStage('analyzing');
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setProgress(i);
    }
    setStage('result');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const copyText = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  if (stage === 'analyzing') return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto">
        <FileText size={32} className="text-blue-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Analyzing {fileName}</h2>
        <p className="text-slate-400 text-sm">AI is reading your resume...</p>
      </div>
      <Progress value={progress} color="blue" size="md" />
      <div className="space-y-2 text-sm text-slate-400">
        {[
          [20, '✅ Parsing document structure'],
          [40, '✅ Extracting sections'],
          [60, '✅ Analyzing ATS compatibility'],
          [80, '✅ Scoring impact statements'],
          [90, '✅ Generating improvements'],
        ].filter(([threshold]) => progress >= (threshold as number)).map(([, msg], i) => (
          <p key={i} className="animate-fade-in">{msg as string}</p>
        ))}
      </div>
    </div>
  );

  if (stage === 'result') return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resume Analysis</h1>
          <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-2">
            <FileText size={13} /> {fileName || 'Avantika_Resume_v3.pdf'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<RefreshCw size={13} />} onClick={() => setStage('upload')}>
            New Upload
          </Button>
          <Button size="sm" icon={<Download size={13} />}>Export Report</Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(sampleAnalysis.scores).map(([key, val]) => (
          <Card key={key} className="text-center py-4">
            <div className={`text-2xl font-black ${val >= 80 ? 'text-green-400' : val >= 60 ? 'text-blue-400' : 'text-yellow-400'}`}>{val}</div>
            <div className="text-xs text-slate-500 mt-1 capitalize">{key === 'ats' ? 'ATS' : key}</div>
            <Progress value={val} color={scoreColor(val) as any} size="xs" className="mt-2" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section Analysis */}
        <Card>
          <h2 className="font-semibold text-white mb-4">Section Analysis</h2>
          <div className="space-y-3">
            {Object.entries(sampleAnalysis.sections).map(([section, data]) => (
              <div key={section} className="flex items-start gap-3 p-3 bg-slate-800 rounded-xl">
                {statusIcon(data.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white capitalize">{section}</p>
                  {data.issues.map((issue, i) => (
                    <p key={i} className="text-xs text-slate-500 mt-0.5">{issue}</p>
                  ))}
                </div>
                <Badge variant={data.status === 'good' ? 'green' : data.status === 'warning' ? 'yellow' : 'red'} size="sm">
                  {data.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Missing Keywords */}
        <Card>
          <h2 className="font-semibold text-white mb-4">Missing Keywords</h2>
          <p className="text-sm text-slate-400 mb-3">Add these to improve ATS score for Senior Backend Engineer roles:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {sampleAnalysis.missingKeywords.map(kw => (
              <span key={kw} className="px-2.5 py-1 bg-red-400/10 border border-red-400/20 text-red-400 rounded-lg text-xs font-mono">{kw}</span>
            ))}
          </div>
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-2">📊 Keyword Density</p>
            {[
              { kw: 'microservices', have: true },
              { kw: 'distributed systems', have: false },
              { kw: 'kubernetes', have: false },
              { kw: 'spring boot', have: true },
              { kw: 'kafka', have: false },
            ].map(item => (
              <div key={item.kw} className="flex items-center justify-between py-1">
                <span className="text-xs font-mono text-slate-400">{item.kw}</span>
                {item.have ? <CheckCircle2 size={12} className="text-green-400" /> : <XCircle size={12} className="text-red-400" />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Improvement Suggestions */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-purple-400" />
          <h2 className="font-semibold text-white">AI Bullet Improvements</h2>
          <Badge variant="purple" size="sm">{sampleAnalysis.suggestions.length} suggestions</Badge>
        </div>
        <div className="space-y-3">
          {sampleAnalysis.suggestions.map((s, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-all cursor-pointer ${
                activeSuggestion === i ? 'border-blue-500/50' : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setActiveSuggestion(activeSuggestion === i ? null : i)}
            >
              <div className="flex items-center justify-between p-3.5 bg-slate-800">
                <div className="flex items-center gap-2.5">
                  <Badge variant={s.priority === 'high' ? 'red' : s.priority === 'medium' ? 'yellow' : 'default'} size="sm">
                    {s.priority}
                  </Badge>
                  <span className="text-sm text-white">{s.section}</span>
                </div>
                <ChevronRight size={14} className={`text-slate-400 transition-transform ${activeSuggestion === i ? 'rotate-90' : ''}`} />
              </div>

              {activeSuggestion === i && (
                <div className="p-4 space-y-3 animate-fade-in">
                  <div>
                    <p className="text-xs text-red-400 font-semibold mb-1">❌ ORIGINAL</p>
                    <p className="text-sm text-slate-400 bg-red-500/5 border border-red-500/10 rounded-lg p-2.5 line-through">{s.original}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-400 font-semibold mb-1">✅ AI IMPROVED</p>
                    <p className="text-sm text-slate-200 bg-green-500/5 border border-green-500/10 rounded-lg p-2.5">{s.improved}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">💡 {s.reason}</p>
                    <Button
                      size="xs"
                      variant={copied === i ? 'success' : 'secondary'}
                      onClick={() => copyText(s.improved, i)}
                    >
                      {copied === i ? '✓ Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Resume Analyzer</h1>
        <p className="text-slate-400 text-sm mt-1">Get AI-powered ATS score, keyword analysis, and bullet improvements</p>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          dragOver ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <Upload size={40} className={`mx-auto mb-4 ${dragOver ? 'text-blue-400' : 'text-slate-500'}`} />
        <p className="text-white font-medium mb-1">Drop your resume here or click to upload</p>
        <p className="text-slate-500 text-sm">Supports PDF and DOCX · Max 5MB</p>
        <Button className="mt-5" icon={<Upload size={14} />}>Choose File</Button>
      </div>

      {/* OR demo */}
      <div className="flex items-center gap-3">
        <hr className="flex-1 border-slate-700" />
        <span className="text-xs text-slate-500">or</span>
        <hr className="flex-1 border-slate-700" />
      </div>
      <Card hover onClick={() => handleFile(new File([''], 'Avantika_Resume_v3.pdf', { type: 'application/pdf' }))}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl"><FileText size={20} className="text-blue-400" /></div>
          <div>
            <p className="text-sm font-medium text-white">Try with Sample Resume</p>
            <p className="text-xs text-slate-500">Analyze Avantika_Resume_v3.pdf</p>
          </div>
          <ChevronRight size={16} className="text-slate-400 ml-auto" />
        </div>
      </Card>

      {/* Feature list */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '🎯', title: 'ATS Score', desc: 'Beat applicant tracking systems' },
          { icon: '🔑', title: 'Keyword Match', desc: 'Role-specific keyword analysis' },
          { icon: '✨', title: 'AI Rewriting', desc: 'Improve bullet points with AI' },
          { icon: '📊', title: 'Impact Score', desc: 'Quantify your achievements' },
        ].map(f => (
          <Card key={f.title} padding="sm">
            <p className="text-lg mb-1">{f.icon}</p>
            <p className="text-sm font-medium text-white">{f.title}</p>
            <p className="text-xs text-slate-500">{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
