// components/settings/useAssetCategoriesAndShops.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { assetCategoryService, type AssetCategory } from '@/services/asset-category-service'
import { maintenanceShopService, type MaintenanceShop } from '@/services/maintenance-shop-service'
import { INITIAL_ASSET_CATEGORIES_OBJECTS, INITIAL_MAINTENANCE_SHOPS_OBJECTS } from './settings-constants'

export interface UseAssetCategoriesAndShopsReturn {
  assetCategories: AssetCategory[]
  assetCategoriesLoading: boolean
  maintenanceShops: MaintenanceShop[]
  maintenanceShopsLoading: boolean
  handleAssetCategorySave: (id: number | null, name: string) => Promise<void>
  handleAssetCategoryDelete: (id: number) => Promise<void>
  handleMaintenanceShopSave: (id: number | null, name: string) => Promise<void>
  handleMaintenanceShopDelete: (id: number) => Promise<void>
}

export function useAssetCategoriesAndShops(): UseAssetCategoriesAndShopsReturn {
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([])
  const [assetCategoriesLoading, setAssetCategoriesLoading] = useState(true)
  const [maintenanceShops, setMaintenanceShops] = useState<MaintenanceShop[]>([])
  const [maintenanceShopsLoading, setMaintenanceShopsLoading] = useState(true)

  const loadAssetCategories = useCallback(async (): Promise<void> => {
    setAssetCategoriesLoading(true)
    try {
      const data = await assetCategoryService.getAssetCategories(INITIAL_ASSET_CATEGORIES_OBJECTS)
      setAssetCategories(data)
    } catch {
      toast.error('Failed to load asset categories')
    } finally {
      setAssetCategoriesLoading(false)
    }
  }, [])

  const loadMaintenanceShops = useCallback(async (): Promise<void> => {
    setMaintenanceShopsLoading(true)
    try {
      const data = await maintenanceShopService.getMaintenanceShops(INITIAL_MAINTENANCE_SHOPS_OBJECTS)
      setMaintenanceShops(data)
    } catch {
      toast.error('Failed to load maintenance shops')
    } finally {
      setMaintenanceShopsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAssetCategories()
    loadMaintenanceShops()
  }, [loadAssetCategories, loadMaintenanceShops])

  const handleAssetCategorySave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await assetCategoryService.updateAssetCategory(id, name)
      } else {
        await assetCategoryService.createAssetCategory(name)
      }
      await loadAssetCategories()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save asset category'
      toast.error(message)
    }
  }

  const handleAssetCategoryDelete = async (id: number): Promise<void> => {
    try {
      await assetCategoryService.deleteAssetCategory(id)
      await loadAssetCategories()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete asset category'
      toast.error(message)
    }
  }

  const handleMaintenanceShopSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await maintenanceShopService.updateMaintenanceShop(id, name)
      } else {
        await maintenanceShopService.createMaintenanceShop(name)
      }
      await loadMaintenanceShops()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save maintenance shop'
      toast.error(message)
    }
  }

  const handleMaintenanceShopDelete = async (id: number): Promise<void> => {
    try {
      await maintenanceShopService.deleteMaintenanceShop(id)
      await loadMaintenanceShops()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete maintenance shop'
      toast.error(message)
    }
  }

  return {
    assetCategories,
    assetCategoriesLoading,
    maintenanceShops,
    maintenanceShopsLoading,
    handleAssetCategorySave,
    handleAssetCategoryDelete,
    handleMaintenanceShopSave,
    handleMaintenanceShopDelete,
  }
}
