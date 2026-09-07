import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Overview } from './features/overview/Overview';
import { Workspace } from './features/workspace/Workspace';
import { SprintBoard } from './features/sprint/SprintBoard';
import { Members } from './features/members/Members';
import { Insights } from './features/insights/Insights';
import { FocusMode } from './features/focus/FocusMode';
import { Profile } from './features/profile/Profile';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected App Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="projects" element={<Workspace />} />
                <Route path="workspace" element={<Workspace />} />
                <Route path="tasks" element={<SprintBoard />} />
                <Route path="sprint" element={<SprintBoard />} />
                <Route path="members" element={<Members />} />
                <Route path="insights" element={<Insights />} />
                <Route path="focus" element={<FocusMode />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
