// components/assets/add-asset-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { assetSchema, type AssetInput } from '@/validations/asset.schema'
import { assetService, type AssetDropdowns, type BackendAsset } from '@/services/asset-service'
import type { Department } from '@/services/department-service'

interface AddAssetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editAsset?: BackendAsset | null
  dropdowns: AssetDropdowns | null
  departments: Department[]
}

export function AddAssetModal({
  open,
  onOpenChange,
  onSuccess,
  editAsset,
  dropdowns,
  departments,
}: AddAssetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssetInput>({
    resolver: zodResolver(assetSchema),
    mode: 'onBlur',
  })

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
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border/80 rounded-2xl max-w-2xl overflow-y-auto max-h-[90vh] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg">
            {editAsset ? 'Edit Asset' : 'Add New Asset'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Asset Name *</Label>
              <Input
                placeholder="e.g. MacBook Pro 16"
                {...register('name')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Serial Number</Label>
              <Input
                placeholder="e.g. C02X1234ABCD"
                {...register('serial_number')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
              {errors.serial_number && <p className="text-[11px] text-destructive">{errors.serial_number.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Asset Type *</Label>
              <Controller
                name="asset_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-midnight border-border">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdowns?.asset_types.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.asset_type && <p className="text-[11px] text-destructive">{errors.asset_type.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Asset Category *</Label>
              <Controller
                name="asset_category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-midnight border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdowns?.asset_categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.asset_category && <p className="text-[11px] text-destructive">{errors.asset_category.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Department *</Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-midnight border-border">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.department && <p className="text-[11px] text-destructive">{errors.department.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Status *</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-midnight border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdowns?.asset_status.map((status) => (
                        <SelectItem key={status.id} value={String(status.id)}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-[11px] text-destructive">{errors.status.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Location</Label>
              <Input
                placeholder="e.g. HQ - Floor 3"
                {...register('location')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Sub Location</Label>
              <Input
                placeholder="e.g. Desk 4"
                {...register('sub_location')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Purchase Cost (AED)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 5000.00"
                {...register('purchase_cost')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Purchase Date</Label>
              <Input
                type="date"
                {...register('purchase_date')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Warranty Period (Months)</Label>
              <Input
                type="number"
                placeholder="e.g. 12"
                {...register('warranty_period')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Service Due Date</Label>
              <Input
                type="date"
                {...register('service_due_date')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border/40 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-core hover:bg-violet-deep text-white"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editAsset ? 'Save Changes' : 'Add Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
