// components/assets/useAddAssetModal.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { assetSchema, type AssetInput } from '@/validations/asset.schema'
import { assetService, type AssetDropdowns, type BackendAsset } from '@/services/asset-service'
import type { Department } from '@/services/department-service'

export interface UseAddAssetModalReturn {
  isSubmitting: boolean
  form: UseFormReturn<AssetInput>
  onSubmit: (data: AssetInput) => Promise<void>
}

export function useAddAssetModal(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void,
  editAsset: BackendAsset | null | undefined,
  dropdowns: AssetDropdowns | null,
  departments: Department[]
): UseAddAssetModalReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AssetInput>({
    resolver: zodResolver(assetSchema),
    mode: 'onBlur',
  })

  const { reset } = form

  useEffect(() => {
    if (open) {
      if (editAsset) {
        // Find matching IDs from dynamic names to populate select dropdowns
        const typeId = dropdowns?.asset_types.find(t => t.name === editAsset.asset_type)?.id || undefined
        const categoryId = dropdowns?.asset_categories.find(c => c.name === editAsset.asset_category)?.id || undefined
        const deptId = departments.find(d => d.name.toUpperCase() === editAsset.department?.toUpperCase())?.id || undefined
        const statusId = dropdowns?.asset_status.find(s => s.name === editAsset.status)?.id || undefined

        reset({
          id: editAsset.id,
          name: editAsset.name,
          serial_number: editAsset.serial_number || '',
          asset_type: typeId,
          asset_category: categoryId,
          department: deptId,
          location: editAsset.location || '',
          sub_location: editAsset.sub_location || '',
          purchase_cost: editAsset.purchase_cost || '',
          purchase_date: editAsset.purchase_date || '',
          warranty_period: editAsset.warranty_period ? String(editAsset.warranty_period) : '',
          service_due_date: editAsset.service_due_date || '',
          status: statusId,
        })
      } else {
        reset({
          name: '',
          serial_number: '',
          asset_type: undefined,
          asset_category: undefined,
          department: undefined,
          location: '',
          sub_location: '',
          purchase_cost: '',
          purchase_date: '',
          warranty_period: '',
          service_due_date: '',
          status: undefined,
        })
      }
    }
  }, [open, editAsset, dropdowns, departments, reset])

  const onSubmit = async (data: AssetInput) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: data.name,
        serial_number: data.serial_number || null,
        asset_type: data.asset_type || null,
        asset_category: data.asset_category || null,
        department: data.department || null,
        location: data.location || null,
        sub_location: data.sub_location || null,
        purchase_cost: data.purchase_cost ? parseFloat(data.purchase_cost) : null,
        purchase_date: data.purchase_date || null,
        warranty_period: data.warranty_period ? parseInt(data.warranty_period, 10) : null,
        service_due_date: data.service_due_date || null,
        status: data.status || null,
      }

      if (editAsset) {
        await assetService.updateAsset({ ...payload, id: editAsset.id })
        toast.success('Asset updated successfully')
      } else {
        await assetService.createAsset(payload)
        toast.success('Asset added successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during submission'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    form,
    onSubmit,
  }
}
