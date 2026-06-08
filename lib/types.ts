// lib/types.ts

/**
 * Shared type definitions used across multiple service modules.
 * Centralised here to eliminate duplication and ensure consistency.
 */

/** Standard dropdown option used by master lookups. */
export interface DropdownItem {
  id: number;
  name: string;
}

/** Dropdown item where the ID is a string identifier (e.g. disposal methods). */
export interface StringDropdownItem {
  id: string;
  name: string;
}

/** Generic wrapper for paginated API list responses. */
export interface PaginatedResults<T> {
  total_count: number;
  total_pages: number;
  current_page: number;
  item_per_page: number;
  data: T[];
}

/** Standard envelope for API list endpoints. */
export interface ApiListResponse<T> {
  message: string;
  results: PaginatedResults<T>;
}

/** Standard envelope for single-item API responses. */
export interface ApiSingleResponse<T> {
  message: string;
  results: {
    data: T;
  };
}

/** Standard envelope for simple list API responses (no pagination). */
export interface ApiSimpleListResponse<T> {
  message: string;
  results: {
    data: T[];
  };
}

/**
 * Strips undefined/null/empty string values from a params object.
 * Used by every service that forwards query params to the API client.
 */
export function cleanParams(
  params: Record<string, string | number | boolean | undefined | null>
): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      cleaned[key] = val;
    }
  }
  return cleaned;
}
