import React, { useState } from 'react';
import { Menu, Search, Bell, Sun, Moon, Plus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const TopNav = ({ activeTab, setMobileOpen, onQuickCreateTask, searchQuery, setSearchQuery }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Task Completed', desc: 'Sarah Chen completed "Recharts Premium Theme"', time: '10m ago', icon: CheckCircle2, color: 'text-emerald-500' },
    { id: 2, title: 'Sprint Milestone', desc: 'Taskora 2.0 reached 75% progress', time: '1h ago', icon: AlertCircle, color: 'text-brand-500' },
    { id: 3, title: 'New Comment', desc: 'Marcus Vance mentioned you on "OAuth 2.0"', time: '3h ago', icon: Clock, color: 'text-blue-500' },
  ];

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'projects': return 'Projects Directory';
      case 'tasks': return 'Task Management Board';
      case 'team': return 'Team Directory & Roles';
      case 'analytics': return 'Performance & Analytics';
      case 'profile': return 'User Settings & Security';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-8 py-4 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl lg:hidden transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{getTitle()}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Welcome back, {user?.name || 'Alex'} • Workspace Active</p>
          </div>
        </div>

        {/* Center: Live Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, tasks, team members..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-dark-bg/80 border border-transparent dark:border-gray-700/60 rounded-2xl focus:bg-white dark:focus:bg-dark-card focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Side Controls: Quick Create, Dark Mode, Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Task Button */}
          <button
            onClick={onQuickCreateTask}
            className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold shadow-brand hover:opacity-95 transition-all transform hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Real-Time Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                  <span className="text-[10px] bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full font-bold">
                    3 New
                  </span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                        <div className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0 ${n.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.desc}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
