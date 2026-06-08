// components/settings/useAssetTypesAndVendors.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { assetTypeService, type AssetType } from '@/services/asset-type-service'
import { vendorService, type FrontendVendor } from '@/services/vendor-service'
import { INITIAL_ASSET_TYPES_OBJECTS, INITIAL_VENDORS_OBJECTS } from './settings-constants'

export interface UseAssetTypesAndVendorsReturn {
  assetTypes: AssetType[]
  assetTypesLoading: boolean
  vendors: FrontendVendor[]
  vendorsLoading: boolean
  handleAssetTypeSave: (id: number | null, name: string) => Promise<void>
  handleAssetTypeDelete: (id: number) => Promise<void>
  loadVendors: () => Promise<void>
}

export function useAssetTypesAndVendors(): UseAssetTypesAndVendorsReturn {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([])
  const [assetTypesLoading, setAssetTypesLoading] = useState(true)
  const [vendors, setVendors] = useState<FrontendVendor[]>([])
  const [vendorsLoading, setVendorsLoading] = useState(true)

  const loadAssetTypes = useCallback(async (): Promise<void> => {
    setAssetTypesLoading(true)
    try {
      const data = await assetTypeService.getAssetTypes(INITIAL_ASSET_TYPES_OBJECTS)
      setAssetTypes(data)
    } catch {
      toast.error('Failed to load asset types')
    } finally {
      setAssetTypesLoading(false)
    }
  }, [])

  const loadVendors = useCallback(async (): Promise<void> => {
    setVendorsLoading(true)
    try {
      const data = await vendorService.getVendors(INITIAL_VENDORS_OBJECTS)
      setVendors(data)
    } catch {
      toast.error('Failed to load vendors')
    } finally {
      setVendorsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAssetTypes()
    loadVendors()
  }, [loadAssetTypes, loadVendors])

  const handleAssetTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await assetTypeService.updateAssetType(id, name)
      } else {
        await assetTypeService.createAssetType(name)
      }
      await loadAssetTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save asset type'
      toast.error(message)
    }
  }

  const handleAssetTypeDelete = async (id: number): Promise<void> => {
    try {
      await assetTypeService.deleteAssetType(id)
      await loadAssetTypes()
      await loadVendors()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete asset type'
      toast.error(message)
    }
  }

  return {
    assetTypes,
    assetTypesLoading,
    vendors,
    vendorsLoading,
    handleAssetTypeSave,
    handleAssetTypeDelete,
    loadVendors,
  }
}
