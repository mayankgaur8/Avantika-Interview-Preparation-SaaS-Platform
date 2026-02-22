import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Eye, Search, Plus, ChevronRight, Flame, Tag, Send } from 'lucide-react';
import { Card, Badge, Button, Avatar, Modal } from '../components/ui';
import { forumPosts } from '../data/mockData';
import { useStore } from '../store/useStore';

const CATEGORIES = ['All', 'interview-experience', 'dsa', 'system-design', 'career', 'resources'];
const CATEGORY_LABELS: Record<string, string> = {
  'All': 'All',
  'interview-experience': 'Experiences',
  'dsa': 'DSA',
  'system-design': 'System Design',
  'career': 'Career',
  'resources': 'Resources',
};
const TAGS = ['Arrays', 'Trees', 'DP', 'Graphs', 'FAANG', 'Hiring', 'Resume', 'Leetcode'];

const sampleComments = [
  { id: 1, author: 'Vikram Singh', avatar: 'VS', time: '2h ago', text: 'Great explanation! I had the same issue. The key insight is sorting by start time first.' },
  { id: 2, author: 'Priya K.', avatar: 'PK', time: '1h ago', text: 'Thanks for sharing! I would also suggest looking at similar problems for more practice.' },
  { id: 3, author: 'Aditya M.', avatar: 'AM', time: '45m ago', text: 'Could you explain the time complexity analysis in more detail?' },
];

const Community: React.FC = () => {
  const { user } = useStore();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof forumPosts[0] | null>(null);
  const [newPost, setNewPost] = useState({ title: '', body: '', category: 'dsa' });
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState('');

  const filtered = forumPosts.filter(p =>
    (category === 'All' || p.category === category) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.author.name.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Community</h1>
          <p className="text-slate-400 text-sm mt-1">Learn together, grow together</p>
        </div>
        <Button onClick={() => setShowCreate(true)} icon={<Plus size={14} />}>New Post</Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Members', value: '12,847', color: 'text-blue-400' },
          { label: 'Posts Today', value: '234', color: 'text-green-400' },
          { label: 'Online Now', value: '1,204', color: 'text-purple-400' },
          { label: 'Resolved', value: '8,901', color: 'text-yellow-400' },
        ].map(s => (
          <Card key={s.label} className="text-center py-3">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${category === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Posts */}
          {filtered.map(post => (
            <Card key={post.id} className="hover:border-slate-600 transition-all cursor-pointer" onClick={() => setSelectedPost(post)}>
              <div className="flex gap-3">
                <Avatar initials={post.author.avatar} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white text-sm leading-snug hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <Badge variant={post.category === 'dsa' ? 'blue' : post.category === 'career' ? 'green' : 'purple'} size="sm" className="flex-shrink-0">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-400">{post.author.name}</span>
                    <span className="text-xs text-blue-400">{post.author.role}</span>
                    <button
                      onClick={e => { e.stopPropagation(); toggleLike(post.id); }}
                      className={`flex items-center gap-1 transition-colors ${likedPosts.has(post.id) ? 'text-blue-400' : 'hover:text-blue-400'}`}
                    >
                      <ThumbsUp size={11} />
                      {post.upvotes + (likedPosts.has(post.id) ? 1 : 0)}
                    </button>
                    <span className="flex items-center gap-1"><MessageSquare size={11} />{post.comments}</span>
                    <span className="flex items-center gap-1"><Eye size={11} />{post.views.toLocaleString()}</span>
                  </div>

                  {post.tags && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {post.tags.map((t: string) => (
                        <span key={t} className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Flame size={16} className="text-orange-400" />
              Top Contributors
            </h3>
            <div className="space-y-2.5">
              {[
                { name: 'Arjun Singh', avatar: 'AS', posts: 456, badge: '🥇' },
                { name: 'Rahul Mehta', avatar: 'RM', posts: 342, badge: '🥈' },
                { name: 'Priya Nair', avatar: 'PN', posts: 218, badge: '🥉' },
                { name: 'Sneha Patel', avatar: 'SP', posts: 134, badge: '4' },
                { name: 'Vikram Singh', avatar: 'VS', posts: 98, badge: '5' },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-2.5">
                  <span className="text-sm w-5 text-center">{c.badge}</span>
                  <Avatar initials={c.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.posts} upvotes</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Tag size={14} className="text-blue-400" />
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button key={tag} onClick={() => setSearch(tag)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded-lg transition-colors">
                  #{tag}
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-blue-900/20 border-blue-500/20">
            <h3 className="font-semibold text-white mb-2 text-sm">Community Rules</h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {['Be respectful and helpful', 'No spam or self-promotion', 'Share working code', 'Credit original authors', 'Keep it technical'].map((rule, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-400 mt-0.5">✓</span>{rule}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Post" size="lg">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title</label>
            <input
              value={newPost.title}
              onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
              placeholder="What's your question or topic?"
              className="input-base w-full"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Category</label>
            <select
              value={newPost.category}
              onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
              className="input-base w-full"
            >
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Content</label>
            <textarea
              value={newPost.body}
              onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))}
              rows={6}
              placeholder="Describe your question or share your knowledge..."
              className="input-base w-full resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => setShowCreate(false)} disabled={!newPost.title.trim()}>
              Publish Post
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post Detail Modal */}
      {selectedPost && (
        <Modal open={!!selectedPost} onClose={() => setSelectedPost(null)} title="" size="lg">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar initials={selectedPost.author.avatar} size="md" />
              <div className="flex-1">
                <h2 className="font-bold text-white text-lg leading-snug">{selectedPost.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-400">{selectedPost.author.name}</span>
                  <span className="text-blue-400">{selectedPost.author.role}</span>
                  <span>{selectedPost.createdAt}</span>
                  <Badge variant="blue" size="sm">{CATEGORY_LABELS[selectedPost.category] ?? selectedPost.category}</Badge>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-800/50 rounded-xl p-4 max-h-64 overflow-y-auto">
              {selectedPost.content}
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-slate-700">
              <button onClick={() => toggleLike(selectedPost.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${likedPosts.has(selectedPost.id) ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}>
                <ThumbsUp size={14} />
                {selectedPost.upvotes + (likedPosts.has(selectedPost.id) ? 1 : 0)} Upvotes
              </button>
              <span className="flex items-center gap-1.5 text-sm text-slate-400">
                <MessageSquare size={14} />{selectedPost.comments} Comments
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-white text-sm">Comments</h3>
              {sampleComments.map(c => (
                <div key={c.id} className="flex gap-2.5">
                  <Avatar initials={c.avatar} size="sm" />
                  <div className="flex-1 bg-slate-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{c.author}</span>
                      <span className="text-xs text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Avatar initials={user?.avatar ?? 'U'} size="sm" />
              <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
                <input
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                />
                <button onClick={() => setComment('')} className="p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Community;
