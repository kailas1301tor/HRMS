// components/assets/useAssetDetail.ts
'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { assetService, type BackendAsset, type AssetDropdowns } from '@/services/asset-service'
import { departmentService, type Department } from '@/services/department-service'
import { getAssetTypeConfig, getStatusConfig } from './assets-constants'

export interface UseAssetDetailReturn {
  asset: BackendAsset | null
  dropdowns: AssetDropdowns | null
  isLoading: boolean
  error: string | null
  isAssignOpen: boolean
  isTransferOpen: boolean
  isMaintenanceOpen: boolean
  isReturnOpen: boolean
  isDisposeOpen: boolean
  activeTab: string
  isPending: boolean
  typeConfig: ReturnType<typeof getAssetTypeConfig> | null
  statusConfig: ReturnType<typeof getStatusConfig> | null
  isDisposed: boolean
  isAssigned: boolean
  inRepair: boolean
  setIsAssignOpen: (open: boolean) => void
  setIsTransferOpen: (open: boolean) => void
  setIsMaintenanceOpen: (open: boolean) => void
  setIsReturnOpen: (open: boolean) => void
  setIsDisposeOpen: (open: boolean) => void
  setIsEditOpen: (open: boolean) => void
  setTab: (tabName: string) => void
  fetchAssetDetails: () => Promise<void>
  departments: Department[]
  isEditOpen: boolean
}

export function useAssetDetail(assetId: number): UseAssetDetailReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [asset, setAsset] = useState<BackendAsset | null>(null)
  const [dropdowns, setDropdowns] = useState<AssetDropdowns | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false)
  const [isReturnOpen, setIsReturnOpen] = useState(false)
  const [isDisposeOpen, setIsDisposeOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const activeTab = searchParams.get('tab') || 'overview'

  const fetchAssetDetails = async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const [assetData, dropdownData, deptData] = await Promise.all([
        assetService.getAssetById(assetId, signal),
        assetService.getAssetDropdowns(signal),
        departmentService.getDepartments()
      ])
      if (signal?.aborted) return
      setAsset(assetData)
      setDropdowns(dropdownData)
      setDepartments(deptData)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      console.error('Failed to load asset details:', err)
      setError(err instanceof Error ? err.message : 'Failed to load asset details')
      toast.error('Failed to fetch asset details')
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchAssetDetails(controller.signal)
    return () => {
      controller.abort()
    }
  }, [assetId])

  const setTab = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tabName)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const typeConfig = asset ? getAssetTypeConfig(asset.asset_type) : null
  const statusConfig = asset ? getStatusConfig(asset.status) : null

  // Helper flags
  const statusLower = asset?.status?.toLowerCase() || ''
  const isDisposed = statusLower.includes('dispose') || statusLower.includes('delete')
  const isAssigned = statusLower.includes('assign') || statusLower.includes('in use') || statusLower.includes('in-use')
  const inRepair = statusLower.includes('repair') || statusLower.includes('maintenance')

  return {
    asset,
    dropdowns,
    departments,
    isLoading,
    error,
    isAssignOpen,
    isTransferOpen,
    isMaintenanceOpen,
    isReturnOpen,
    isDisposeOpen,
    isEditOpen,
    activeTab,
    isPending,
    typeConfig,
    statusConfig,
    isDisposed,
    isAssigned,
    inRepair,
    setIsAssignOpen,
    setIsTransferOpen,
    setIsMaintenanceOpen,
    setIsReturnOpen,
    setIsDisposeOpen,
    setIsEditOpen,
    setTab,
    fetchAssetDetails,
  }
}
