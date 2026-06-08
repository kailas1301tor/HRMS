// services/onboarding-offboarding-service.ts
import { api } from '@/lib/api';
import { cleanParams } from '@/lib/types';
import type { Employee } from '@/components/employees/employee-table';

export interface MasterDocType {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeDocument {
  id: number;
  document_type: string; // name in GET response
  file_url: string;
  file?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  deleted?: boolean;
  employee: number;
}

// Fallback datasets for local development/resiliency
const FALLBACK_ONBOARDING_TYPES: MasterDocType[] = [
  { id: 1, name: 'Offer Letter Signed' },
  { id: 2, name: 'Passport Copy' },
  { id: 3, name: 'Visa Copy' },
];

const FALLBACK_OFFBOARDING_TYPES: MasterDocType[] = [
  { id: 1, name: 'Resignation Letter' },
  { id: 2, name: 'Exit Interview Form' },
  { id: 3, name: 'NOC Letter' },
];

const FALLBACK_DOCUMENTS: EmployeeDocument[] = [];

export interface MasterDocTypeListResponse {
  message: string;
  results: {
    data: MasterDocType[];
  };
}

export interface MasterDocTypeResponse {
  message: string;
  results: {
    data: MasterDocType;
  };
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

export interface EmployeeDocumentsResponse {
  message: string;
  results: {
    total_count: number;
    total_pages: number;
    current_page: number;
    item_per_page: number;
    data: EmployeeDocument[];
  };
}

export interface SingleDocumentResponse {
  message: string;
  results: {
    data: EmployeeDocument;
  };
}

export const onboardingOffboardingService = {
  // Onboarding Master Doc Types
  async getOnboardingDocTypes(signal?: AbortSignal): Promise<MasterDocType[]> {
    try {
      const response = await api.get<MasterDocTypeListResponse>('/api/master/onboarding-document-types/', { signal });
      return response.results?.data ?? FALLBACK_ONBOARDING_TYPES;
    } catch (error) {
      console.warn('🔴 Network error fetching onboarding doc types. Loading fallbacks.', error);
      return FALLBACK_ONBOARDING_TYPES;
    }
  },

  async createOnboardingDocType(name: string): Promise<MasterDocType> {
    const response = await api.post<MasterDocTypeResponse>('/api/master/onboarding-document-types/', { name });
    return response.results.data;
  },

  async updateOnboardingDocType(id: number, name: string): Promise<MasterDocType> {
    const response = await api.put<MasterDocTypeResponse>('/api/master/onboarding-document-types/', { id, name });
    return response.results.data;
  },

  async deleteOnboardingDocType(id: number): Promise<void> {
    await api.delete('/api/master/onboarding-document-types/', { params: { id } });
  },

  // Offboarding Master Doc Types
  async getOffboardingDocTypes(signal?: AbortSignal): Promise<MasterDocType[]> {
    try {
      const response = await api.get<MasterDocTypeListResponse>('/api/master/offboarding-document-types/', { signal });
      return response.results?.data ?? FALLBACK_OFFBOARDING_TYPES;
    } catch (error) {
      console.warn('🔴 Network error fetching offboarding doc types. Loading fallbacks.', error);
      return FALLBACK_OFFBOARDING_TYPES;
    }
  },

  async createOffboardingDocType(name: string): Promise<MasterDocType> {
    const response = await api.post<MasterDocTypeResponse>('/api/master/offboarding-document-types/', { name });
    return response.results.data;
  },

  async updateOffboardingDocType(id: number, name: string): Promise<MasterDocType> {
    const response = await api.put<MasterDocTypeResponse>('/api/master/offboarding-document-types/', { id, name });
    return response.results.data;
  },

  async deleteOffboardingDocType(id: number): Promise<void> {
    await api.delete('/api/master/offboarding-document-types/', { params: { id } });
  },

  // Onboarding/Offboarding Employees Lists
  async getOnboardingEmployees(
    params: {
      page?: number;
      page_size?: number;
      search?: string;
      department?: number | string;
      status?: string;
    },
    signal?: AbortSignal
  ): Promise<{
    data: Employee[];
    total_count: number;
    total_pages: number;
    current_page: number;
  }> {
    try {
      const response = await api.get<EmployeeListResponse>('/api/employee/onboarding-employees/', {
        params: cleanParams(params),
        signal,
      });
      return {
        data: response.results?.data ?? [],
        total_count: response.results?.total_count ?? 0,
        total_pages: response.results?.total_pages ?? 1,
        current_page: response.results?.current_page ?? 1,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching onboarding employees.', error);
      return { data: [], total_count: 0, total_pages: 1, current_page: 1 };
    }
  },

  async getOffboardingEmployees(
    params: {
      page?: number;
      page_size?: number;
      search?: string;
      department?: number | string;
      status?: string;
    },
    signal?: AbortSignal
  ): Promise<{
    data: Employee[];
    total_count: number;
    total_pages: number;
    current_page: number;
  }> {
    try {
      const response = await api.get<EmployeeListResponse>('/api/employee/offboarding-employees/', {
        params: cleanParams(params),
        signal,
      });
      return {
        data: response.results?.data ?? [],
        total_count: response.results?.total_count ?? 0,
        total_pages: response.results?.total_pages ?? 1,
        current_page: response.results?.current_page ?? 1,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching offboarding employees.', error);
      return { data: [], total_count: 0, total_pages: 1, current_page: 1 };
    }
  },

  // Onboarding/Offboarding Documents by Employee ID
  async getOnboardingDocuments(employeeId: number, signal?: AbortSignal): Promise<EmployeeDocument[]> {
    try {
      const response = await api.get<EmployeeDocumentsResponse>('/api/employee/onboarding-documents/', {
        params: { employee_id: employeeId },
        signal,
      });
      return response.results?.data ?? FALLBACK_DOCUMENTS;
    } catch (error) {
      console.warn(`🔴 Network error fetching onboarding documents for employee ${employeeId}.`, error);
      return FALLBACK_DOCUMENTS;
    }
  },

  async getOffboardingDocuments(employeeId: number, signal?: AbortSignal): Promise<EmployeeDocument[]> {
    try {
      const response = await api.get<EmployeeDocumentsResponse>('/api/employee/offboarding-documents/', {
        params: { employee_id: employeeId },
        signal,
      });
      return response.results?.data ?? FALLBACK_DOCUMENTS;
    } catch (error) {
      console.warn(`🔴 Network error fetching offboarding documents for employee ${employeeId}.`, error);
      return FALLBACK_DOCUMENTS;
    }
  },

  // Upload Onboarding/Offboarding Documents
  async uploadOnboardingDocument(formData: FormData): Promise<EmployeeDocument> {
    const response = await api.post<SingleDocumentResponse>('/api/employee/onboarding-documents/', formData);
    return response.results.data;
  },

  async uploadOffboardingDocument(formData: FormData): Promise<EmployeeDocument> {
    const response = await api.post<SingleDocumentResponse>('/api/employee/offboarding-documents/', formData);
    return response.results.data;
  },
};
