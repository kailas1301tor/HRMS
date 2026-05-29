// services/asset-service.ts
import { api } from '@/lib/api';

export interface DropdownItem {
  id: number;
  name: string;
}

export interface AssetDropdowns {
  asset_types: DropdownItem[];
  asset_categories: DropdownItem[];
  maintenance_shops: DropdownItem[];
  vendors: DropdownItem[];
  service_types: DropdownItem[];
  asset_status: DropdownItem[];
}

export interface BackendAsset {
  id: number;
  asset_type?: string;
  asset_category?: string;
  department?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  deleted: boolean;
  name: string;
  serial_number: string | null;
  location: string | null;
  sub_location: string | null;
  purchase_cost: string | null;
  purchase_date: string | null;
  warranty_period: number | null;
  service_due_date: string | null;
}

export interface CreateAssetPayload {
  name: string;
  serial_number?: string | null;
  asset_type?: number | null;
  asset_category?: number | null;
  department?: number | null;
  location?: string | null;
  sub_location?: string | null;
  purchase_cost?: number | null;
  purchase_date?: string | null;
  warranty_period?: number | null;
  service_due_date?: string | null;
  status?: number | null;
}

export interface AssetListParams {
  page?: number;
  page_size?: number;
  search?: string;
  asset_type?: number | string;
  status?: number | string;
}

export interface AssetListResponse {
  message: string;
  results: {
    total_count: number;
    total_pages: number;
    current_page: number;
    item_per_page: number;
    data: BackendAsset[];
  };
}

export interface AssetDropdownsResponse {
  message: string;
  results: {
    data: AssetDropdowns;
  };
}

export interface SingleAssetResponse {
  message: string;
  results: {
    data: BackendAsset;
  };
}

export const FALLBACK_DROPDOWNS: AssetDropdowns = {
  asset_types: [
    { id: 2, name: 'Laptop' },
    { id: 1, name: 'Desktop' }
  ],
  asset_categories: [
    { id: 2, name: 'Electronics' },
    { id: 1, name: 'Furniture' }
  ],
  maintenance_shops: [
    { id: 2, name: 'IT Support' },
    { id: 1, name: 'General Maintenance' }
  ],
  vendors: [
    { id: 2, name: 'Dell' },
    { id: 1, name: 'HP' }
  ],
  service_types: [
    { id: 2, name: 'Repair' },
    { id: 1, name: 'Replacement' }
  ],
  asset_status: [
    { id: 2, name: 'Assigned' },
    { id: 1, name: 'In Repair' }
  ]
};

export const assetService = {
  /** Fetch dropdown values from API. Handles failure gracefully. */
  async getAssetDropdowns(signal?: AbortSignal): Promise<AssetDropdowns> {
    try {
      const response = await api.get<AssetDropdownsResponse>('/api/asset/asset-dropdowns/', { signal });
      return response.results?.data ?? FALLBACK_DROPDOWNS;
    } catch (error) {
      console.warn('🔴 Network error fetching asset dropdowns. Loading fallback.', error);
      return FALLBACK_DROPDOWNS;
    }
  },

  /** Fetch assets list. Handles failure gracefully. */
  async getAssets(params: AssetListParams, fallback: BackendAsset[], signal?: AbortSignal): Promise<{
    data: BackendAsset[];
    total_count: number;
    total_pages: number;
    current_page: number;
  }> {
    try {
      const cleanParams: Record<string, string | number | boolean> = {};
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val;
        }
      });
      const response = await api.get<AssetListResponse>('/api/asset/assets/', { params: cleanParams, signal });
      return {
        data: response.results?.data || [],
        total_count: response.results?.total_count || 0,
        total_pages: response.results?.total_pages || 1,
        current_page: response.results?.current_page || 1,
      };
    } catch (error) {
      console.warn('🔴 Network error fetching assets. Loading fallback.', error);
      return {
        data: fallback,
        total_count: fallback.length,
        total_pages: 1,
        current_page: 1,
      };
    }
  },

  /** Fetch a single asset detail by path parameter ID. */
  async getAssetById(id: number, signal?: AbortSignal): Promise<BackendAsset> {
    const response = await api.get<SingleAssetResponse>(`/api/asset/assets/${id}/`, { signal });
    return response.results.data;
  },

  /** Create a new asset on the backend. */
  async createAsset(payload: CreateAssetPayload): Promise<BackendAsset> {
    const response = await api.post<SingleAssetResponse>('/api/asset/assets/', payload);
    return response.results.data;
  },

  /** Update an existing asset on the backend. */
  async updateAsset(payload: CreateAssetPayload & { id: number }): Promise<BackendAsset> {
    const response = await api.put<SingleAssetResponse>('/api/asset/assets/', payload);
    return response.results.data;
  },

  /** Delete / dispose an asset on the backend using query param ID. */
  async deleteAsset(id: number): Promise<void> {
    await api.delete('/api/asset/assets/', { params: { id } });
  }
};
