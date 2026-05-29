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
   * Clears session cookies and redirects to login page.
   */
  logout() {
    document.cookie = 'auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    window.location.href = '/login';
  }
};

