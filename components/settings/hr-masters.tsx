// components/settings/hr-masters.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { ShiftsMaster } from './hr-masters/shifts-master'
import { GenericMasterCard, type MasterItem } from './hr-masters/generic-master-card'
import { shiftService, type FrontendShift } from '@/services/shift-service'
import { employeeTypeService } from '@/services/employee-type-service'
import { leaveTypeService } from '@/services/leave-type-service'
import { employeeDocumentTypeService } from '@/services/employee-document-type-service'
import { companyDocumentTypeService } from '@/services/company-document-type-service'
import { nationalityService } from '@/services/nationality-service'

export function HRMasters() {
  // --- Shifts ---
  const [shifts, setShifts] = useState<FrontendShift[]>([])
  const [shiftsLoading, setShiftsLoading] = useState(true)

  // --- Generic master states ---
  const [employeeTypes, setEmployeeTypes] = useState<MasterItem[]>([])
  const [employeeTypesLoading, setEmployeeTypesLoading] = useState(true)

  const [leaveTypes, setLeaveTypes] = useState<MasterItem[]>([])
  const [leaveTypesLoading, setLeaveTypesLoading] = useState(true)

  const [employeeDocTypes, setEmployeeDocTypes] = useState<MasterItem[]>([])
  const [employeeDocTypesLoading, setEmployeeDocTypesLoading] = useState(true)

  const [companyDocTypes, setCompanyDocTypes] = useState<MasterItem[]>([])
  const [companyDocTypesLoading, setCompanyDocTypesLoading] = useState(true)

  const [nationalities, setNationalities] = useState<MasterItem[]>([])
  const [nationalitiesLoading, setNationalitiesLoading] = useState(true)

  // --- Data Fetchers ---
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
    loadShifts()
    loadEmployeeTypes()
    loadLeaveTypes()
    loadEmployeeDocTypes()
    loadCompanyDocTypes()
    loadNationalities()
  }, [loadShifts, loadEmployeeTypes, loadLeaveTypes, loadEmployeeDocTypes, loadCompanyDocTypes, loadNationalities])

  // --- CRUD Handlers ---
  const handleEmployeeTypeSave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await employeeTypeService.updateEmployeeType(id, name)
    } else {
      await employeeTypeService.createEmployeeType(name)
    }
    await loadEmployeeTypes()
  }

  const handleEmployeeTypeDelete = async (id: number): Promise<void> => {
    await employeeTypeService.deleteEmployeeType(id)
    await loadEmployeeTypes()
  }

  const handleLeaveTypeSave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await leaveTypeService.updateLeaveType(id, name)
    } else {
      await leaveTypeService.createLeaveType(name)
    }
    await loadLeaveTypes()
  }

  const handleLeaveTypeDelete = async (id: number): Promise<void> => {
    await leaveTypeService.deleteLeaveType(id)
    await loadLeaveTypes()
  }

  const handleEmployeeDocTypeSave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await employeeDocumentTypeService.updateEmployeeDocType(id, name)
    } else {
      await employeeDocumentTypeService.createEmployeeDocType(name)
    }
    await loadEmployeeDocTypes()
  }

  const handleEmployeeDocTypeDelete = async (id: number): Promise<void> => {
    await employeeDocumentTypeService.deleteEmployeeDocType(id)
    await loadEmployeeDocTypes()
  }

  const handleCompanyDocTypeSave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await companyDocumentTypeService.updateCompanyDocType(id, name)
    } else {
      await companyDocumentTypeService.createCompanyDocType(name)
    }
    await loadCompanyDocTypes()
  }

  const handleCompanyDocTypeDelete = async (id: number): Promise<void> => {
    await companyDocumentTypeService.deleteCompanyDocType(id)
    await loadCompanyDocTypes()
  }

  const handleNationalitySave = async (id: number | null, name: string): Promise<void> => {
    if (id !== null) {
      await nationalityService.updateNationality(id, name)
    } else {
      await nationalityService.createNationality(name)
    }
    await loadNationalities()
  }

  const handleNationalityDelete = async (id: number): Promise<void> => {
    await nationalityService.deleteNationality(id)
    await loadNationalities()
  }

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">HR Management Masters</h2>
        <p className="text-xs text-slate-400 mt-1">Configure employee classification, policies, and compliance settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShiftsMaster shifts={shifts} isLoading={shiftsLoading} onRefresh={loadShifts} />

        <GenericMasterCard
          title="Employee Types"
          items={employeeTypes}
          isLoading={employeeTypesLoading}
          onSave={handleEmployeeTypeSave}
          onDelete={handleEmployeeTypeDelete}
          placeholder="e.g. FULL-TIME"
          label="Employee Type"
        />

        <GenericMasterCard
          title="Leave Types"
          items={leaveTypes}
          isLoading={leaveTypesLoading}
          onSave={handleLeaveTypeSave}
          onDelete={handleLeaveTypeDelete}
          placeholder="e.g. SICK LEAVE"
          label="Leave Type"
        />

        <GenericMasterCard
          title="Employee Document Types"
          items={employeeDocTypes}
          isLoading={employeeDocTypesLoading}
          onSave={handleEmployeeDocTypeSave}
          onDelete={handleEmployeeDocTypeDelete}
          placeholder="e.g. PASSPORT"
          label="Document Type"
        />

        <GenericMasterCard
          title="Company Document Types"
          items={companyDocTypes}
          isLoading={companyDocTypesLoading}
          onSave={handleCompanyDocTypeSave}
          onDelete={handleCompanyDocTypeDelete}
          placeholder="e.g. TRADE LICENSE"
          label="Document Type"
        />

        <GenericMasterCard
          title="Nationalities"
          items={nationalities}
          isLoading={nationalitiesLoading}
          onSave={handleNationalitySave}
          onDelete={handleNationalityDelete}
          placeholder="e.g. INDIAN"
          label="Nationality"
        />
      </div>
    </div>
  )
}
