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
import { Avatar, Progress } from '../ui';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/daily', icon: Flame, label: 'Daily Challenge', badge: '🔥' },
  { to: '/paths', icon: BookOpen, label: 'Learning Paths' },
  { to: '/practice/mcq', icon: Brain, label: 'MCQ Practice' },
  { to: '/practice/coding', icon: Code2, label: 'Coding Practice' },
  { to: '/practice/design', icon: PenTool, label: 'System Design Lab' },
  { to: '/interview/ai', icon: Zap, label: 'AI Interview' },
  { to: '/interview/mock', icon: Video, label: 'Mock Interview' },
  { to: '/resume', icon: FileText, label: 'Resume Analyzer' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/community', icon: MessageSquare, label: 'Community' },
  { to: '/certifications', icon: Award, label: 'Certifications' },
  { to: '/jobs', icon: Target, label: 'Job Matching' },
  { to: '/profile', icon: User, label: 'Profile' },
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
      'h-screen sticky top-0 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 z-20',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className={clsx('flex items-center gap-3 px-4 py-4 border-b border-slate-800 flex-shrink-0', collapsed && 'justify-center px-0')}>
        <img src={logo} alt="Avantika" className="w-8 h-8 object-contain flex-shrink-0 rounded-md" />
        {!collapsed && (
          <div>
            <p className="font-bold text-white text-sm leading-tight">Avantika</p>
            <p className="text-xs text-slate-500">Interview Prep</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'sidebar-item group',
                isActive && 'active',
                !isActive && 'text-slate-400',
                collapsed && 'justify-center px-0 py-2.5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  className={clsx('flex-shrink-0', isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white')}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && <span className="text-xs">{item.badge}</span>}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      {user && (
        <div className={clsx('border-t border-slate-800 p-3 flex-shrink-0', collapsed && 'px-1')}>
          {!collapsed && (
            <div className="mb-3 px-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Level {user.level}</span>
                <span className="text-slate-500">{user.xp % 500}/500 XP</span>
              </div>
              <Progress value={xpProgress} color="blue" size="xs" />
            </div>
          )}

          <div className={clsx('flex items-center gap-2.5', collapsed && 'justify-center')}>
            <Avatar initials={user.avatar} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name.split(' ')[0]}</p>
                <p className="text-xs text-blue-400 capitalize">{user.tier} plan</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-400/10"
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 bg-slate-800 border border-slate-700 rounded-full p-0.5 text-slate-400 hover:text-white transition-colors z-30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
