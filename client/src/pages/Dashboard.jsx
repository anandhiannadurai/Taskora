import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  Sparkles,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const Dashboard = ({ onNavigate, onQuickCreateTask }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.analytics.getDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-500">Loading Taskora Dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalProjects: 5,
    totalTasks: 11,
    completedTasks: 3,
    pendingTasks: 8,
    totalTeamMembers: 5,
    productivityScore: 94
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gray-900 via-[#111827] to-gray-900 text-white shadow-2xl border border-gray-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Taskora Workspace Active
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Good day, {user?.name || 'Alex'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Your team completed <strong className="text-brand-400 font-bold">{stats.completedTasks} tasks</strong> this week. Team productivity index is sitting high at <strong className="text-emerald-400 font-bold">{stats.productivityScore}%</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('tasks')}
              className="px-5 py-3 rounded-2xl bg-white text-gray-900 font-bold text-xs shadow-soft hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              View Task Board <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onQuickCreateTask}
              className="px-5 py-3 rounded-2xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Quick Task
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Projects</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalProjects}</p>
          <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2 this month
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Tasks</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalTasks}</p>
          <span className="text-[11px] text-gray-400 font-medium">11 Active tasks</span>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.completedTasks}</p>
          <span className="text-[11px] text-emerald-500 font-semibold">{stats.completionRate}% Done</span>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pending Tasks</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.pendingTasks}</p>
          <span className="text-[11px] text-amber-500 font-semibold">In sprint queue</span>
        </div>

        {/* Metric 5 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Team Members</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalTeamMembers}</p>
          <span className="text-[11px] text-gray-400 font-medium">All active</span>
        </div>

        {/* Metric 6: Productivity Score Gauge */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Productivity Score</span>
            <Zap className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-3xl font-black">{stats.productivityScore}%</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: `${stats.productivityScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* 3. Charts Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Weekly Performance Velocity Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Weekly Performance Velocity</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tasks completed vs new sprint backlog</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-brand-500">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span> Completed
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></span> Created
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.weeklyPerformance || []}>
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#brandGradient)" />
                <Area type="monotone" dataKey="created" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Progress Completion Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Active Projects Completion</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Progress rate per project (%)</p>
            </div>
            <button onClick={() => onNavigate('projects')} className="text-xs font-bold text-brand-500 hover:underline">
              View All
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.projectProgressData || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" fontSize={11} />
                <YAxis dataKey="name" type="category" width={100} stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="progress" fill="#FF6B00" radius={[0, 12, 12, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Feed Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Recent Team Activities</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Audit trail of workspace actions</p>
          </div>
          <span className="text-xs font-bold text-gray-400">Real-time Stream</span>
        </div>

        <div className="space-y-4">
          {(data?.recentActivities || []).map((act, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-dark-bg/60 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src={act.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/40"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {act.user_name} <span className="font-normal text-gray-500 dark:text-gray-400">{act.action}</span>{' '}
                    <strong className="text-brand-500 font-semibold">{act.target}</strong>
                  </p>
                  <span className="text-[10px] text-gray-400">Workspace Activity Log</span>
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">Just now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
