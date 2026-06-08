// components/settings/useDepartmentSettings.ts
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { departmentService, type Department } from '@/services/department-service'
import { toast } from 'sonner'

export interface UseDepartmentSettingsReturn {
  selectedDeptId: string
  departments: Department[]
  isLoading: boolean
  isOpen: boolean
  editId: number | null
  formName: string
  formDescription: string
  isSubmitting: boolean
  deleteId: number | null
  isDeleting: boolean
  setIsOpen: (open: boolean) => void
  setFormName: (name: string) => void
  setFormDescription: (desc: string) => void
  setDeleteId: (id: number | null) => void
  setSelectedDeptId: (id: string) => void
  handleOpenAdd: () => void
  handleOpenEdit: (dept: Department) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleDelete: () => Promise<void>
}

export function useDepartmentSettings(): UseDepartmentSettingsReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedDeptId = searchParams.get('dept_id') || ''

  const setSelectedDeptId = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('dept_id', id)
    } else {
      params.delete('dept_id')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Add/Edit Dialog State
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadDepartments = async () => {
    setIsLoading(true)
    try {
      const data = await departmentService.getDepartments()
      setDepartments(data)
    } catch (error) {
      toast.error('Failed to load departments')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  const handleOpenAdd = () => {
    setFormName('')
    setFormDescription('')
    setEditId(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (dept: Department) => {
    setFormName(dept.name)
    setFormDescription(dept.description || '')
    setEditId(dept.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    setIsSubmitting(true)
    try {
      if (editId !== null) {
        await departmentService.updateDepartment(editId, formName.trim().toUpperCase(), formDescription.trim())
        toast.success('Department updated successfully')
      } else {
        await departmentService.createDepartment(formName.trim().toUpperCase(), formDescription.trim())
        toast.success('Department created successfully')
      }
      setIsOpen(false)
      await loadDepartments()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save department'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setIsDeleting(true)
    try {
      await departmentService.deleteDepartment(deleteId)
      toast.success('Department deleted successfully')
      if (selectedDeptId === String(deleteId)) {
        setSelectedDeptId('')
      }
      setDeleteId(null)
      await loadDepartments()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete department'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    selectedDeptId,
    departments,
    isLoading,
    isOpen,
    editId,
    formName,
    formDescription,
    isSubmitting,
    deleteId,
    isDeleting,
    setIsOpen,
    setFormName,
    setFormDescription,
    setDeleteId,
    setSelectedDeptId,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  }
}
