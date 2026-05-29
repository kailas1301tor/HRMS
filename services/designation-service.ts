// services/designation-service.ts
import { api } from '@/lib/api';

export interface Designation {
  id: number;
  name: string;
  description: string;
  department: number;
  department_name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DesignationListResponse {
  message: string;
  results: {
    data: Designation[];
  };
}

export interface SingleDesignationResponse {
  message: string;
  results: {
    data: Designation;
  };
}

export const designationService = {
  /**
   * Fetch designations filtered by department.
   * Falls back to an empty list on error (department-scoped mock data would be misleading).
   */
  async getDesignations(departmentId: number): Promise<Designation[]> {
    try {
      const response = await api.get<DesignationListResponse>('/api/master/designations/', {
        params: { department_id: departmentId },
      });
      return response.results?.data ?? [];
    } catch (error) {
      console.warn('🔴 Network error fetching designations.', error);
      return [];
    }
  },

  /**
   * Create a new designation under a department.
   */
  async createDesignation(department: number, name: string, description: string): Promise<Designation> {
    const response = await api.post<SingleDesignationResponse>('/api/master/designations/', {
      department,
      name,
      description,
    });
    return response.results.data;
  },

  /**
   * Update an existing designation.
   */
  async updateDesignation(
    id: number,
    department: number,
    name: string,
    description?: string
  ): Promise<Designation> {
    const payload: Record<string, unknown> = { id, department, name };
    if (description !== undefined) {
      payload.description = description;
    }
    const response = await api.put<SingleDesignationResponse>('/api/master/designations/', payload);
    return response.results.data;
  },

  /**
   * Delete a designation.
   */
  async deleteDesignation(id: number): Promise<void> {
    await api.delete('/api/master/designations/', { params: { id } });
  },
};
