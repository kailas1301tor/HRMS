// components/settings/useHrShiftsAndTypes.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { shiftService, type FrontendShift } from '@/services/shift-service'
import { employeeTypeService } from '@/services/employee-type-service'
import { type MasterItem } from './hr-masters/generic-master-card'

export interface UseHrShiftsAndTypesReturn {
  shifts: FrontendShift[]
  shiftsLoading: boolean
  employeeTypes: MasterItem[]
  employeeTypesLoading: boolean
  loadShifts: () => Promise<void>
  handleEmployeeTypeSave: (id: number | null, name: string) => Promise<void>
  handleEmployeeTypeDelete: (id: number) => Promise<void>
}

export function useHrShiftsAndTypes(): UseHrShiftsAndTypesReturn {
  const [shifts, setShifts] = useState<FrontendShift[]>([])
  const [shiftsLoading, setShiftsLoading] = useState(true)
  const [employeeTypes, setEmployeeTypes] = useState<MasterItem[]>([])
  const [employeeTypesLoading, setEmployeeTypesLoading] = useState(true)

  const loadShifts = useCallback(async (): Promise<void> => {
    setShiftsLoading(true)
    try {
      const data = await shiftService.getShifts()
      setShifts(data)
    } catch {
      toast.error('Failed to load shifts')
    } finally {
      setShiftsLoading(false)
    }
  }, [])

  const loadEmployeeTypes = useCallback(async (): Promise<void> => {
    setEmployeeTypesLoading(true)
    try {
      const data = await employeeTypeService.getEmployeeTypes()
      setEmployeeTypes(data.map((et) => ({ id: et.id, name: et.name })))
    } catch {
      toast.error('Failed to load employee types')
    } finally {
      setEmployeeTypesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadShifts()
    loadEmployeeTypes()
  }, [loadShifts, loadEmployeeTypes])

  const handleEmployeeTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await employeeTypeService.updateEmployeeType(id, name)
      } else {
        await employeeTypeService.createEmployeeType(name)
      }
      await loadEmployeeTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save employee type'
      toast.error(message)
    }
  }

  const handleEmployeeTypeDelete = async (id: number): Promise<void> => {
    try {
      await employeeTypeService.deleteEmployeeType(id)
      await loadEmployeeTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete employee type'
      toast.error(message)
    }
  }

  return {
    shifts,
    shiftsLoading,
    employeeTypes,
    employeeTypesLoading,
    loadShifts,
    handleEmployeeTypeSave,
    handleEmployeeTypeDelete,
  }
}
