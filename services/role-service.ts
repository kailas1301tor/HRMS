// services/role-service.ts
import { api } from '@/lib/api';

export interface BackendPermissionSummary {
  id: number;
  name: string;
}

export interface BackendRole {
  id: number;
  name: string;
  permissions: BackendPermissionSummary[];
}

export interface RoleResponse {
  message: string;
  results: {
    data: BackendRole[];
  };
}

export interface SingleRoleResponse {
  message: string;
  results: {
    data: BackendRole;
  };
}

export const roleService = {
  /**
   * Fetch all roles (groups) from the backend.
   */
  async getRoles(signal?: AbortSignal): Promise<BackendRole[]> {
    try {
      const response = await api.get<RoleResponse>('/api/auth/groups/', { signal });
      return response.results?.data || [];
    } catch (error) {
      console.warn('🔴 Network error fetching roles. Loading mock fallback.', error);
      return this.getFallbackRoles();
    }
  },

  /**
   * Fetch a single role by ID.
   */
  async getRoleById(id: number, signal?: AbortSignal): Promise<BackendRole | null> {
    try {
      const response = await api.get<SingleRoleResponse>(`/api/auth/groups/?id=${id}`, { signal });
      return response.results?.data || null;
    } catch (error) {
      console.warn(`🔴 Error fetching role ID ${id}.`, error);
      return null;
    }
  },

  /**
   * Create a new role.
   */
  async createRole(name: string, permissionIds: number[]): Promise<BackendRole> {
    const payload = {
      name,
      permission_ids: permissionIds
    };
    const response = await api.post<SingleRoleResponse>('/api/auth/groups/', payload);
    return response.results.data;
  },

  /**
   * Update an existing role.
   */
  async updateRole(id: number, name: string, permissionIds: number[]): Promise<BackendRole> {
    const payload = {
      id,
      name,
      permission_ids: permissionIds
    };
    const response = await api.put<SingleRoleResponse>('/api/auth/groups/', payload);
    return response.results.data;
  },

  /**
   * Delete a role by ID.
   */
  async deleteRole(id: number): Promise<void> {
    await api.delete<void>('/api/auth/groups/', {
      params: { id }
    });
  },

  /**
   * Fallback mock roles in case of backend network failure.
   */
  getFallbackRoles(): BackendRole[] {
    return [
      {
        id: 1,
        name: 'Super Admin',
        permissions: [
          { id: 1, name: 'Can add log entry' },
          { id: 2, name: 'Can change log entry' },
          { id: 3, name: 'Can delete log entry' }
        ]
      },
      {
        id: 2,
        name: 'Admin',
        permissions: [
          { id: 1, name: 'Can add log entry' },
          { id: 2, name: 'Can change log entry' },
          { id: 3, name: 'Can delete log entry' }
        ]
      }
    ];
  }
};
