import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const { addToast } = useNotification();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
      setSubmitted(true);
      addToast('Password reset email dispatched', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setEmail('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset Your Password">
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Check Your Inbox</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            We sent a secure password reset link to <strong className="text-brand-500">{email}</strong>.
          </p>
          <button
            onClick={handleClose}
            className="w-full mt-4 py-2.5 bg-gradient-brand text-white rounded-2xl font-bold text-xs shadow-brand"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter your Taskora account email address and we'll send you instructions to reset your password.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@taskora.io"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-brand text-white shadow-brand hover:opacity-95 transition-all"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
