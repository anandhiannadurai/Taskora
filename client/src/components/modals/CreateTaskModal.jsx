import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, projects = [], teamMembers = [] }) => {
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'High',
    project_id: projects[0]?.id || '',
    assignee_id: teamMembers[0]?.id || '',
    due_date: '2026-09-30',
    estimated_hours: 4,
    tags: 'UI, Feature'
  });

  useEffect(() => {
    if (projects.length > 0 && !formData.project_id) {
      setFormData((prev) => ({ ...prev, project_id: projects[0].id }));
    }
    if (teamMembers.length > 0 && !formData.assignee_id) {
      setFormData((prev) => ({ ...prev, assignee_id: teamMembers[0].id }));
    }
  }, [projects, teamMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Please enter a task title', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.tasks.create(formData);
      if (res.success) {
        addToast('Task created successfully!', 'success');
        onTaskCreated(res.task);
        onClose();
        setFormData({
          title: '',
          description: '',
          status: 'To Do',
          priority: 'High',
          project_id: projects[0]?.id || '',
          assignee_id: teamMembers[0]?.id || '',
          due_date: '2026-09-30',
          estimated_hours: 4,
          tags: 'UI, Feature'
        });
      }
    } catch (err) {
      addToast(err.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Implement drag-and-drop state handler"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Task technical requirements and acceptance criteria..."
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Assigned Project
            </label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Assignee
            </label>
            <select
              value={formData.assignee_id}
              onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2.5 text-xs font-medium bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2.5 text-xs font-medium bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Est. Hours
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) })}
              className="w-full px-3 py-2.5 text-xs bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. Frontend, Auth"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-brand text-white shadow-brand hover:opacity-95 transition-all"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
