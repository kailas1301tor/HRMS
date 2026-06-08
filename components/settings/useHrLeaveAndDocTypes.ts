// components/settings/useHrLeaveAndDocTypes.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { leaveTypeService } from '@/services/leave-type-service'
import { employeeDocumentTypeService } from '@/services/employee-document-type-service'
import { companyDocumentTypeService } from '@/services/company-document-type-service'
import { type MasterItem } from './hr-masters/generic-master-card'

export interface UseLeaveAndDocTypesReturn {
  leaveTypes: MasterItem[]
  leaveTypesLoading: boolean
  employeeDocTypes: MasterItem[]
  employeeDocTypesLoading: boolean
  companyDocTypes: MasterItem[]
  companyDocTypesLoading: boolean
  handleLeaveTypeSave: (id: number | null, name: string) => Promise<void>
  handleLeaveTypeDelete: (id: number) => Promise<void>
  handleEmployeeDocTypeSave: (id: number | null, name: string) => Promise<void>
  handleEmployeeDocTypeDelete: (id: number) => Promise<void>
  handleCompanyDocTypeSave: (id: number | null, name: string) => Promise<void>
  handleCompanyDocTypeDelete: (id: number) => Promise<void>
}

export function useHrLeaveAndDocTypes(): UseLeaveAndDocTypesReturn {
  const [leaveTypes, setLeaveTypes] = useState<MasterItem[]>([])
  const [leaveTypesLoading, setLeaveTypesLoading] = useState(true)
  const [employeeDocTypes, setEmployeeDocTypes] = useState<MasterItem[]>([])
  const [employeeDocTypesLoading, setEmployeeDocTypesLoading] = useState(true)
  const [companyDocTypes, setCompanyDocTypes] = useState<MasterItem[]>([])
  const [companyDocTypesLoading, setCompanyDocTypesLoading] = useState(true)

  const loadLeaveTypes = useCallback(async (): Promise<void> => {
    setLeaveTypesLoading(true)
    try {
      const data = await leaveTypeService.getLeaveTypes()
      setLeaveTypes(data.map((lt) => ({ id: lt.id, name: lt.name })))
    } catch {
      toast.error('Failed to load leave types')
    } finally {
      setLeaveTypesLoading(false)
    }
  }, [])

  const loadEmployeeDocTypes = useCallback(async (): Promise<void> => {
    setEmployeeDocTypesLoading(true)
    try {
      const data = await employeeDocumentTypeService.getEmployeeDocTypes()
      setEmployeeDocTypes(data.map((edt) => ({ id: edt.id, name: edt.name })))
    } catch {
      toast.error('Failed to load employee document types')
    } finally {
      setEmployeeDocTypesLoading(false)
    }
  }, [])

  const loadCompanyDocTypes = useCallback(async (): Promise<void> => {
    setCompanyDocTypesLoading(true)
    try {
      const data = await companyDocumentTypeService.getCompanyDocTypes()
      setCompanyDocTypes(data.map((cdt) => ({ id: cdt.id, name: cdt.name })))
    } catch {
      toast.error('Failed to load company document types')
    } finally {
      setCompanyDocTypesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeaveTypes()
    loadEmployeeDocTypes()
    loadCompanyDocTypes()
  }, [loadLeaveTypes, loadEmployeeDocTypes, loadCompanyDocTypes])

  const handleLeaveTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await leaveTypeService.updateLeaveType(id, name)
      } else {
        await leaveTypeService.createLeaveType(name)
      }
      await loadLeaveTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save leave type'
      toast.error(message)
    }
  }

  const handleLeaveTypeDelete = async (id: number): Promise<void> => {
    try {
      await leaveTypeService.deleteLeaveType(id)
      await loadLeaveTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete leave type'
      toast.error(message)
    }
  }

  const handleEmployeeDocTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await employeeDocumentTypeService.updateEmployeeDocType(id, name)
      } else {
        await employeeDocumentTypeService.createEmployeeDocType(name)
      }
      await loadEmployeeDocTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save employee document type'
      toast.error(message)
    }
  }

  const handleEmployeeDocTypeDelete = async (id: number): Promise<void> => {
    try {
      await employeeDocumentTypeService.deleteEmployeeDocType(id)
      await loadEmployeeDocTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete employee document type'
      toast.error(message)
    }
  }

  const handleCompanyDocTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await companyDocumentTypeService.updateCompanyDocType(id, name)
      } else {
        await companyDocumentTypeService.createCompanyDocType(name)
      }
      await loadCompanyDocTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save company document type'
      toast.error(message)
    }
  }

  const handleCompanyDocTypeDelete = async (id: number): Promise<void> => {
    try {
      await companyDocumentTypeService.deleteCompanyDocType(id)
      await loadCompanyDocTypes()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete company document type'
      toast.error(message)
    }
  }

  return {
    leaveTypes,
    leaveTypesLoading,
    employeeDocTypes,
    employeeDocTypesLoading,
    companyDocTypes,
    companyDocTypesLoading,
    handleLeaveTypeSave,
    handleLeaveTypeDelete,
    handleEmployeeDocTypeSave,
    handleEmployeeDocTypeDelete,
    handleCompanyDocTypeSave,
    handleCompanyDocTypeDelete,
  }
}
