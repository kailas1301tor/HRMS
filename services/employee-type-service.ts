// services/employee-type-service.ts
import { api } from '@/lib/api';

export interface EmployeeType {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface EmployeeTypeListResponse {
  message: string;
  results: {
    data: EmployeeType[];
  };
}

interface SingleEmployeeTypeResponse {
  message: string;
  results: {
    data: EmployeeType;
  };
}

export const employeeTypeService = {
  /** Fetch all employee types from the API. */
  async getEmployeeTypes(signal?: AbortSignal): Promise<EmployeeType[]> {
    const response = await api.get<EmployeeTypeListResponse>('/api/master/employee-types/', { signal });
    return response.results?.data ?? [];
  },

  /** Create a new employee type. */
  async createEmployeeType(name: string): Promise<EmployeeType> {
    const response = await api.post<SingleEmployeeTypeResponse>('/api/master/employee-types/', { name });
    return response.results.data;
  },

  /** Update an existing employee type. */
  async updateEmployeeType(id: number, name: string): Promise<EmployeeType> {
    const response = await api.put<SingleEmployeeTypeResponse>('/api/master/employee-types/', { id, name });
    return response.results.data;
  },

  /** Delete an employee type by ID. */
  async deleteEmployeeType(id: number): Promise<void> {
    await api.delete('/api/master/employee-types/', { params: { id } });
  },
};
