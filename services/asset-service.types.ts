// services/asset-service.types.ts

import type { DropdownItem, StringDropdownItem } from '@/lib/types';

export type { DropdownItem, StringDropdownItem };

export interface AssetDropdowns {
  asset_types: DropdownItem[];
  asset_categories: DropdownItem[];
  maintenance_shops: DropdownItem[];
  vendors: DropdownItem[];
  service_types: DropdownItem[];
  asset_status: DropdownItem[];
  disposal_choices: StringDropdownItem[];
  asset_document_types: DropdownItem[];
}

// Action Payloads
export interface AssignAssetPayload {
  asset_id: number;
  assign_to_employee: number;
  remarks?: string;
}

export interface TransferAssetPayload {
  asset_id: number;
  transfer_to_department: number;
  remarks?: string;
}

export interface ScheduleMaintenancePayload {
  asset_id: number;
  service_type: number;
  service_provider: number;
  estimated_cost: number;
}

export interface ReturnAssetPayload {
  asset_id: number;
  return_to_department: number;
  return_date: string;
  service_cost?: number;
}

export interface DisposeAssetPayload {
  asset: number;
  disposal_date: string;
  disposal_method: string;
  disposal_value: number;
}

export interface AddAMCPayload {
  asset: number;
  service_provider: number;
  contract_number: string;
  start_date: string;
  end_date: string;
  amc_cost: number;
  coverage_details: string;
}

// Response Data Types
export interface AssetHistoryEntry {
  id: number;
  action: string;
  date: string;
  performed_by: string;
  remarks?: string;
}

export interface AssetDocument {
  id: number;
  document_type: string;
  file_url: string;
  uploaded_at: string;
}

export interface AssetAMC {
  id: number;
  contract_number: string;
  service_provider: string;
  start_date: string;
  end_date: string;
  amc_cost: string;
  status: string;
  coverage_details: string;
}

export interface AssetDisposal {
  id: number;
  disposal_date: string;
  disposal_method: string;
  disposal_value: string;
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
  [key: string]: string | number | boolean | undefined | null;
}

// Raw history response shapes returned by the backend
export interface AssignmentHistoryRaw {
  id: number;
  action?: string;
  created_at?: string;
  date?: string;
  transferred_to_employee_name?: string;
  transferred_to_department_name?: string;
  remarks?: string;
}

export interface MaintenanceHistoryRaw {
  id: number;
  action?: string;
  created_at?: string;
  date?: string;
  service_provider_name?: string;
  service_provider?: number;
  estimated_cost?: string;
  remarks?: string;
}

export interface AssetHistoryRawData {
  assignment_history?: AssignmentHistoryRaw[];
  maintenance_history?: MaintenanceHistoryRaw[];
}

// API Response Envelopes
export interface AssetDropdownsResponse {
  message: string;
  results: {
    data: AssetDropdowns;
  };
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

export interface SingleAssetResponse {
  message: string;
  results: {
    data: BackendAsset;
  };
}

export interface AssetHistoryResponse {
  message: string;
  results: {
    data: AssetHistoryEntry[] | AssetHistoryRawData;
  };
}

export interface AssetDocumentsResponse {
  message: string;
  results: {
    data: AssetDocument[];
  };
}

export interface SingleDocumentResponse {
  message: string;
  results: {
    data: AssetDocument;
  };
}

export interface AssetAMCResponse {
  message: string;
  results: {
    data: AssetAMC[];
  };
}

export interface SingleAMCResponse {
  message: string;
  results: {
    data: AssetAMC;
  };
}

export interface AssetDisposalResponse {
  message: string;
  results: {
    data: AssetDisposal | AssetDisposal[];
  };
}

export interface SingleDisposalResponse {
  message: string;
  results: {
    data: AssetDisposal;
  };
}
