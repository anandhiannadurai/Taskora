import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../shared/components/Badge';
import { EmptyState } from '../../shared/components/EmptyState';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Search, LayoutGrid, List, Calendar, Edit3, Trash2, FolderKanban } from 'lucide-react';

export const Workspace = () => {
  const { searchQuery: globalSearch } = useOutletContext() || {};
  const { addToast } = useNotification();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState(globalSearch || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    if (globalSearch !== undefined) setSearch(globalSearch);
  }, [globalSearch]);

  const fetchProjects = async () => {
    try {
      const res = await api.projects.getAll({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        priority: priorityFilter !== 'All' ? priorityFilter : undefined,
        search: search || undefined
      });
      if (res.success) {
        setProjects(res.projects || res.workspaces || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, priorityFilter, search]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete project "${name}"?`)) {
      try {
        const res = await api.projects.delete(id);
        if (res.success) {
          addToast('Project deleted', 'success');
          setProjects((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err) {
        addToast('Failed to delete project', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Active Projects</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track Idea → Building → Testing → Delivered project pipelines</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingProject(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-gradient-brand text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-brand hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Filter and View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project name..."
              className="pl-10 pr-4 py-2 text-xs bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 font-medium"
          >
            <option value="All">All Pipeline Stages</option>
            <option value="Idea">Idea</option>
            <option value="Building">Building</option>
            <option value="Testing">Testing</option>
            <option value="Delivered">Delivered</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid' ? 'bg-white dark:bg-dark-card text-brand-500 shadow-sm' : 'text-gray-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'table' ? 'bg-white dark:bg-dark-card text-brand-500 shadow-sm' : 'text-gray-400'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-semibold">Loading Projects...</div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No Projects Found"
          description="Create your first project or adjust your status search filter to see results."
          actionText="Create Project"
          onAction={() => setShowModal(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <StatusBadge status={p.status} />
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingProject(p);
                        setShowModal(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">{p.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800/80">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-500">Project Progress</span>
                    <span className="text-brand-500 font-bold">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-brand h-full rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <PriorityBadge priority={p.priority} />
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> End: {p.end_date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-dark-bg/40">
                  <th className="p-4 pl-6">Project Name</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Pipeline Status</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-4 pl-6 font-bold text-gray-900 dark:text-white max-w-xs truncate">{p.name}</td>
                    <td className="p-4"><PriorityBadge priority={p.priority} /></td>
                    <td className="p-4"><StatusBadge status={p.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-brand h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                        </div>
                        <span className="font-bold">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 font-medium">{p.start_date}</td>
                    <td className="p-4 text-gray-500 font-medium">{p.end_date}</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProject(p);
                          setShowModal(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateWorkspaceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProject(null);
        }}
        onWorkspaceSaved={fetchProjects}
        initialData={editingProject}
      />
    </div>
  );
};
