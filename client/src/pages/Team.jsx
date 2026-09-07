import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AddMemberModal } from '../components/modals/AddMemberModal';
import { UserPlus, Mail, Shield, CheckCircle2, Zap, Award, Activity } from 'lucide-react';

export const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await api.team.getAll();
      if (res.success) {
        setTeam(res.team);
      }
    } catch (err) {
      console.error('Failed to load team data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleMemberAdded = (newMember) => {
    setTeam((prev) => [...prev, newMember]);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Team Directory & Roles
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-500 font-bold">
              {team.length} Members
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage workspace roles, sprint task allocations, and individual productivity
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-brand text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-brand hover:opacity-95 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {/* Team Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-semibold">Loading Team Members...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-xl transition-all duration-300 space-y-5"
            >
              {/* Header Info */}
              <div className="flex items-center gap-4">
                <img
                  src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={m.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/40 shadow-soft"
                />
                <div className="truncate">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white truncate">{m.name}</h3>
                  <p className="text-xs text-brand-500 font-bold truncate">{m.title || m.role}</p>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-gray-400" /> {m.email}
                  </span>
                </div>
              </div>

              {/* Role Badge & Bio */}
              <div className="space-y-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    m.role === 'Admin'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      : m.role === 'Project Manager'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                  }`}
                >
                  <Shield className="w-3 h-3" /> {m.role}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {m.bio || 'Productive team contributor focused on high quality engineering delivery.'}
                </p>
              </div>

              {/* Performance & Task Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-dark-bg/60 border border-gray-100 dark:border-gray-800 text-center">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Active</span>
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white">{m.active_tasks ?? 2}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Done</span>
                  <span className="text-sm font-extrabold text-emerald-500">{m.completed_tasks ?? 4}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Score</span>
                  <span className="text-sm font-extrabold text-brand-500">{m.productivity_score ?? 92}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onMemberAdded={handleMemberAdded}
      />
    </div>
  );
};
