// services/company-document-type-service.ts
import { api } from '@/lib/api';

export interface CompanyDocumentType {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CompanyDocTypeListResponse {
  message: string;
  results: {
    data: CompanyDocumentType[];
  };
}

interface SingleCompanyDocTypeResponse {
  message: string;
  results: {
    data: CompanyDocumentType;
  };
}

export const companyDocumentTypeService = {
  /** Fetch all company document types from the API. */
  async getCompanyDocTypes(signal?: AbortSignal): Promise<CompanyDocumentType[]> {
    const response = await api.get<CompanyDocTypeListResponse>('/api/master/company-document-types/', { signal });
    return response.results?.data ?? [];
  },

  /** Create a new company document type. */
  async createCompanyDocType(name: string): Promise<CompanyDocumentType> {
    const response = await api.post<SingleCompanyDocTypeResponse>('/api/master/company-document-types/', { name });
    return response.results.data;
  },

  /** Update an existing company document type. */
  async updateCompanyDocType(id: number, name: string): Promise<CompanyDocumentType> {
    const response = await api.put<SingleCompanyDocTypeResponse>('/api/master/company-document-types/', { id, name });
    return response.results.data;
  },

  /** Delete a company document type by ID. */
  async deleteCompanyDocType(id: number): Promise<void> {
    await api.delete('/api/master/company-document-types/', { params: { id } });
  },
};
