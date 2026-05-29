// components/settings/asset-masters.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { GenericMasterCard, type MasterItem } from './hr-masters/generic-master-card'
import { VendorsMaster } from './VendorsMaster'
import { assetTypeService, type AssetType } from '@/services/asset-type-service'
import { assetCategoryService, type AssetCategory } from '@/services/asset-category-service'
import { maintenanceShopService, type MaintenanceShop } from '@/services/maintenance-shop-service'
import { serviceTypeService, type ServiceType } from '@/services/service-type-service'
import { assetStatusService, type AssetStatus } from '@/services/asset-status-service'
import { vendorService, type FrontendVendor } from '@/services/vendor-service'
import {
  INITIAL_ASSET_TYPES_OBJECTS,
  INITIAL_ASSET_CATEGORIES_OBJECTS,
  INITIAL_MAINTENANCE_SHOPS_OBJECTS,
  INITIAL_STATUS_LABELS_OBJECTS,
  INITIAL_SERVICE_TYPES_OBJECTS,
  INITIAL_VENDORS_OBJECTS,
} from './settings-constants'

export function AssetMasters() {
  // --- States ---
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([])
  const [assetTypesLoading, setAssetTypesLoading] = useState(true)

  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([])
  const [assetCategoriesLoading, setAssetCategoriesLoading] = useState(true)

  const [maintenanceShops, setMaintenanceShops] = useState<MaintenanceShop[]>([])
  const [maintenanceShopsLoading, setMaintenanceShopsLoading] = useState(true)

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [serviceTypesLoading, setServiceTypesLoading] = useState(true)

  const [assetStatuses, setAssetStatuses] = useState<AssetStatus[]>([])
  const [assetStatusesLoading, setAssetStatusesLoading] = useState(true)

  const [vendors, setVendors] = useState<FrontendVendor[]>([])
  const [vendorsLoading, setVendorsLoading] = useState(true)

  // --- Loaders ---
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
    loadAssetCategories()
    loadMaintenanceShops()
    loadServiceTypes()
    loadAssetStatuses()
    loadVendors()
  }, [
    loadAssetTypes,
    loadAssetCategories,
    loadMaintenanceShops,
    loadServiceTypes,
    loadAssetStatuses,
    loadVendors,
  ])

  // --- CRUD Handlers ---

  // Asset Types
  const handleAssetTypeSave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await assetTypeService.updateAssetType(id, name)
    } else {
      await assetTypeService.createAssetType(name)
    }
    await loadAssetTypes()
  }

  const handleAssetTypeDelete = async (id: number): Promise<void> => {
    await assetTypeService.deleteAssetType(id)
    await loadAssetTypes()
    // Refresh vendors in case their referenced asset type changed or was affected
    await loadVendors()
  }

  // Asset Categories
  const handleAssetCategorySave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await assetCategoryService.updateAssetCategory(id, name)
    } else {
      await assetCategoryService.createAssetCategory(name)
    }
    await loadAssetCategories()
  }

  const handleAssetCategoryDelete = async (id: number): Promise<void> => {
    await assetCategoryService.deleteAssetCategory(id)
    await loadAssetCategories()
  }

  // Maintenance Shops
  const handleMaintenanceShopSave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await maintenanceShopService.updateMaintenanceShop(id, name)
    } else {
      await maintenanceShopService.createMaintenanceShop(name)
    }
    await loadMaintenanceShops()
  }

  const handleMaintenanceShopDelete = async (id: number): Promise<void> => {
    await maintenanceShopService.deleteMaintenanceShop(id)
    await loadMaintenanceShops()
  }

  // Service Types
  const handleServiceTypeSave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await serviceTypeService.updateServiceType(id, name)
    } else {
      await serviceTypeService.createServiceType(name)
    }
    await loadServiceTypes()
  }

  const handleServiceTypeDelete = async (id: number): Promise<void> => {
    await serviceTypeService.deleteServiceType(id)
    await loadServiceTypes()
  }

  // Status Labels / Asset Statuses
  const handleAssetStatusSave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await assetStatusService.updateAssetStatus(id, name)
    } else {
      await assetStatusService.createAssetStatus(name)
    }
    await loadAssetStatuses()
  }

  const handleAssetStatusDelete = async (id: number): Promise<void> => {
    await assetStatusService.deleteAssetStatus(id)
    await loadAssetStatuses()
  }

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">Asset Management Masters</h2>
        <p className="text-xs text-slate-400 mt-1">Define asset types, categories, and maintenance providers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GenericMasterCard
          title="Asset Types"
          items={assetTypes}
          isLoading={assetTypesLoading}
          onSave={handleAssetTypeSave}
          onDelete={handleAssetTypeDelete}
          placeholder="e.g. LAPTOP"
          label="Asset Type"
        />

        <GenericMasterCard
          title="Asset Categories"
          items={assetCategories}
          isLoading={assetCategoriesLoading}
          onSave={handleAssetCategorySave}
          onDelete={handleAssetCategoryDelete}
          placeholder="e.g. IT EQUIPMENT"
          label="Asset Category"
        />

        <GenericMasterCard
          title="Maintenance Shops"
          items={maintenanceShops}
          isLoading={maintenanceShopsLoading}
          onSave={handleMaintenanceShopSave}
          onDelete={handleMaintenanceShopDelete}
          placeholder="e.g. LAPTOP REPAIR"
          label="Maintenance Shop"
        />

        <VendorsMaster
          vendors={vendors}
          assetTypes={assetTypes}
          isLoading={vendorsLoading}
          onRefresh={loadVendors}
        />

        <GenericMasterCard
          title="Service Types"
          items={serviceTypes}
          isLoading={serviceTypesLoading}
          onSave={handleServiceTypeSave}
          onDelete={handleServiceTypeDelete}
          placeholder="e.g. REPAIR"
          label="Service Type"
        />

        <GenericMasterCard
          title="Status Labels"
          items={assetStatuses}
          isLoading={assetStatusesLoading}
          onSave={handleAssetStatusSave}
          onDelete={handleAssetStatusDelete}
          placeholder="e.g. AVAILABLE"
          label="Status Label"
        />
      </div>
    </div>
  )
}
