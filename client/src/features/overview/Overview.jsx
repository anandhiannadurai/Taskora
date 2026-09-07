import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CustomTooltip } from '../../shared/components/CustomTooltip';
import {
  FolderKanban,
  CheckCircle2,
  Zap,
  Calendar,
  Activity,
  ArrowUpRight,
  Sparkles,
  Plus,
  Clock,
  Target,
  Timer
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

export const Overview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const res = await api.insights.get();
        if (res.success) {
          setInsights(res);
        }
      } catch (err) {
        console.error('Failed to load overview insights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-500">Loading Taskora Overview...</p>
        </div>
      </div>
    );
  }

  const stats = insights?.stats || {
    activeProjects: 3,
    tasksCompletedToday: 5,
    teamEfficiency: 94,
    productivityScore: 95
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Hero Welcome Section */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gray-900 via-[#111827] to-gray-900 text-white shadow-2xl border border-gray-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Project Operational
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Alex'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Work Together. Finish Faster. You completed <strong className="text-brand-400 font-bold">{stats.tasksCompletedToday} tasks today</strong>. Team efficiency score is <strong className="text-emerald-400 font-bold">{stats.teamEfficiency}%</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/focus')}
              className="px-5 py-3 rounded-2xl bg-amber-500 text-gray-900 font-extrabold text-xs shadow-soft hover:bg-amber-400 transition-all flex items-center gap-2"
            >
              <Timer className="w-4 h-4" /> Start Focus Session
            </button>
            <button
              onClick={() => navigate('/sprint')}
              className="px-5 py-3 rounded-2xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition-all flex items-center gap-2"
            >
              Tasks Board <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Primary Requested Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Projects */}
        <div
          onClick={() => navigate('/projects')}
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2 cursor-pointer hover:border-brand-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active Projects</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.activeProjects ?? stats.activeWorkspaces ?? 3}</p>
          <span className="text-[11px] text-brand-500 font-semibold">Building & Testing</span>
        </div>

        {/* Card 2: Tasks Completed Today */}
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tasks Completed Today</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.tasksCompletedToday}</p>
          <span className="text-[11px] text-emerald-500 font-semibold">+2 vs yesterday</span>
        </div>

        {/* Card 3: Team Efficiency */}
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Team Efficiency</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.teamEfficiency}%</p>
          <span className="text-[11px] text-purple-500 font-semibold">High velocity</span>
        </div>

        {/* Card 4: Productivity Score Gauge */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Productivity Score</span>
            <Target className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-3xl font-black">{stats.productivityScore}%</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: `${stats.productivityScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* 3. Sections: Weekly Progress & Deadline Tracker */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Weekly Productivity Trends</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Daily completion rate (%) and focus minutes</p>
            </div>
            <button onClick={() => navigate('/insights')} className="text-xs font-bold text-brand-500 hover:underline">
              View Insights
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={insights?.productivityTrends || []}>
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="completionRate" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#brandGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Deadline Tracker</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming task due dates</p>
            </div>
            <button onClick={() => navigate('/sprint')} className="text-xs font-bold text-brand-500 hover:underline">
              Tasks Board
            </button>
          </div>

          <div className="space-y-3">
            {(insights?.upcomingDeadlines || []).map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-bg/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="truncate pr-2">
                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-white truncate">{item.title}</h4>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-brand-500" /> Due: {item.due_date}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Team Performance & Recent Activity Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Team Performance Scores</h3>
          <div className="space-y-3">
            {(insights?.teamPerformance || []).map((tp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">{tp.name}</span>
                  <span className="font-extrabold text-brand-500">{tp.score}% Efficiency</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-brand h-full rounded-full" style={{ width: `${tp.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Recent Project Activity</h3>
          <div className="space-y-3">
            {(insights?.recentActivity || []).map((act, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-dark-bg/60 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <img
                    src={act.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/40"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {act.user_name} <span className="font-normal text-gray-500">{act.action}</span>{' '}
                      <strong className="text-brand-500 font-semibold">{act.target}</strong>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">Recently</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
