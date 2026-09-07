import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, BarChart3, Timer, User, LogOut, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/sprint', label: 'Tasks Board', icon: CheckSquare },
  { path: '/members', label: 'Members', icon: Users },
  { path: '/insights', label: 'Insights', icon: BarChart3 },
  { path: '/focus', label: 'Focus Mode', icon: Timer, badge: 'Hot' },
  { path: '/profile', label: 'Profile', icon: User },
];

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#111827] text-white z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-gray-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="p-6 flex items-center justify-between border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-brand">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  Taskora
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                </h1>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Work Together. Finish Faster.</p>
              </div>
            </div>
          </div>

          <nav className="px-4 py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-brand text-white shadow-brand font-bold scale-[1.02]'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-gray-900 uppercase">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 space-y-3">
          <div className="p-3.5 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt=""
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
              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-xl transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
