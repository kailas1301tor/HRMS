// components/settings/useServiceTypesAndStatuses.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { serviceTypeService, type ServiceType } from '@/services/service-type-service'
import { assetStatusService, type AssetStatus } from '@/services/asset-status-service'
import { INITIAL_SERVICE_TYPES_OBJECTS, INITIAL_STATUS_LABELS_OBJECTS } from './settings-constants'

export interface UseServiceTypesAndStatusesReturn {
  serviceTypes: ServiceType[]
  serviceTypesLoading: boolean
  assetStatuses: AssetStatus[]
  assetStatusesLoading: boolean
  handleServiceTypeSave: (id: number | null, name: string) => Promise<void>
  handleServiceTypeDelete: (id: number) => Promise<void>
  handleAssetStatusSave: (id: number | null, name: string) => Promise<void>
  handleAssetStatusDelete: (id: number) => Promise<void>
}

export function useServiceTypesAndStatuses(): UseServiceTypesAndStatusesReturn {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [serviceTypesLoading, setServiceTypesLoading] = useState(true)
  const [assetStatuses, setAssetStatuses] = useState<AssetStatus[]>([])
  const [assetStatusesLoading, setAssetStatusesLoading] = useState(true)

  const loadServiceTypes = useCallback(async (): Promise<void> => {
    setServiceTypesLoading(true)
    try {
      const data = await serviceTypeService.getServiceTypes(INITIAL_SERVICE_TYPES_OBJECTS)
      setServiceTypes(data)
    } catch {
      toast.error('Failed to load service types')
    } finally {
      setServiceTypesLoading(false)
    }
  }, [])

  const loadAssetStatuses = useCallback(async (): Promise<void> => {
    setAssetStatusesLoading(true)
    try {
      const data = await assetStatusService.getAssetStatuses(INITIAL_STATUS_LABELS_OBJECTS)
      setAssetStatuses(data)
    } catch {
      toast.error('Failed to load asset statuses')
    } finally {
      setAssetStatusesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadServiceTypes()
    loadAssetStatuses()
  }, [loadServiceTypes, loadAssetStatuses])

  const handleServiceTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await serviceTypeService.updateServiceType(id, name)
      } else {
        await serviceTypeService.createServiceType(name)
      }
      await loadServiceTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save service type'
      toast.error(message)
    }
  }

  const handleServiceTypeDelete = async (id: number): Promise<void> => {
    try {
      await serviceTypeService.deleteServiceType(id)
      await loadServiceTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete service type'
      toast.error(message)
    }
  }

  const handleAssetStatusSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await assetStatusService.updateAssetStatus(id, name)
      } else {
        await assetStatusService.createAssetStatus(name)
      }
      await loadAssetStatuses()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save status label'
      toast.error(message)
    }
  }

  const handleAssetStatusDelete = async (id: number): Promise<void> => {
    try {
      await assetStatusService.deleteAssetStatus(id)
      await loadAssetStatuses()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete status label'
      toast.error(message)
    }
  }

  return {
    serviceTypes,
    serviceTypesLoading,
    assetStatuses,
    assetStatusesLoading,
    handleServiceTypeSave,
    handleServiceTypeDelete,
    handleAssetStatusSave,
    handleAssetStatusDelete,
  }
}
