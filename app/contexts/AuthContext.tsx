'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { authService } from '../../lib/services/auth.service';

interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  headline?: string;
  summary?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('auth_token');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      console.log("🚀 ~ login ~ response:", response)

      if (response.accessToken) {
        Cookies.set('auth_token', response.accessToken, { expires: response.expiresIn || 7 });
        // Fetch user data from /api/profile
        const userData = await authService.getCurrentUser();
        setUser(userData);
        toast.success('Login successful!');
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.register(email, password, confirmPassword);

      if (response.accessToken) {
        Cookies.set('auth_token', response.accessToken, { expires: 7 });
        // setUser(response.user);
        toast.success('Registration successful!');
        router.push('/login');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};