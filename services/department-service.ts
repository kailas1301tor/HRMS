// services/department-service.ts
import { api } from '@/lib/api';

export interface Department {
  id: number;
  name: string;
  description: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentResponse {
  message: string;
  results: {
    data: Department[];
  };
}

export interface SingleDepartmentResponse {
  message: string;
  results: {
    data: Department;
  };
}

export const FALLBACK_DEPARTMENTS: Department[] = [
  { id: 1, name: 'COMPLIANCE', description: 'Compliance and Legal Department' },
  { id: 2, name: 'FINANCE', description: 'Financial planning and accounting' },
  { id: 3, name: 'HR', description: 'Human Resources and talent acquisition' },
  { id: 4, name: 'IT', description: 'Information Technology and support' },
  { id: 5, name: 'SALES & OPERATIONS', description: 'Sales, operations, and business development' },
];

export const departmentService = {
  /**
   * Fetch all departments. Falls back to mock data on error.
   */
  async getDepartments(): Promise<Department[]> {
    try {
      const response = await api.get<DepartmentResponse>('/api/master/departments/');
      return response.results?.data ?? FALLBACK_DEPARTMENTS;
    } catch (error) {
      console.warn('🔴 Network error fetching departments. Loading mock fallback.', error);
      return FALLBACK_DEPARTMENTS;
    }
  },

  /**
   * Create a new department.
   */
  async createDepartment(name: string, description: string): Promise<Department> {
    const response = await api.post<SingleDepartmentResponse>('/api/master/departments/', {
      name,
      description,
    });
    return response.results.data;
  },

  /**
   * Update an existing department.
   */
  async updateDepartment(id: number, name: string, description: string): Promise<Department> {
    const response = await api.put<SingleDepartmentResponse>('/api/master/departments/', {
      id,
      name,
      description,
    });
    return response.results.data;
  },

  /**
   * Delete a department.
   */
  async deleteDepartment(id: number): Promise<void> {
    await api.delete('/api/master/departments/', { params: { id } });
  }
};
