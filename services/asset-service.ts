// services/asset-service.ts
import { api } from '@/lib/api';
import { cleanParams } from '@/lib/types';
import type {
  AssetDropdowns,
  AssetDropdownsResponse,
  AssetListParams,
  AssetListResponse,
  BackendAsset,
  CreateAssetPayload,
  SingleAssetResponse,
  AssignAssetPayload,
  TransferAssetPayload,
  ScheduleMaintenancePayload,
  ReturnAssetPayload,
  DisposeAssetPayload,
  AddAMCPayload,
  AssetHistoryEntry,
  AssetHistoryResponse,
  AssetHistoryRawData,
  AssignmentHistoryRaw,
  MaintenanceHistoryRaw,
  AssetDocument,
  AssetDocumentsResponse,
  SingleDocumentResponse,
  AssetAMC,
  AssetAMCResponse,
  SingleAMCResponse,
  AssetDisposal,
  AssetDisposalResponse,
  SingleDisposalResponse,
} from './asset-service.types';

// Re-export types for consumers
export type {
  AssetDropdowns,
  BackendAsset,
  CreateAssetPayload,
  AssetListParams,
  AssignAssetPayload,
  TransferAssetPayload,
  ScheduleMaintenancePayload,
  ReturnAssetPayload,
  DisposeAssetPayload,
  AddAMCPayload,
  AssetHistoryEntry,
  AssetDocument,
  AssetAMC,
  AssetDisposal,
};

export const FALLBACK_DROPDOWNS: AssetDropdowns = {
  asset_types: [{ id: 2, name: 'Laptop' }, { id: 1, name: 'Desktop' }],
  asset_categories: [{ id: 2, name: 'Electronics' }, { id: 1, name: 'Furniture' }],
  maintenance_shops: [{ id: 2, name: 'IT Support' }, { id: 1, name: 'General Maintenance' }],
  vendors: [{ id: 2, name: 'Dell' }, { id: 1, name: 'HP' }],
  service_types: [{ id: 2, name: 'Repair' }, { id: 1, name: 'Replacement' }],
  asset_status: [{ id: 2, name: 'Assigned' }, { id: 1, name: 'In Repair' }],
  disposal_choices: [
    { id: 'Sold', name: 'Sold' }, { id: 'Donated', name: 'Donated' },
    { id: 'Scrapped', name: 'Scrapped' }, { id: 'Recycled', name: 'Recycled' },
    { id: 'Other', name: 'Other' },
  ],
  asset_document_types: [{ id: 1, name: 'Warranty Certificate' }],
};

function mapAssignmentHistory(items: AssignmentHistoryRaw[]): AssetHistoryEntry[] {
  return items.map((item) => ({
    id: item.id,
    action: item.action ?? 'Assignment Change',
    date: item.created_at ?? item.date ?? '',
    performed_by: item.transferred_to_employee_name
      ? `Assigned to: ${item.transferred_to_employee_name}`
      : item.transferred_to_department_name
        ? `Transferred to: ${item.transferred_to_department_name}`
        : 'System Admin',
    remarks: item.remarks ?? '',
  }));
}

function mapMaintenanceHistory(items: MaintenanceHistoryRaw[]): AssetHistoryEntry[] {
  return items.map((item) => ({
    id: item.id,
    action: item.action ?? 'Maintenance Scheduled',
    date: item.created_at ?? item.date ?? '',
    performed_by: item.service_provider_name ?? (item.service_provider ? `Provider #${item.service_provider}` : 'IT Service'),
    remarks: item.remarks ?? (item.estimated_cost ? `Estimated Cost: AED ${item.estimated_cost}` : ''),
  }));
}

export const assetService = {
  async getAssetDropdowns(signal?: AbortSignal): Promise<AssetDropdowns> {
    try {
      const response = await api.get<AssetDropdownsResponse>('/api/asset/asset-dropdowns/', { signal });
      return response.results?.data ?? FALLBACK_DROPDOWNS;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching asset dropdowns. Loading fallback.', error);
      return FALLBACK_DROPDOWNS;
    }
  },

  async getAssets(params: AssetListParams, fallback: BackendAsset[], signal?: AbortSignal): Promise<{
    data: BackendAsset[];
    total_count: number;
    total_pages: number;
    current_page: number;
  }> {
    try {
      const response = await api.get<AssetListResponse>('/api/asset/assets/', { params: cleanParams(params), signal });
      return {
        data: response.results?.data ?? [],
        total_count: response.results?.total_count ?? 0,
        total_pages: response.results?.total_pages ?? 1,
        current_page: response.results?.current_page ?? 1,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      console.warn('🔴 Network error fetching assets. Loading fallback.', error);
      return { data: fallback, total_count: fallback.length, total_pages: 1, current_page: 1 };
    }
  },

  async getAssetById(id: number, signal?: AbortSignal): Promise<BackendAsset> {
    const response = await api.get<SingleAssetResponse>(`/api/asset/assets/${id}/`, { signal });
    return response.results.data;
  },

  async createAsset(payload: CreateAssetPayload): Promise<BackendAsset> {
    const response = await api.post<SingleAssetResponse>('/api/asset/assets/', payload as unknown as Record<string, unknown>);
    return response.results.data;
  },

  async updateAsset(payload: CreateAssetPayload & { id: number }): Promise<BackendAsset> {
    const response = await api.put<SingleAssetResponse>('/api/asset/assets/', payload as unknown as Record<string, unknown>);
    return response.results.data;
  },

  async deleteAsset(id: number): Promise<void> {
    await api.delete('/api/asset/assets/', { params: { id } });
  },

  async assignAsset(payload: AssignAssetPayload): Promise<void> {
    await api.post('/api/asset/assets/assign/', payload as unknown as Record<string, unknown>);
  },

  async transferAsset(payload: TransferAssetPayload): Promise<void> {
    await api.post('/api/asset/assets/transfer/', payload as unknown as Record<string, unknown>);
  },

  async scheduleMaintenance(payload: ScheduleMaintenancePayload): Promise<void> {
    await api.post('/api/asset/assets/schedule-maintenance/', payload as unknown as Record<string, unknown>);
  },

  async returnAsset(payload: ReturnAssetPayload): Promise<void> {
    await api.post('/api/asset/assets/return/', payload as unknown as Record<string, unknown>);
  },

  async getAssetHistory(assetId: number, signal?: AbortSignal): Promise<AssetHistoryEntry[]> {
    try {
      const response = await api.get<AssetHistoryResponse>('/api/asset/assets/history/', {
        params: { asset_id: assetId },
        signal,
      });
      const data = response.results?.data;
      if (!data) return [];

      if (Array.isArray(data)) {
        return data;
      }

      const rawData = data as AssetHistoryRawData;
      const assignHist = Array.isArray(rawData.assignment_history) ? rawData.assignment_history : [];
      const maintHist = Array.isArray(rawData.maintenance_history) ? rawData.maintenance_history : [];
      return [...mapAssignmentHistory(assignHist), ...mapMaintenanceHistory(maintHist)];
    } catch (error) {
      console.warn(`🔴 Network error fetching asset history for ${assetId}. returning fallback.`, error);
      return [];
    }
  },

  async getAssetDocuments(assetId: number, signal?: AbortSignal): Promise<AssetDocument[]> {
    try {
      const response = await api.get<AssetDocumentsResponse>('/api/asset/assets/documents/', {
        params: { asset_id: assetId }, signal,
      });
      return response.results?.data ?? [];
    } catch (error) {
      console.warn(`🔴 Network error fetching asset documents for ${assetId}. returning fallback.`, error);
      return [];
    }
  },

  async uploadAssetDocument(formData: FormData): Promise<AssetDocument> {
    const response = await api.post<SingleDocumentResponse>('/api/asset/assets/documents/', formData);
    return response.results.data;
  },

  async deleteAssetDocument(docId: number): Promise<void> {
    await api.delete('/api/asset/assets/documents/delete/', { params: { doc_id: docId } });
  },

  async getAssetAMC(assetId: number, signal?: AbortSignal): Promise<AssetAMC[]> {
    try {
      const response = await api.get<AssetAMCResponse>('/api/asset/assets/amc/', {
        params: { asset_id: assetId }, signal,
      });
      return response.results?.data ?? [];
    } catch (error) {
      console.warn(`🔴 Network error fetching asset AMC for ${assetId}. returning fallback.`, error);
      return [];
    }
  },

  async addAssetAMC(payload: AddAMCPayload): Promise<AssetAMC> {
    const response = await api.post<SingleAMCResponse>('/api/asset/assets/amc/', payload as unknown as Record<string, unknown>);
    return response.results.data;
  },

  async getAssetDisposal(assetId: number, signal?: AbortSignal): Promise<AssetDisposal | null> {
    try {
      const response = await api.get<AssetDisposalResponse>('/api/asset/assets/dispose/', {
        params: { asset_id: assetId }, signal,
      });
      const data = response.results?.data;
      if (Array.isArray(data)) {
        return data.length > 0 ? data[0] : null;
      }
      return data ?? null;
    } catch (error) {
      console.warn(`🔴 Network error fetching asset disposal for ${assetId}. returning fallback.`, error);
      return null;
    }
  },

  async disposeAsset(payload: DisposeAssetPayload): Promise<AssetDisposal> {
    const response = await api.post<SingleDisposalResponse>('/api/asset/assets/dispose/', payload as unknown as Record<string, unknown>);
    return response.results.data;
  },
};
