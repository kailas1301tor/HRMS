// services/asset-category-service.ts
import { api } from '@/lib/api';

export interface AssetCategory {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AssetCategoryListResponse {
  message: string;
  results: {
    data: AssetCategory[];
  };
}

interface SingleAssetCategoryResponse {
  message: string;
  results: {
    data: AssetCategory;
  };
}

export const assetCategoryService = {
  /** Fetch all asset categories from the API. Handles network failures gracefully. */
  async getAssetCategories(fallback: AssetCategory[], signal?: AbortSignal): Promise<AssetCategory[]> {
    try {
      const response = await api.get<AssetCategoryListResponse>('/api/master/asset-categories/', { signal });
      return response.results?.data ?? fallback;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching asset categories. Loading mock fallback.', error);
      return fallback;
    }
  },

  /** Create a new asset category. */
  async createAssetCategory(name: string): Promise<AssetCategory> {
    const response = await api.post<SingleAssetCategoryResponse>('/api/master/asset-categories/', { name });
    return response.results.data;
  },

  /** Update an existing asset category. */
  async updateAssetCategory(id: number, name: string): Promise<AssetCategory> {
    const response = await api.put<SingleAssetCategoryResponse>('/api/master/asset-categories/', { id, name });
    return response.results.data;
  },

  /** Delete an asset category by ID. */
  async deleteAssetCategory(id: number): Promise<void> {
    await api.delete('/api/master/asset-categories/', { params: { id } });
  },
};
