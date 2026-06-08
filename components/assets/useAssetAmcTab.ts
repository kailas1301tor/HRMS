// components/assets/useAssetAmcTab.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assetService, type AssetAMC, type AssetDropdowns } from '@/services/asset-service'
import { addAMCSchema, type AddAMCInput } from '@/validations/asset-actions.schema'
import { toast } from 'sonner'

export interface UseAssetAmcTabReturn {
  amcs: AssetAMC[]
  isLoading: boolean
  isAddOpen: boolean
  isSubmitting: boolean
  providers: Array<{ id: number; name: string }>
  form: UseFormReturn<AddAMCInput>
  setIsAddOpen: (open: boolean) => void
  fetchAMCs: () => Promise<void>
  onSubmit: (data: AddAMCInput) => Promise<void>
  getStatusBadge: (statusStr?: string) => string
  formatDate: (dateStr: string) => string
}

export function useAssetAmcTab(
  assetId: number,
  dropdowns: AssetDropdowns | null
): UseAssetAmcTabReturn {
  const [amcs, setAmcs] = useState<AssetAMC[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const providers = dropdowns?.maintenance_shops || []

  const form = useForm<AddAMCInput>({
    resolver: zodResolver(addAMCSchema),
    defaultValues: {
      contract_number: '',
      amc_cost: 0,
      coverage_details: ''
    }
  })

  const { reset } = form

  const fetchAMCs = async (signal?: AbortSignal) => {
    setIsLoading(true)
    try {
      const data = await assetService.getAssetAMC(assetId, signal)
      if (signal?.aborted) return
      setAmcs(data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      console.error('Failed to load asset AMC records:', err)
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchAMCs(controller.signal)
    return () => {
      controller.abort()
    }
  }, [assetId])

  const onSubmit = async (data: AddAMCInput) => {
    setIsSubmitting(true)
    try {
      await assetService.addAssetAMC({
        asset: assetId,
        service_provider: data.service_provider,
        contract_number: data.contract_number,
        start_date: data.start_date,
        end_date: data.end_date,
        amc_cost: data.amc_cost,
        coverage_details: data.coverage_details
      })
      toast.success('AMC contract added successfully')
      setIsAddOpen(false)
      reset()
      fetchAMCs()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add AMC contract'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (statusStr: string = '') => {
    const s = statusStr.toLowerCase()
    if (s.includes('active') || s.includes('live')) {
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    }
    if (s.includes('expired') || s.includes('done')) {
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    }
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return {
    amcs,
    isLoading,
    isAddOpen,
    isSubmitting,
    providers,
    form,
    setIsAddOpen,
    fetchAMCs,
    onSubmit,
    getStatusBadge,
    formatDate,
  }
}
