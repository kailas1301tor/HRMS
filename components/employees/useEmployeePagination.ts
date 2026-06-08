// components/employees/useEmployeePagination.ts
'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

type SortField = 'full_name' | 'department' | 'designation' | 'joined_date' | 'status'
type SortOrder = 'asc' | 'desc'

export interface UseEmployeePaginationReturn {
  searchQuery: string
  departmentFilter: string
  statusFilter: string
  pageParam: number
  sortField: SortField
  sortOrder: SortOrder
  activeTab: string
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  setPagination: React.Dispatch<React.SetStateAction<{ totalCount: number; totalPages: number; currentPage: number }>>
  updateQueryParams: (updates: Record<string, string | null>) => void
}

export function useEmployeePagination(): UseEmployeePaginationReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 })

  const searchQuery = searchParams.get('search') || ''
  const departmentFilter = searchParams.get('department') || ''
  const statusFilter = searchParams.get('status') || ''
  const pageParam = Number(searchParams.get('page')) || 1
  const sortField = (searchParams.get('sortField') as SortField) || 'full_name'
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc'
  const activeTab = searchParams.get('tab') || 'all'

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    })
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  return {
    searchQuery,
    departmentFilter,
    statusFilter,
    pageParam,
    sortField,
    sortOrder,
    activeTab,
    pagination,
    setPagination,
    updateQueryParams,
  }
}
