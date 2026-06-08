// components/settings/useDesignationSettings.ts
import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { departmentService, type Department } from '@/services/department-service'
import { designationService, type Designation } from '@/services/designation-service'

export interface UseDesignationSettingsReturn {
  selectedDeptId: string
  departments: Department[]
  isDeptLoading: boolean
  designations: Designation[]
  isLoading: boolean
  isOpen: boolean
  editId: number | null
  formName: string
  formDescription: string
  formDepartmentId: string
  isSubmitting: boolean
  deleteId: number | null
  isDeleting: boolean
  setIsOpen: (open: boolean) => void
  setFormName: (name: string) => void
  setFormDescription: (desc: string) => void
  setFormDepartmentId: (id: string) => void
  setDeleteId: (id: number | null) => void
  handleDeptChange: (value: string) => void
  handleOpenAdd: () => void
  handleOpenEdit: (desig: Designation) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleDelete: () => Promise<void>
}

export function useDesignationSettings(): UseDesignationSettingsReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedDeptId = searchParams.get('dept_id') || ''

  const setSelectedDeptId = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('dept_id', id)
    } else {
      params.delete('dept_id')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  // Department data
  const [departments, setDepartments] = useState<Department[]>([])
  const [isDeptLoading, setIsDeptLoading] = useState(true)

  // Designation data
  const [designations, setDesignations] = useState<Designation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Add/Edit Dialog
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formDepartmentId, setFormDepartmentId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete Dialog
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadDepts = async (): Promise<void> => {
      setIsDeptLoading(true)
      try {
        const data = await departmentService.getDepartments()
        setDepartments(data)
      } catch {
        toast.error('Failed to load departments')
      } finally {
        setIsDeptLoading(false)
      }
    }
    loadDepts()
  }, [])

  useEffect(() => {
    if (!selectedDeptId && departments.length > 0) {
      setSelectedDeptId(String(departments[0].id))
    }
  }, [selectedDeptId, departments, setSelectedDeptId])

  const loadDesignations = useCallback(async (deptId: number): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await designationService.getDesignations(deptId)
      setDesignations(data)
    } catch {
      toast.error('Failed to load designations')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDeptId) {
      loadDesignations(Number(selectedDeptId))
    }
  }, [selectedDeptId, loadDesignations])

  const handleDeptChange = (value: string): void => {
    setSelectedDeptId(value)
    setDesignations([])
  }

  const handleOpenAdd = (): void => {
    setFormName('')
    setFormDescription('')
    setFormDepartmentId(selectedDeptId)
    setEditId(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (desig: Designation): void => {
    setFormName(desig.name)
    setFormDescription(desig.description)
    setFormDepartmentId(String(desig.department))
    setEditId(desig.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!formName.trim() || !formDepartmentId) return

    const deptId = Number(formDepartmentId)
    setIsSubmitting(true)
    try {
      if (editId !== null) {
        await designationService.updateDesignation(editId, deptId, formName.trim(), formDescription.trim())
        toast.success('Designation updated successfully')
      } else {
        await designationService.createDesignation(deptId, formName.trim(), formDescription.trim())
        toast.success('Designation created successfully')
      }
      setIsOpen(false)
      if (selectedDeptId) {
        await loadDesignations(Number(selectedDeptId))
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save designation'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (deleteId === null || !selectedDeptId) return
    setIsDeleting(true)
    try {
      await designationService.deleteDesignation(deleteId)
      toast.success('Designation deleted successfully')
      setDeleteId(null)
      await loadDesignations(Number(selectedDeptId))
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete designation'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    selectedDeptId,
    departments,
    isDeptLoading,
    designations,
    isLoading,
    isOpen,
    editId,
    formName,
    formDescription,
    formDepartmentId,
    isSubmitting,
    deleteId,
    isDeleting,
    setIsOpen,
    setFormName,
    setFormDescription,
    setFormDepartmentId,
    setDeleteId,
    handleDeptChange,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  }
}
