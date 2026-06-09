// lib/env.ts
/** Stage default — used only when NEXT_PUBLIC_API_URL is unset in local development. */
const STAGE_API_BASE_URL = 'https://roka-stage-backend.hroptim.com'

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '')
}

function resolveApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL

  if (configured && configured.trim() !== '') {
    return normalizeBaseUrl(configured)
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_API_URL is required in production. Set it in your deployment environment before building.'
    )
  }

  if (typeof window !== 'undefined') {
    console.warn(
      '[env] NEXT_PUBLIC_API_URL is not set. Using stage backend for local development:',
      STAGE_API_BASE_URL
    )
  }

  return STAGE_API_BASE_URL
}

/** Single source of truth for the backend API origin (no trailing slash). */
export const API_BASE_URL = resolveApiBaseUrl()

/** Build a full API URL from a path or endpoint segment. */
export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
