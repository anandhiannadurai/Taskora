import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../services/api';
import { PriorityBadge } from '../../shared/components/Badge';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Search, Calendar, CheckSquare } from 'lucide-react';

const SPRINT_COLUMNS = [
  { id: 'Backlog', label: 'Backlog', badgeColor: 'bg-slate-500' },
  { id: 'In Progress', label: 'In Progress', badgeColor: 'bg-brand-500' },
  { id: 'Review', label: 'In Review', badgeColor: 'bg-purple-500' },
  { id: 'Completed', label: 'Completed', badgeColor: 'bg-emerald-500' }
];

export const SprintBoard = () => {
  const { searchQuery: globalSearch } = useOutletContext() || {};
  const { addToast } = useNotification();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(globalSearch || '');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    if (globalSearch !== undefined) setSearch(globalSearch);
  }, [globalSearch]);

  const fetchData = async () => {
    try {
      const [tasksRes, projRes, membersRes] = await Promise.all([
        api.tasks.getAll({
          search: search || undefined,
          priority: priorityFilter !== 'All' ? priorityFilter : undefined
        }),
        api.projects.getAll(),
        api.members.getAll()
      ]);

      if (tasksRes.success) setTasks(tasksRes.tasks);
      if (projRes.success) setProjects(projRes.projects || projRes.workspaces);
      if (membersRes.success) setTeamMembers(membersRes.members);
    } catch (err) {
      console.error('Failed to fetch sprint data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, priorityFilter]);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const taskToUpdate = tasks.find((t) => String(t.id) === String(taskId));
    if (!taskToUpdate || taskToUpdate.status === targetStatus) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (String(t.id) === String(taskId) ? { ...t, status: targetStatus } : t))
    );

    try {
      const res = await api.tasks.update(taskId, { status: targetStatus });
      if (res.success) {
        addToast(`Moved "${res.task.title}" to ${targetStatus}`, 'success');
      }
    } catch (err) {
      addToast('Failed to sync drag and drop move', 'error');
      fetchData();
    } finally {
      setDraggedTaskId(null);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
  };

  const handleTaskDeleted = (deletedId) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              Tasks Board
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-500 font-bold">
                {tasks.length} Tasks
              </span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Drag & drop tasks between Backlog, In Progress, Review, and Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 text-xs bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-brand text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-brand shrink-0 hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-semibold">Loading Tasks Board...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPRINT_COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="flex flex-col rounded-3xl bg-gray-100/70 dark:bg-dark-bg/60 border border-gray-200/60 dark:border-gray-800 p-4 min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.badgeColor}`}></span>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 shadow-sm">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      onClick={() => setSelectedTask(t)}
                      className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-xl hover:border-brand-500/50 cursor-grab active:cursor-grabbing transition-all duration-200 space-y-3 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
                          {t.project_name || t.workspace_name || 'Core Project'}
                        </span>
                        <PriorityBadge priority={t.priority} />
                      </div>

                      <h4 className="text-xs font-extrabold text-gray-900 dark:text-white leading-snug group-hover:text-brand-500 transition-colors">
                        {t.title}
                      </h4>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
                          <Calendar className="w-3 h-3 text-brand-500" />
                          {t.due_date}
                        </div>

                        <div className="flex items-center gap-2">
                          <img
                            src={t.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-brand-500/40"
                            title={t.assignee_name || 'Assignee'}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-gray-300 dark:border-gray-700/60 rounded-2xl flex items-center justify-center text-[11px] text-gray-400 font-medium">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={handleTaskCreated}
        projects={projects}
        teamMembers={teamMembers}
      />

      <TaskDetailModal
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </div>
  );
};
