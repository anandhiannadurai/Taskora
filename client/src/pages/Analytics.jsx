import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart3, PieChart as PieIcon, TrendingUp, CheckCircle, Clock, Zap, Target } from 'lucide-react';
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

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.analytics.getDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-500 font-semibold">Loading Analytics Engine...</div>;
  }

  const pieData = data?.taskStatusDistribution || [
    { name: 'Completed', value: 3, color: '#10B981' },
    { name: 'In Progress', value: 3, color: '#FF6B00' },
    { name: 'In Review', value: 2, color: '#8B5CF6' },
    { name: 'To Do', value: 3, color: '#6B7280' }
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
              Taskora Analytics & Velocity
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time sprint progress, task distributions, and productivity telemetry
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-3 py-1.5 rounded-2xl">
          <Zap className="w-4 h-4" /> Real-time Telemetry
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">On-Time Delivery Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-500">98.2%</span>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-[11px] text-gray-400">Target hit rate for 2026</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Avg Completion Time</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-brand-500">1.8 Days</span>
            <Clock className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-[11px] text-emerald-500 font-semibold">-12% vs last sprint</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sprint Velocity</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-500">42 pts</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-[11px] text-blue-500 font-semibold">+15% efficiency boost</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Overall Task Health</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-500">Optimal</span>
            <CheckCircle className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-[11px] text-gray-400">Zero critical blockers</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Pie Chart: Task Status Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-brand-500" /> Task Status Distribution
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Project Completion Rate */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Project Progress Summary (%)</h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.projectProgressData || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="progress" fill="#FF6B00" radius={[12, 12, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
