// components/settings/useHrNationalities.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { nationalityService } from '@/services/nationality-service'
import { type MasterItem } from './hr-masters/generic-master-card'

export interface UseHrNationalitiesReturn {
  nationalities: MasterItem[]
  nationalitiesLoading: boolean
  handleNationalitySave: (id: number | null, name: string) => Promise<void>
  handleNationalityDelete: (id: number) => Promise<void>
}

export function useHrNationalities(): UseHrNationalitiesReturn {
  const [nationalities, setNationalities] = useState<MasterItem[]>([])
  const [nationalitiesLoading, setNationalitiesLoading] = useState(true)

  const loadNationalities = useCallback(async (): Promise<void> => {
    setNationalitiesLoading(true)
    try {
      const data = await nationalityService.getNationalities()
      setNationalities(data.map((n) => ({ id: n.id, name: n.name })))
    } catch {
      toast.error('Failed to load nationalities')
    } finally {
      setNationalitiesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNationalities()
  }, [loadNationalities])

  const handleNationalitySave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await nationalityService.updateNationality(id, name)
      } else {
        await nationalityService.createNationality(name)
      }
      await loadNationalities()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save nationality'
      toast.error(message)
    }
  }

  const handleNationalityDelete = async (id: number): Promise<void> => {
    try {
      await nationalityService.deleteNationality(id)
      await loadNationalities()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete nationality'
      toast.error(message)
    }
  }

  return {
    nationalities,
    nationalitiesLoading,
    handleNationalitySave,
    handleNationalityDelete,
  }
}
