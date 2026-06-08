// components/assets/useAssignAssetDialog.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assignAssetSchema, type AssignAssetInput } from '@/validations/asset-actions.schema'
import { assetService } from '@/services/asset-service'
import { employeeService } from '@/services/employee-service'
import type { Employee } from '@/components/employees/employee-table'
import { toast } from 'sonner'

export interface UseAssignAssetDialogReturn {
  employees: Employee[]
  searchQuery: string
  isLoadingEmployees: boolean
  isSubmitting: boolean
  form: UseFormReturn<AssignAssetInput>
  selectedEmployeeId: number
  filteredEmployees: Employee[]
  selectedEmp: Employee | undefined
  setSearchQuery: (query: string) => void
  onSubmit: (data: AssignAssetInput) => Promise<void>
}

export function useAssignAssetDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  assetId: number,
  onSuccess: () => void
): UseAssignAssetDialogReturn {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AssignAssetInput>({
    resolver: zodResolver(assignAssetSchema),
    defaultValues: {
      remarks: ''
    }
  })

  const { watch, reset } = form
  const selectedEmployeeId = watch('assign_to_employee')

  useEffect(() => {
    const controller = new AbortController()
    async function loadEmployees() {
      if (!open) return
      setIsLoadingEmployees(true)
      try {
        const response = await employeeService.getEmployees({ page_size: 100 }, controller.signal)
        setEmployees(response.data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.error('Failed to load employees list:', err)
        toast.error('Failed to load employees list')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingEmployees(false)
        }
      }
    }
    loadEmployees()
    return () => {
      controller.abort()
    }
  }, [open])

  const onSubmit = async (data: AssignAssetInput) => {
    setIsSubmitting(true)
    try {
      await assetService.assignAsset({
        asset_id: assetId,
        assign_to_employee: data.assign_to_employee,
        remarks: data.remarks
      })
      toast.success('Asset assigned successfully')
      onOpenChange(false)
      reset()
      setSearchQuery('')
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to assign asset'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredEmployees = employees.filter((emp) =>
    (emp.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.employee_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedEmp = employees.find((emp) => emp.id === selectedEmployeeId)

  return {
    employees,
    searchQuery,
    isLoadingEmployees,
    isSubmitting,
    form,
    selectedEmployeeId,
    filteredEmployees,
    selectedEmp,
    setSearchQuery,
    onSubmit,
  }
}
