import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, BookOpen, Code2, Brain, Video, PenTool, FileText, BarChart3,
  Users, Award, Flame, User, LogOut, ChevronLeft, ChevronRight, Zap, Target,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/daily',     icon: Flame,           label: 'Daily Challenge', badge: '🔥' },
      { to: '/paths',     icon: BookOpen,         label: 'Learning Paths'  },
      { to: '/analytics', icon: BarChart3,        label: 'Analytics'       },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/practice/mcq',    icon: Brain,    label: 'MCQ Practice'      },
      { to: '/practice/coding', icon: Code2,    label: 'Coding Practice'   },
      { to: '/practice/design', icon: PenTool,  label: 'System Design Lab' },
    ],
  },
  {
    label: 'Interviews',
    items: [
      { to: '/interview/ai',   icon: Zap,   label: 'AI Interview'   },
      { to: '/interview/mock', icon: Video, label: 'Mock Interview' },
      { to: '/resume',         icon: FileText, label: 'Resume Analyzer' },
    ],
  },
  {
    label: 'More',
    items: [
      { to: '/community',     icon: MessageSquare, label: 'Community'    },
      { to: '/certifications',icon: Award,         label: 'Certifications' },
      { to: '/jobs',          icon: Target,        label: 'Job Matching'  },
      { to: '/profile',       icon: User,          label: 'Profile'       },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const xpProgress = user ? (user.xp % 500) / 5 : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={clsx(
      'h-screen sticky top-0 flex flex-col bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60 transition-all duration-300 z-20',
      collapsed ? 'w-[60px]' : 'w-[220px]'
    )}>

      {/* ── Logo ── */}
      <div className={clsx(
        'flex items-center gap-3 h-14 border-b border-slate-800/60 flex-shrink-0 px-4',
        collapsed && 'justify-center px-0'
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
          <img src={logo} alt="Avantika" className="w-5 h-5 object-contain" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-black text-white text-sm leading-none">Avantika</p>
            <p className="text-[10px] text-violet-400 font-medium">Interview Prep</p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 group',
                    isActive
                      ? 'bg-violet-500/12 text-violet-300 border border-violet-500/20'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60',
                    collapsed && 'justify-center px-0 py-2.5'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={16}
                        className={clsx(
                          'flex-shrink-0 transition-colors',
                          isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {'badge' in item && item.badge && (
                            <span className="text-xs leading-none">{item.badge}</span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User section ── */}
      {user && (
        <div className={clsx(
          'border-t border-slate-800/60 p-3 flex-shrink-0',
          collapsed && 'px-1.5'
        )}>
          {!collapsed && (
            <div className="mb-3 px-1">
              <div className="flex items-center justify-between text-[10px] mb-1.5">
                <span className="text-slate-500 font-medium">Level {user.level}</span>
                <span className="text-slate-600">{user.xp % 500}/500 XP</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className={clsx('flex items-center gap-2', collapsed && 'justify-center')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.avatar}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate leading-none mb-1">
                    {user.name.split(' ')[0]}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-400 font-medium capitalize">
                    {user.tier}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/8 transition-all"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Collapse toggle ── */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[52px] w-6 h-6 bg-slate-800 border border-slate-700/60 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-30 shadow-md"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};

export default Sidebar;
