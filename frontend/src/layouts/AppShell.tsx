import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Building2,
  Warehouse,
  Boxes,
  ClipboardPen,
  Egg,
  Wheat,
  HeartPulse,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    {
      name: t('nav.dashboard'),
      path: '/',
      icon: LayoutDashboard,
    },
    {
      name: t('nav.farmManagement'),
      path: '/farms',
      icon: Building2,
    },
    {
      name: t('nav.houses'),
      path: '/houses',
      icon: Warehouse,
    },
    {
      name: t('nav.flocks'),
      path: '/flocks',
      icon: Boxes,
    },
    {
      name: t('nav.dailyRecording'),
      path: '/daily-recording',
      icon: ClipboardPen,
    },
    {
      name: t('nav.eggProduction'),
      path: '/egg-production',
      icon: Egg,
    },
    {
      name: t('nav.feedManagement'),
      path: '/feed',
      icon: Wheat,
    },
    {
      name: t('nav.healthManagement'),
      path: '/health',
      icon: HeartPulse,
    },
    {
      name: t('nav.reports'),
      path: '/reports',
      icon: BarChart3,
    },
    {
      name: t('nav.settings'),
      path: '/settings',
      icon: Settings,
    },
  ];

  const currentNav = navItems.find((item) =>
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              LF
            </div>
            <div>
              <span className="font-bold text-base tracking-wide text-white block leading-tight">
                {t('app.shortName')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                {t('app.version')}
              </span>
            </div>
          </Link>
          <button
            type="button"
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white/70" />}
              </Link>
            );
          })}
        </div>

        {/* User profile & logout footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.email || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.role || 'Administrator'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-slate-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('auth.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main layout container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 truncate">
              {currentNav?.name || t('nav.dashboard')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
