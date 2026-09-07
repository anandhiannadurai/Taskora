import React, { useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const CreateWorkspaceModal = ({ isOpen, onClose, onWorkspaceSaved, initialData = null }) => {
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      description: '',
      priority: 'Medium',
      status: 'Building',
      start_date: '2026-09-01',
      end_date: '2026-11-30'
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please provide a project name', 'error');
      return;
    }

    setLoading(true);
    try {
      if (initialData && initialData.id) {
        const res = await api.projects.update(initialData.id, formData);
        if (res.success) {
          addToast('Project updated successfully', 'success');
          onWorkspaceSaved(res.project || res.workspace);
          onClose();
        }
      } else {
        const res = await api.projects.create(formData);
        if (res.success) {
          addToast('Project created successfully!', 'success');
          onWorkspaceSaved(res.project || res.workspace);
          onClose();
        }
      }
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Project' : 'Create New Project'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Project Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Taskora Core Platform 2.0"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the project objectives and scope..."
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Project Pipeline Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            >
              <option value="Idea">Idea</option>
              <option value="Building">Building</option>
              <option value="Testing">Testing</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Target Completion (End Date)
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-brand text-white shadow-brand hover:opacity-95"
          >
            {loading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
