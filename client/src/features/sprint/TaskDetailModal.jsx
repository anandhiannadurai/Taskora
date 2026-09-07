import React from 'react';
import { Modal } from '../../shared/components/Modal';
import { StatusBadge, PriorityBadge } from '../../shared/components/Badge';
import { Calendar, Trash2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const TaskDetailModal = ({ isOpen, onClose, task, onTaskUpdated, onTaskDeleted }) => {
  const { addToast } = useNotification();
  if (!task) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.tasks.update(task.id, { status: newStatus });
      if (res.success) {
        addToast(`Task moved to ${newStatus}`, 'success');
        onTaskUpdated(res.task);
      }
    } catch (err) {
      addToast('Failed to update task status', 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      try {
        const res = await api.tasks.delete(task.id);
        if (res.success) {
          addToast('Task deleted', 'success');
          onTaskDeleted(task.id);
          onClose();
        }
      } catch (err) {
        addToast('Failed to delete task', 'error');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" maxWidth="max-w-xl">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug">{task.title}</h2>
            <div className="flex items-center gap-2 shrink-0">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {task.description || 'No detailed technical specification provided for this task.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg/60 border border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Project</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white truncate block">{task.project_name || task.workspace_name || 'Core Project'}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assigned To</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <img
                src={task.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt=""
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">{task.assignee_name || 'Unassigned'}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Due Date</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-brand-500" />
              {task.due_date}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Reassign Kanban Stage:
          </label>
          <div className="flex flex-wrap gap-2">
            {['Backlog', 'In Progress', 'Review', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  task.status === s
                    ? 'bg-brand-500 text-white shadow-brand scale-[1.02]'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Trash2 className="w-4 h-4" /> Delete Task
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
