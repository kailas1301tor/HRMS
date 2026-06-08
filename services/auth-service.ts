// services/auth-service.ts
import { api } from '@/lib/api';

export interface LoginResponse {
  message: string;
  results: {
    data: {
      refresh: string;
      access: string;
      user_id: number;
      username: string;
      email: string;
      has_password_changed: boolean;
    };
  };
}

export const authService = {
  /**
   * Log in user using credentials.
   * Directly queries the backend API.
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    return await api.post<LoginResponse>('/api/auth/login/', { username, password });
  },

  /**
   * Set password for a new employee.
   * Accepts an explicit token since the auth cookie may not be set yet.
   */
  async setPassword(password: string, confirmPassword: string, token?: string): Promise<{ message: string }> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return await api.post<{ message: string }>('/api/employee/set-password/', {
      new_password: password,
      confirm_new_password: confirmPassword,
    }, { headers });
  },

  /**
   * Clears session cookies and redirects to login page.
   */
  logout() {
    document.cookie = 'auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'auth_username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'auth_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    window.location.href = '/login';
  }
};

