import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { User, Lock, Bell, Moon, Sun, Save, ShieldCheck } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { addToast } = useNotification();

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Rivera',
    title: user?.title || 'Product Lead & Founder',
    bio: user?.bio || 'Leading product vision and design strategy at Taskora.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    sprintUpdates: true,
    taskMentions: true
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const res = await api.user.updateProfile(profileData);
      if (res.success) {
        updateUserProfile(res.user);
        addToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      addToast('Please fill out both password fields', 'error');
      return;
    }

    setLoadingPass(true);
    try {
      const res = await api.user.changePassword(passwordData);
      if (res.success) {
        addToast('Password changed successfully!', 'success');
        setPasswordData({ currentPassword: '', newPassword: '' });
      }
    } catch (err) {
      addToast(err.message || 'Failed to change password', 'error');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft flex items-center gap-4">
        <img
          src={profileData.avatar}
          alt=""
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/50 shadow-soft"
        />
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{user?.name || 'Alex Rivera'}</h1>
          <p className="text-xs text-brand-500 font-bold">{user?.role || 'Admin'} • Taskora Account</p>
        </div>
      </div>

      {/* 1. Edit Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-6">
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-brand-500" /> Edit Profile Information
        </h3>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Bio / Focus
            </label>
            <textarea
              rows="3"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingProfile}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-brand text-white shadow-brand hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {loadingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Change Password Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-6">
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-500" /> Security & Password
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loadingPass}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gray-900 dark:bg-gray-800 text-white hover:bg-black transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> {loadingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* 3. Preferences & Dark Mode Toggle */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-6">
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-500" /> Workspace Preferences & Dark Mode
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg/60">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">Dark Mode Interface</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Toggle dark slate background and high contrast typography</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-2xl transition-all ${
                darkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg/60">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">Email Digest & Task Alerts</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive real-time notifications on sprint task updates</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
              className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
