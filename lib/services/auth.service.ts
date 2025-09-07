import apiClient from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: any;
  refreshToken: string;
  expiresIn?: number;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const response = await apiClient.post('/register', {
      email,
      password,
      confirmPassword
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/api/profile');
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/logout');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/refresh-token', { refreshToken });
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/forgotpassword', { email });
    return response.data;
  },

  async resetPassword(email: string, resetCode: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/reset-password', {
      email,
      resetCode,
      newPassword
    });
    return response.data;
  },
};