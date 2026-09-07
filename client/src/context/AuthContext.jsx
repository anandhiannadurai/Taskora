import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('taskora_token');
      if (token) {
        try {
          const res = await api.auth.me();
          if (res.success) {
            setUser(res.user);
          } else {
            localStorage.removeItem('taskora_token');
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
          localStorage.removeItem('taskora_token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await api.auth.login(credentials);
    if (res.success) {
      localStorage.setItem('taskora_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success) {
      localStorage.setItem('taskora_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const demoLogin = async (role = 'Admin') => {
    const res = await api.auth.demoLogin(role);
    if (res.success) {
      localStorage.setItem('taskora_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('taskora_token');
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
