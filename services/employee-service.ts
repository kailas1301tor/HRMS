// services/employee-service.ts
import { api } from '@/lib/api';
import type { Employee } from '@/components/employees/employee-table';

export interface DropdownItem {
  id: number | string;
  name: string;
}

export interface DropdownData {
  roles: DropdownItem[];
  departments: DropdownItem[];
  designations: (DropdownItem & { department_id?: number })[];
  shifts: DropdownItem[];
  employee_types: DropdownItem[];
  nationalities: DropdownItem[];
  status_choices: DropdownItem[];
  accommodation_choices: DropdownItem[];
}

export interface DropdownResponse {
  message: string;
  results: {
    data: DropdownData;
  };
}

export interface CreateEmployeePayload {
  username: string;
  email: string;
  password?: string;
  full_name: string;
  phone_number: string;
  role: number;
  department: number;
  designation: number;
  employee_id: string;
  status: string;
  shift: number;
  joined_date: string;
  employee_type: number;
  basic_salary: string;
  accommodation: string;
  date_of_birth: string;
  nationality: number;
  address: string;
  bank_details: {
    bank_name: string;
    account_number: string;
    ifsc: string;
    branch: string;
  };
}

export interface EmployeeListParams {
  page?: number;
  page_size?: number;
  search?: string;
  department?: number | string;
  status?: string;
}

export interface EmployeeListResponse {
  message: string;
  results: {
    total_count: number;
    total_pages: number;
    current_page: number;
    item_per_page: number;
    data: Employee[];
  };
}

export const employeeService = {
  /**
   * Fetches dropdown metadata from the backend.
   */
  async getDropdowns(): Promise<DropdownData> {
    const response = await api.get<DropdownResponse>('/api/employee/dropdowns/');
    return response.results.data;
  },

  /**
   * Fetches the employee list from the backend.
   * Bubbles up errors directly to the caller.
   */
  async getEmployees(params: EmployeeListParams): Promise<{
    data: Employee[];
    total_count: number;
    total_pages: number;
    current_page: number;
  }> {
    const cleanParams: Record<string, string | number | boolean> = {}
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        cleanParams[key] = val
      }
    })
    const response = await api.get<EmployeeListResponse>('/api/employee/employees/', { params: cleanParams });
    return {
      data: response.results?.data || [],
      total_count: response.results?.total_count || 0,
      total_pages: response.results?.total_pages || 1,
      current_page: response.results?.current_page || 1,
    };
  },

  /**
   * Fetches a single employee detail from the backend.
   */
  async getEmployee(id: number): Promise<Employee> {
    const response = await api.get<{ results: { data: Employee } }>(`/api/employee/employees/${id}/`);
    return response.results.data;
  },

  /**
   * Creates a new employee on the backend.
   */
  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const response = await api.post<{ results: { data: Employee } }>('/api/employee/employees/', payload);
    return response.results.data;
  },

  /**
   * Updates an existing employee on the backend.
   */
  async updateEmployee(payload: Partial<CreateEmployeePayload> & { id: number }): Promise<Employee> {
    const response = await api.put<{ results: { data: Employee } }>('/api/employee/employees/', payload);
    return response.results.data;
  },

  /**
   * Deletes an employee from the backend.
   */
  async deleteEmployee(id: number): Promise<void> {
    await api.delete('/api/employee/employees/', { params: { id } });
  }
};
