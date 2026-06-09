// services/document-service.ts
import { api } from '@/lib/api';
import { buildApiUrl } from '@/lib/env';
import { cleanParams } from '@/lib/types';
import type { DropdownItem } from '@/lib/types';

export interface EmployeeDocument {
  id: number;
  employee: string | number; // name in GET list, ID in POST
  employee_name?: string;
  document_type: string | number; // type name in GET, ID in POST
  document_type_name?: string;
  document_number: string;
  expiry_date: string;
  status: 'Valid' | 'Expiring' | 'Expired' | string;
  file_url: string;
  file?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface CompanyDocument {
  id: number;
  company_document_type: string | number; // name in GET list, ID in POST
  company_document_type_name?: string;
  branch: string | number; // name in GET list, ID in POST
  branch_name?: string;
  issue_date: string;
  expiry_date: string;
  status: 'Valid' | 'Expiring' | 'Expired' | string;
  file_url: string;
  file?: string;
  document_number?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface DocumentStatusCounts {
  valid: number;
  expiring_soon: number;
  expired: number;
}

export interface EmployeeDocumentDropdowns {
  employee_document_types: DropdownItem[];
}

export interface CompanyDocumentDropdowns {
  company_document_types: DropdownItem[];
  branches: DropdownItem[];
}

// Fallback Mock Data for resilient local execution
const MOCK_DOC_FILE_A = buildApiUrl('/media/employee_documents/GettyImages-2178111688_0a3KzTP.jpg')
const MOCK_DOC_FILE_B = buildApiUrl('/media/employee_documents/GettyImages-2178111688_fgEiVIN.jpg')

const FALLBACK_EMPLOYE_DOCS: EmployeeDocument[] = [
  {
    id: 1,
    employee: 'Ahmed Al Maktoum',
    document_type: 'Emirates ID',
    document_number: '784-1990-1234567-1',
    expiry_date: '2024-01-15',
    status: 'Expired',
    file_url: MOCK_DOC_FILE_A,
  },
  {
    id: 2,
    employee: 'Sarah Johnson',
    document_type: 'Work Visa',
    document_number: 'VIS-998822',
    expiry_date: '2026-06-25',
    status: 'Expiring',
    file_url: MOCK_DOC_FILE_B,
  },
];

const FALLBACK_COMPANY_DOCS: CompanyDocument[] = [
  {
    id: 101,
    company_document_type: 'Trade License',
    branch: 'GOLD CENTER',
    issue_date: '2023-01-01',
    expiry_date: '2026-12-31',
    status: 'Valid',
    file_url: MOCK_DOC_FILE_A,
    document_number: 'TL-554433',
  },
  {
    id: 102,
    company_document_type: 'Establishment Card',
    branch: 'HEAD OFFICE',
    issue_date: '2022-05-10',
    expiry_date: '2024-05-09',
    status: 'Expired',
    file_url: MOCK_DOC_FILE_B,
    document_number: 'EC-112233',
  },
];

const FALLBACK_COUNTS = { valid: 3, expiring_soon: 2, expired: 1 };

interface DocumentListResponse<T> {
  message: string;
  results: {
    data: T[];
    total_count?: number;
  };
}

interface DocumentCountsResponse {
  message: string;
  results: {
    data: DocumentStatusCounts;
  };
}

export const employeeDocumentService = {
  async getStatusCounts(signal?: AbortSignal): Promise<DocumentStatusCounts> {
    try {
      const response = await api.get<DocumentCountsResponse>('/api/employee/employee-documents/status-counts/', { signal });
      return response.results?.data ?? FALLBACK_COUNTS;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching employee doc status counts. Loading fallbacks.', error);
      return FALLBACK_COUNTS;
    }
  },

  async getAll(
    params?: { search?: string; document_type?: string | number; status?: string },
    signal?: AbortSignal
  ): Promise<EmployeeDocument[]> {
    try {
      const response = await api.get<DocumentListResponse<EmployeeDocument>>('/api/employee/employee-documents/', {
        params: params ? cleanParams(params) : undefined,
        signal,
      });
      return response.results?.data ?? FALLBACK_EMPLOYE_DOCS;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching employee docs. Loading fallbacks.', error);
      return FALLBACK_EMPLOYE_DOCS;
    }
  },

  async upload(formData: FormData): Promise<EmployeeDocument> {
    const response = await api.post<{ results: { data: EmployeeDocument } }>('/api/employee/employee-documents/', formData);
    return response.results.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete('/api/employee/employee-documents/', { params: { id } });
  },

  async getDropdowns(signal?: AbortSignal): Promise<EmployeeDocumentDropdowns> {
    try {
      const response = await api.get<{ results: { data: EmployeeDocumentDropdowns } }>('/api/employee/dropdowns/', { signal });
      return response.results?.data ?? { employee_document_types: [] };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching employee doc dropdowns.', error);
      return {
        employee_document_types: [
          { id: 1, name: 'Passport' },
          { id: 2, name: 'ID Proof' },
        ],
      };
    }
  },
};

export const companyDocumentService = {
  async getStatusCounts(signal?: AbortSignal): Promise<DocumentStatusCounts> {
    try {
      const response = await api.get<DocumentCountsResponse>('/api/company/company-documents/status-counts/', { signal });
      return response.results?.data ?? FALLBACK_COUNTS;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching company doc status counts. Loading fallbacks.', error);
      return FALLBACK_COUNTS;
    }
  },

  async getAll(
    params?: { search?: string; document_type?: string | number; status?: string },
    signal?: AbortSignal
  ): Promise<CompanyDocument[]> {
    try {
      const response = await api.get<DocumentListResponse<CompanyDocument>>('/api/company/company-documents/', {
        params: params ? cleanParams(params) : undefined,
        signal,
      });
      return response.results?.data ?? FALLBACK_COMPANY_DOCS;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching company docs. Loading fallbacks.', error);
      return FALLBACK_COMPANY_DOCS;
    }
  },

  async upload(formData: FormData): Promise<CompanyDocument> {
    const response = await api.post<{ results: { data: CompanyDocument } }>('/api/company/company-documents/', formData);
    return response.results.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete('/api/company/company-documents/', { params: { id } });
  },

  async getDropdowns(signal?: AbortSignal): Promise<CompanyDocumentDropdowns> {
    try {
      const response = await api.get<{ results: { data: CompanyDocumentDropdowns } }>('/api/company/document-dropdowns/', { signal });
      return response.results?.data ?? { company_document_types: [], branches: [] };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching company document dropdowns. Returning fallback.', error);
      return {
        company_document_types: [
          { id: 1, name: 'Trade License' },
          { id: 2, name: 'Establishment Card' },
          { id: 3, name: 'Tenancy Contract' },
        ],
        branches: [
          { id: 1, name: 'GOLD CENTER' },
          { id: 2, name: 'HEAD OFFICE' },
        ],
      };
    }
  },
};
