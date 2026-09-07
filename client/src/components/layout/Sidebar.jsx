import React from 'react';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, BarChart3, User, LogOut, Layers, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Task Board', icon: CheckSquare },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile & Settings', icon: User },
];

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#111827] text-white z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-gray-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo & Header */}
        <div>
          <div className="p-6 flex items-center justify-between border-b border-gray-800/80">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-brand">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  Taskora
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                </h1>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Plan. Collaborate. Deliver.</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-brand text-white shadow-brand font-semibold scale-[1.02]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pro Banner & User Card Footer */}
        <div className="p-4 space-y-4">
          {/* Productivity Widget Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/60 relative overflow-hidden">
            <div className="absolute -right-3 -bottom-3 opacity-10 text-brand-500">
              <Sparkles className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-brand-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Taskora Enterprise
            </div>
            <p className="text-xs text-gray-300 mb-3">Boosting team velocity by 40% with automated workflows.</p>
            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-brand h-full w-[84%] rounded-full"></div>
            </div>
            <p className="text-[10px] text-gray-400 text-right mt-1 font-medium">84% Sprint Velocity</p>
          </div>

          {/* User Account Info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/50 shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Alex Rivera'}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.role || 'Admin'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
