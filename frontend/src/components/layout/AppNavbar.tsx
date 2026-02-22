import React, { useState } from 'react';
import { Bell, Search, Flame, Moon, Sun, Menu, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar, Badge } from '../ui';

interface AppNavbarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ onMobileMenuToggle, mobileMenuOpen }) => {
  const { user, theme, toggleTheme, activeNotifications } = useStore();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center px-4 gap-3 sticky top-0 z-10 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        {showSearch ? (
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
            <Search size={14} className="text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search problems, topics..."
              className="bg-transparent text-sm text-white placeholder-slate-500 outline-none flex-1"
              onBlur={() => setShowSearch(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search...</span>
            <span className="hidden sm:inline text-xs bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">⌘K</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Streak */}
        {user && (
          <div className="flex items-center gap-1 bg-orange-400/10 border border-orange-400/20 px-2.5 py-1 rounded-lg">
            <Flame size={14} className="text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">{user.streak}</span>
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Bell size={16} />
          {activeNotifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {activeNotifications}
            </span>
          )}
        </button>

        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2 pl-1">
            <Avatar initials={user.avatar} size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-white leading-tight">{user.name.split(' ')[0]}</p>
              <Badge variant="blue" size="sm">{user.tier}</Badge>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppNavbar;
