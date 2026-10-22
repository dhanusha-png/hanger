import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session on initial load or refresh via /api/auth/me
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      return;
    }

    authApi.getMe()
      .then(res => {
        if (mounted && res?.user) {
          setUser(res.user);
        }
      })
      .catch(() => {
        if (mounted) {
          localStorage.removeItem('token');
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setAuthLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials, maybeUser) => {
    // Direct session passing: login(token, user)
    if (typeof credentials === 'string') {
      const token = credentials;
      localStorage.setItem('token', token);
      if (maybeUser) {
        setUser(maybeUser);
      } else {
        try {
          const res = await authApi.getMe();
          if (res?.user) setUser(res.user);
        } catch (_) {}
      }
      return { token, user: maybeUser };
    }

    // Direct session object: login({ token, user })
    if (credentials?.token && credentials?.user) {
      localStorage.setItem('token', credentials.token);
      setUser(credentials.user);
      return credentials;
    }

    // Standard credential submission: login({ email, password })
    const res = await authApi.login(credentials);
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    if (res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload);
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    if (res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(prev => ({ ...prev, ...updated }));
  }, []);

  const value = {
    user,
    authLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
