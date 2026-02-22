import React, { useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AppNavbar from './AppNavbar';
import { useStore } from '../../store/useStore';

interface PageLayoutProps {
  children?: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { sidebarCollapsed, toggleSidebar } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-10 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 transition-transform duration-300`}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppNavbar
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 lg:p-6 max-w-7xl mx-auto">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
