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
  register: (email: string, password: string, confirmPassword: string) => Promise<{
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
  }>;
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
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            const refreshSuccess = await refreshAccessToken();
            if (refreshSuccess) {
              try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
              } catch {
                // If still fails, logout
                logout();
              }
            } else {
              // If refresh fails, logout
              logout();
            }
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('auth_token');
      Cookies.remove('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);

      if (response.accessToken) {
        Cookies.set('auth_token', response.accessToken, { expires: response.expiresIn || 7 });
        Cookies.set('refresh_token', response.refreshToken, { expires: 30 }); // Longer expiry for refresh token

        // Fetch user data from /api/profile
        const userData = await authService.getCurrentUser();
        setUser(userData);
        toast.success('Login successful!');
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (error: any) {
      // toast.error(error?.response?.data?.title || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) return false;

      const response = await authService.refreshToken(refreshToken);

      if (response.accessToken) {
        Cookies.set('auth_token', response.accessToken, { expires: response.expiresIn ? response.expiresIn / 86400 : 1 });
        Cookies.set('refresh_token', response.refreshToken, { expires: 30 });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log the user out
      logout();
      return false;
    }
  };

  const register = async (email: string, password: string, confirmPassword: string): Promise<{
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
  }> => {
    try {
      setLoading(true);
      const response = await authService.register(email, password, confirmPassword);

      if (response.status === 200) {
        // setUser(response.user);
        toast.success('Registration successful!');
        router.push('/login');
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error: any) {
      const errorData = error?.response?.data;
      const title = errorData?.title || 'Registration failed';
      const errors = errorData?.errors;

      // Show toast with the main error message
      toast.error(title);

      // Return detailed error information for the form
      return {
        success: false,
        message: title,
        errors: errors
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('refresh_token');
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