// components/settings/asset-masters.tsx
'use client'

import { GenericMasterCard } from './hr-masters/generic-master-card'
import { VendorsMaster } from './vendors-master'
import { useAssetTypesAndVendors } from './useAssetTypesAndVendors'
import { useAssetCategoriesAndShops } from './useAssetCategoriesAndShops'
import { useServiceTypesAndStatuses } from './useServiceTypesAndStatuses'

export function AssetMasters() {
  const {
    assetTypes,
    assetTypesLoading,
    vendors,
    vendorsLoading,
    handleAssetTypeSave,
    handleAssetTypeDelete,
    loadVendors,
  } = useAssetTypesAndVendors()

  const {
    assetCategories,
    assetCategoriesLoading,
    maintenanceShops,
    maintenanceShopsLoading,
    handleAssetCategorySave,
    handleAssetCategoryDelete,
    handleMaintenanceShopSave,
    handleMaintenanceShopDelete,
  } = useAssetCategoriesAndShops()

  const {
    serviceTypes,
    serviceTypesLoading,
    assetStatuses,
    assetStatusesLoading,
    handleServiceTypeSave,
    handleServiceTypeDelete,
    handleAssetStatusSave,
    handleAssetStatusDelete,
  } = useServiceTypesAndStatuses()

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
