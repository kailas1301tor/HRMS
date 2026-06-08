// components/settings/useHrOnboardingOffboarding.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { onboardingOffboardingService } from '@/services/onboarding-offboarding-service'
import { type MasterItem } from './hr-masters/generic-master-card'

export interface UseHrOnboardingOffboardingReturn {
  onboardingDocTypes: MasterItem[]
  onboardingDocTypesLoading: boolean
  offboardingDocTypes: MasterItem[]
  offboardingDocTypesLoading: boolean
  handleOnboardingDocTypeSave: (id: number | null, name: string) => Promise<void>
  handleOnboardingDocTypeDelete: (id: number) => Promise<void>
  handleOffboardingDocTypeSave: (id: number | null, name: string) => Promise<void>
  handleOffboardingDocTypeDelete: (id: number) => Promise<void>
}

export function useHrOnboardingOffboarding(): UseHrOnboardingOffboardingReturn {
  const [onboardingDocTypes, setOnboardingDocTypes] = useState<MasterItem[]>([])
  const [onboardingDocTypesLoading, setOnboardingDocTypesLoading] = useState(true)
  const [offboardingDocTypes, setOffboardingDocTypes] = useState<MasterItem[]>([])
  const [offboardingDocTypesLoading, setOffboardingDocTypesLoading] = useState(true)

  const loadOnboardingDocTypes = useCallback(async (): Promise<void> => {
    setOnboardingDocTypesLoading(true)
    try {
      const data = await onboardingOffboardingService.getOnboardingDocTypes()
      setOnboardingDocTypes(data.map((item) => ({ id: item.id, name: item.name })))
    } catch {
      toast.error('Failed to load onboarding document types')
    } finally {
      setOnboardingDocTypesLoading(false)
    }
  }, [])

  const loadOffboardingDocTypes = useCallback(async (): Promise<void> => {
    setOffboardingDocTypesLoading(true)
    try {
      const data = await onboardingOffboardingService.getOffboardingDocTypes()
      setOffboardingDocTypes(data.map((item) => ({ id: item.id, name: item.name })))
    } catch {
      toast.error('Failed to load offboarding document types')
    } finally {
      setOffboardingDocTypesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOnboardingDocTypes()
    loadOffboardingDocTypes()
  }, [loadOnboardingDocTypes, loadOffboardingDocTypes])

  const handleOnboardingDocTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await onboardingOffboardingService.updateOnboardingDocType(id, name)
        toast.success('Onboarding document type updated successfully')
      } else {
        await onboardingOffboardingService.createOnboardingDocType(name)
        toast.success('Onboarding document type created successfully')
      }
      await loadOnboardingDocTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save onboarding document type'
      toast.error(message)
    }
  }

  const handleOnboardingDocTypeDelete = async (id: number): Promise<void> => {
    try {
      await onboardingOffboardingService.deleteOnboardingDocType(id)
      toast.success('Onboarding document type deleted successfully')
      await loadOnboardingDocTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete onboarding document type'
      toast.error(message)
    }
  }

  const handleOffboardingDocTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await onboardingOffboardingService.updateOffboardingDocType(id, name)
        toast.success('Offboarding document type updated successfully')
      } else {
        await onboardingOffboardingService.createOffboardingDocType(name)
        toast.success('Offboarding document type created successfully')
      }
      await loadOffboardingDocTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save offboarding document type'
      toast.error(message)
    }
  }

  const handleOffboardingDocTypeDelete = async (id: number): Promise<void> => {
    try {
      await onboardingOffboardingService.deleteOffboardingDocType(id)
      toast.success('Offboarding document type deleted successfully')
      await loadOffboardingDocTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete offboarding document type'
      toast.error(message)
    }
  }

  return {
    onboardingDocTypes,
    onboardingDocTypesLoading,
    offboardingDocTypes,
    offboardingDocTypesLoading,
    handleOnboardingDocTypeSave,
    handleOnboardingDocTypeDelete,
    handleOffboardingDocTypeSave,
    handleOffboardingDocTypeDelete,
  }
}
