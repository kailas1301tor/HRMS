// services/branch-service.ts
import { api } from '@/lib/api';

export interface Branch {
  id: number;
  name: string;
  address: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BranchListResponse {
  message: string;
  results: {
    data: Branch[];
  };
}

export interface SingleBranchResponse {
  message: string;
  results: {
    data: Branch;
  };
}

export const FALLBACK_BRANCHES: Branch[] = [
  { id: 1, name: 'GOLD CENTER', address: 'Gold Center Building, Floor 3' },
  { id: 2, name: 'HEAD OFFICE', address: 'Main Street, Downtown' },
];

export const branchService = {
  /**
   * Fetch all branches. Falls back to mock data on error.
   */
  async getBranches(): Promise<Branch[]> {
    try {
      const response = await api.get<BranchListResponse>('/api/master/branches/');
      return response.results?.data ?? FALLBACK_BRANCHES;
    } catch (error) {
      console.warn('🔴 Network error fetching branches. Loading mock fallback.', error);
      return FALLBACK_BRANCHES;
    }
  },

  /**
   * Create a new branch.
   */
  async createBranch(name: string, address: string): Promise<Branch> {
    const response = await api.post<SingleBranchResponse>('/api/master/branches/', {
      name,
      address,
    });
    return response.results.data;
  },

  /**
   * Update an existing branch.
   */
  async updateBranch(id: number, name: string, address: string): Promise<Branch> {
    const response = await api.put<SingleBranchResponse>('/api/master/branches/', {
      id,
      name,
      address,
    });
    return response.results.data;
  },

  /**
   * Delete a branch.
   */
  async deleteBranch(id: number): Promise<void> {
    await api.delete('/api/master/branches/', { params: { id } });
  },
};
