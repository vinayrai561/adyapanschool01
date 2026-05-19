'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
  createdAt: string;
  selectedProgram?: string | null;
  selectedAmount?: number | null;
  studentProfile?: any;
  companyProfile?: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface SignupData {
  role: 'student' | 'organization';
  firstName?: string;
  lastName?: string;
  fullName?: string;
  companyName?: string;
  selectedProgram?: string;
  selectedAmount?: number;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
        setError(null);
      } catch (err: any) {
        setUser(null);
        // 401 is expected when user is not authenticated — suppress console noise
        if (err?.response?.status !== 401) {
          // Only log unexpected errors
          console.warn('[useAuth] Unexpected error fetching user:', err?.response?.status);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      setUser(response.data.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/signup', data);
      setUser(response.data.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    clearError,
  };
}
