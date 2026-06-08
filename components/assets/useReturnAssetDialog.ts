// components/assets/useReturnAssetDialog.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { returnAssetSchema, type ReturnAssetInput } from '@/validations/asset-actions.schema'
import { assetService } from '@/services/asset-service'
import { departmentService, type Department } from '@/services/department-service'
import { toast } from 'sonner'

export interface UseReturnAssetDialogReturn {
  departments: Department[]
  isLoadingDepts: boolean
  isSubmitting: boolean
  form: UseFormReturn<ReturnAssetInput>
  onSubmit: (data: ReturnAssetInput) => Promise<void>
}

export function useReturnAssetDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  assetId: number,
  onSuccess: () => void
): UseReturnAssetDialogReturn {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoadingDepts, setIsLoadingDepts] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReturnAssetInput>({
    resolver: zodResolver(returnAssetSchema),
    defaultValues: {
      return_date: new Date().toISOString().split('T')[0],
      service_cost: 0
    }
  })

  const { reset } = form

  useEffect(() => {
    async function loadDepts() {
      if (!open) return
      setIsLoadingDepts(true)
      try {
        const data = await departmentService.getDepartments()
        setDepartments(data)
      } catch (err) {
        console.error('Failed to load departments list:', err)
        toast.error('Failed to load departments')
      } finally {
        setIsLoadingDepts(false)
      }
    }
    loadDepts()
  }, [open])

  const onSubmit = async (data: ReturnAssetInput) => {
    setIsSubmitting(true)
    try {
      await assetService.returnAsset({
        asset_id: assetId,
        return_to_department: data.return_to_department,
        return_date: data.return_date,
        service_cost: data.service_cost
      })
      toast.success('Asset returned successfully')
      onOpenChange(false)
      reset()
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to return asset'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    departments,
    isLoadingDepts,
    isSubmitting,
    form,
    onSubmit,
  }
}
