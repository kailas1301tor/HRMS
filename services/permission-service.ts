// services/permission-service.ts
import { api } from '@/lib/api';

export interface BackendPermission {
  id: number;
  name: string;
}

export interface PermissionResponse {
  message: string;
  results: {
    data: BackendPermission[];
  };
}

export const permissionService = {
  /**
   * Fetch all permissions from backend.
   * Returns list of BackendPermission.
   */
  async getPermissions(signal?: AbortSignal): Promise<BackendPermission[]> {
    try {
      const response = await api.get<PermissionResponse>('/api/auth/permissions/', { signal });
      return response.results?.data || [];
    } catch (error) {
      console.warn('🔴 Network error fetching permissions. Loading mock fallback.', error);
      return this.getFallbackPermissions();
    }
  },

  /**
   * Helper to generate a default mock fallback in case of backend issues.
   */
  getFallbackPermissions(): BackendPermission[] {
    const models = [
      'log entry', 'asset', 'asset amc', 'asset assignment history', 'asset disposal',
      'asset document', 'asset maintenance history', 'group', 'permission', 'user',
      'company document', 'content type', 'employee', 'employee bank details',
      'employee document', 'asset category', 'asset document type', 'asset status',
      'asset type', 'branch', 'company document type', 'department', 'designation',
      'employee document type', 'employee type', 'leave type', 'maintenance shop',
      'nationality', 'service type', 'shift', 'vendor', 'session'
    ];

    const fallbackList: BackendPermission[] = [];
    let idCounter = 1;

    for (const model of models) {
      const actions = ['add', 'change', 'delete', 'view'];
      for (const action of actions) {
        fallbackList.push({
          id: idCounter++,
          name: `Can ${action} ${model}`
        });
      }
    }

    return fallbackList;
  }
};
