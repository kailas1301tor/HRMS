// services/employee-document-type-service.ts
import { api } from '@/lib/api';

export interface EmployeeDocumentType {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface EmployeeDocTypeListResponse {
  message: string;
  results: {
    data: EmployeeDocumentType[];
  };
}

interface SingleEmployeeDocTypeResponse {
  message: string;
  results: {
    data: EmployeeDocumentType;
  };
}

export const employeeDocumentTypeService = {
  /** Fetch all employee document types from the API. */
  async getEmployeeDocTypes(signal?: AbortSignal): Promise<EmployeeDocumentType[]> {
    const response = await api.get<EmployeeDocTypeListResponse>('/api/master/employee-document-types/', { signal });
    return response.results?.data ?? [];
  },

  /** Create a new employee document type. */
  async createEmployeeDocType(name: string): Promise<EmployeeDocumentType> {
    const response = await api.post<SingleEmployeeDocTypeResponse>('/api/master/employee-document-types/', { name });
    return response.results.data;
  },

  /** Update an existing employee document type. */
  async updateEmployeeDocType(id: number, name: string): Promise<EmployeeDocumentType> {
    const response = await api.put<SingleEmployeeDocTypeResponse>('/api/master/employee-document-types/', { id, name });
    return response.results.data;
  },

  /** Delete an employee document type by ID. */
  async deleteEmployeeDocType(id: number): Promise<void> {
    await api.delete('/api/master/employee-document-types/', { params: { id } });
  },
};
