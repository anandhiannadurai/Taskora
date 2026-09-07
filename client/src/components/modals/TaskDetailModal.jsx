import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Calendar, Clock, Tag, User, Trash2, Send, CheckCircle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const TaskDetailModal = ({ isOpen, onClose, task, onTaskUpdated, onTaskDeleted }) => {
  const { addToast } = useNotification();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', text: 'Looks great! Ensure dark mode contrast checks pass before PR review.', time: '2 hours ago' }
  ]);

  if (!task) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.tasks.update(task.id, { status: newStatus });
      if (res.success) {
        addToast(`Task moved to ${newStatus}`, 'success');
        onTaskUpdated(res.task);
      }
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
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

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: commentText.trim(),
        time: 'Just now'
      }
    ]);
    setCommentText('');
    addToast('Comment added', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Overview" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Title & Badges */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug">{task.title}</h2>
            <div className="flex items-center gap-2 shrink-0">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {task.description || 'No detailed description provided for this task.'}
          </p>
        </div>

        {/* Task Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg/60 border border-gray-100 dark:border-gray-800">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assigned Project</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white truncate block">{task.project_name || 'General Project'}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assignee</span>
            <div className="flex items-center gap-1.5">
              <img
                src={task.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt=""
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">{task.assignee_name || 'Unassigned'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Due Date</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              <Calendar className="w-3 h-3 text-brand-500" />
              {task.due_date}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Est. Time</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-500" />
              {task.estimated_hours}h
            </span>
          </div>
        </div>

        {/* Quick Status Move Actions */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Move Status Column:
          </label>
          <div className="flex flex-wrap gap-2">
            {['To Do', 'In Progress', 'Review', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
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

        {/* Comments Section */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Discussion & Activity ({comments.length})
          </h4>

          <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-dark-bg/40">
                <img src={c.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{c.author}</span>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 text-xs bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-gradient-brand text-white rounded-2xl shadow-brand hover:opacity-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </Modal>
  );
};
