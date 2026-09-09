import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { Layers, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/');
      }
    } catch (err) {
      addToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[#F8FAFC] dark:bg-[#0B0F19] text-gray-900 dark:text-white">
      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Story */}
        <div className="lg:col-span-6 space-y-6 lg:pr-6 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gradient">Taskora</h1>
              <p className="text-xs uppercase tracking-widest font-semibold text-gray-400">Work Together. Finish Faster.</p>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
            Accelerate Project Delivery with Zero Friction.
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Taskora unites project execution, sprint kanban boards, member roles, and real-time focus mode telemetry into a single enterprise platform.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft">
              <span className="text-2xl font-extrabold text-brand-500">98.2%</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">On-Time Project Delivery</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft">
              <span className="text-2xl font-extrabold text-emerald-500">25 Min</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Built-In Focus Mode Sprint</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700/80 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Sign In to Taskora</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Access your projects, tasks and team collaboration platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-brand-500 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-brand text-white shadow-brand hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Taskora'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-4 pt-2">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 dark:border-gray-800 w-full"></div>
                <span className="bg-white dark:bg-dark-card px-3 text-[10px] uppercase font-bold text-gray-400 absolute">
                  Or Social Sign In
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => addToast('Google OAuth simulated', 'info')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold"
                >
                  <Chrome className="w-4 h-4 text-rose-500" /> Google
                </button>
                <button
                  type="button"
                  onClick={() => addToast('GitHub OAuth simulated', 'info')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold"
                >
                  <Github className="w-4 h-4 text-gray-900 dark:text-white" /> GitHub
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-brand-500 hover:underline">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />
    </div>
  );
};
