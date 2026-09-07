import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { CreateTaskModal } from '../features/sprint/CreateTaskModal';
import { api } from '../services/api';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [membersList, setMembersList] = useState([]);

  const handleQuickCreateTask = async () => {
    try {
      const [pRes, mRes] = await Promise.all([api.projects.getAll(), api.members.getAll()]);
      if (pRes.success) setProjectsList(pRes.projects || pRes.workspaces);
      if (mRes.success) setMembersList(mRes.members);
      setShowTaskModal(true);
    } catch (err) {
      console.error('Failed to load modal data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopNav
          setMobileOpen={setMobileOpen}
          onQuickCreateTask={handleQuickCreateTask}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ searchQuery, onQuickCreateTask: handleQuickCreateTask }} />
        </main>
      </div>

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskCreated={() => setShowTaskModal(false)}
        projects={projectsList}
        teamMembers={membersList}
      />
    </div>
  );
};
