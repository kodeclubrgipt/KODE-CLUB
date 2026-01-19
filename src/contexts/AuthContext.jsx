'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api.js';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
        return response.user;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Get display name (username preferred, fallback to name)
  const getDisplayName = () => {
    if (!user) return '';
    return user.username || user.name || '';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      logout,
      updateUser,
      refreshUser,
      getDisplayName
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
