// services/vendor-service.ts
import { api } from '@/lib/api';

export interface BackendVendor {
  id: number;
  asset_type: number;
  name: string;
  description?: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FrontendVendor {
  id: number;
  assetTypeId: number;
  name: string;
  description: string;
}

interface VendorListResponse {
  message: string;
  results: {
    data: BackendVendor[];
  };
}

interface SingleVendorResponse {
  message: string;
  results: {
    data: BackendVendor;
  };
}

function mapBackendToFrontend(vendor: BackendVendor): FrontendVendor {
  return {
    id: vendor.id,
    assetTypeId: vendor.asset_type,
    name: vendor.name,
    description: vendor.description || '',
  };
}

export const vendorService = {
  /** Fetch all vendors from the API. Handles network failures gracefully. */
  async getVendors(fallback: FrontendVendor[], signal?: AbortSignal): Promise<FrontendVendor[]> {
    try {
      const response = await api.get<VendorListResponse>('/api/master/vendors/', { signal });
      return (response.results?.data ?? []).map(mapBackendToFrontend);
    } catch (error) {
      console.warn('🔴 Network error fetching vendors. Loading mock fallback.', error);
      return fallback;
    }
  },

  /** Create a new vendor. */
  async createVendor(payload: {
    assetTypeId: number;
    name: string;
    description: string;
  }): Promise<FrontendVendor> {
    const response = await api.post<SingleVendorResponse>('/api/master/vendors/', {
      asset_type: payload.assetTypeId,
      name: payload.name,
      description: payload.description,
    });
    return mapBackendToFrontend(response.results.data);
  },

  /** Update an existing vendor. */
  async updateVendor(payload: {
    id: number;
    assetTypeId: number;
    name: string;
    description: string;
  }): Promise<FrontendVendor> {
    const response = await api.put<SingleVendorResponse>('/api/master/vendors/', {
      id: payload.id,
      asset_type: payload.assetTypeId,
      name: payload.name,
      description: payload.description,
    });
    return mapBackendToFrontend(response.results.data);
  },

  /** Delete a vendor by ID. */
  async deleteVendor(id: number): Promise<void> {
    await api.delete('/api/master/vendors/', { params: { id } });
  },
};
