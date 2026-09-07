import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CustomTooltip } from '../../shared/components/CustomTooltip';
import { BarChart3, PieChart as PieIcon, TrendingUp, CheckCircle, Clock, Target, Zap } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const Insights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.insights.get();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load insights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-500 font-semibold">Loading Insights Analytics...</div>;
  }

  const pieData = data?.taskCompletionRate || [
    { name: 'Completed', value: 4, color: '#10B981' },
    { name: 'In Progress', value: 3, color: '#FF6B00' },
    { name: 'Review', value: 2, color: '#8B5CF6' },
    { name: 'Backlog', value: 3, color: '#6B7280' }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Taskora Insights & Telemetry
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Project progress, productivity trends, task completion rates, and team performance
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-3 py-1.5 rounded-2xl">
          <Zap className="w-4 h-4" /> Live Analytics
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">On-Time Completion</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-500">98.2%</span>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-[11px] text-gray-400">On target for 2026</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Avg Sprint Velocity</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-brand-500">45 Pts</span>
            <TrendingUp className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-[11px] text-brand-500 font-semibold">+14% vs last week</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Focus Hours Logged</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-500">142 Hrs</span>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-[11px] text-purple-500 font-semibold">Focus Mode Sprints</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Team Health Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-500">Optimal</span>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-[11px] text-gray-400">Zero sprint blockers</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Chart 1: Project Progress */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Project Progress (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.projectProgress || data?.workspaceProgress || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="progress" fill="#FF6B00" radius={[12, 12, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Task Completion Rate Pie */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-brand-500" /> Task Completion Rate
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Productivity Trends */}
        <div className="lg:col-span-12 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Productivity Trends (Daily Focus Minutes & Completion %)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.productivityTrends || []}>
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
                <Area type="monotone" dataKey="focusMinutes" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#brandGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
