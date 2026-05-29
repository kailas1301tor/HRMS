// services/nationality-service.ts
import { api } from '@/lib/api';

export interface Nationality {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface NationalityListResponse {
  message: string;
  results: {
    data: Nationality[];
  };
}

interface SingleNationalityResponse {
  message: string;
  results: {
    data: Nationality;
  };
}

export const nationalityService = {
  /** Fetch all nationalities from the API. */
  async getNationalities(signal?: AbortSignal): Promise<Nationality[]> {
    const response = await api.get<NationalityListResponse>('/api/master/nationalities/', { signal });
    return response.results?.data ?? [];
  },

  /** Create a new nationality. */
  async createNationality(name: string): Promise<Nationality> {
    const response = await api.post<SingleNationalityResponse>('/api/master/nationalities/', { name });
    return response.results.data;
  },

  /** Update an existing nationality. */
  async updateNationality(id: number, name: string): Promise<Nationality> {
    const response = await api.put<SingleNationalityResponse>('/api/master/nationalities/', { id, name });
    return response.results.data;
  },

  /** Delete a nationality by ID. */
  async deleteNationality(id: number): Promise<void> {
    await api.delete('/api/master/nationalities/', { params: { id } });
  },
};
