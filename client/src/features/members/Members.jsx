import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AddMemberModal } from './AddMemberModal';
import { useNotification } from '../../context/NotificationContext';
import { UserPlus, Mail, Shield, Trash2, Timer } from 'lucide-react';

export const Members = () => {
  const { addToast } = useNotification();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await api.members.getAll();
      if (res.success) {
        setMembers(res.members);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRemoveMember = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove member "${name}"?`)) {
      try {
        const res = await api.members.delete(id);
        if (res.success) {
          addToast('Member removed successfully', 'success');
          setMembers((prev) => prev.filter((m) => m.id !== id));
        }
      } catch (err) {
        addToast('Failed to remove member', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Team Members Directory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-500 font-bold">
              {members.length} Active Members
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Role-Based Access Control: Admin, Project Lead, Developer, and Designer
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-brand text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-brand hover:opacity-95 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-semibold">Loading Members...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between group"
            >
              {/* Avatar, Name, Email */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={m.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/40 shadow-soft"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-white truncate">{m.name}</h3>
                      <p className="text-xs text-brand-500 font-bold truncate">{m.title || m.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMember(m.id, m.name)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-500" /> {m.email}
                  </span>
                </div>
              </div>

              {/* Role Badge & Activity Status Indicator */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      m.role === 'Admin'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : m.role === 'Project Lead'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                    }`}
                  >
                    <Shield className="w-3 h-3" /> {m.role}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        m.activity_status === 'In Focus'
                          ? 'bg-amber-400 animate-pulse'
                          : m.activity_status === 'Active'
                          ? 'bg-emerald-500'
                          : 'bg-gray-400'
                      }`}
                    ></span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {m.activity_status === 'In Focus' ? 'In Focus Mode' : m.activity_status || 'Active'}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-dark-bg/60 border border-gray-100 dark:border-gray-800 text-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Active</span>
                    <span className="text-xs font-extrabold text-gray-900 dark:text-white">{m.active_tasks ?? 2}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Done</span>
                    <span className="text-xs font-extrabold text-emerald-500">{m.completed_tasks ?? 5}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Efficiency</span>
                    <span className="text-xs font-extrabold text-brand-500">{m.efficiency_score ?? 94}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onMemberAdded={fetchMembers}
      />
    </div>
  );
};
