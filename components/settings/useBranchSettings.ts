// components/settings/useBranchSettings.ts
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { branchService, type Branch } from '@/services/branch-service'

export interface UseBranchSettingsReturn {
  branches: Branch[]
  isLoading: boolean
  isOpen: boolean
  editId: number | null
  formName: string
  formAddress: string
  isSubmitting: boolean
  deleteId: number | null
  isDeleting: boolean
  setIsOpen: (open: boolean) => void
  setFormName: (name: string) => void
  setFormAddress: (address: string) => void
  setDeleteId: (id: number | null) => void
  handleOpenAdd: () => void
  handleOpenEdit: (branch: Branch) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleDelete: () => Promise<void>
}

export function useBranchSettings(): UseBranchSettingsReturn {
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Add/Edit Dialog State
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [formName, setFormName] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadBranches = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await branchService.getBranches()
      setBranches(data)
    } catch {
      toast.error('Failed to load branches')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBranches()
  }, [])

  const handleOpenAdd = (): void => {
    setFormName('')
    setFormAddress('')
    setEditId(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (branch: Branch): void => {
    setFormName(branch.name)
    setFormAddress(branch.address)
    setEditId(branch.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const trimmedName = formName.trim()
    if (!trimmedName) return

    setIsSubmitting(true)
    try {
      if (editId !== null) {
        await branchService.updateBranch(editId, trimmedName, formAddress.trim())
        toast.success('Branch updated successfully')
      } else {
        await branchService.createBranch(trimmedName, formAddress.trim())
        toast.success('Branch created successfully')
      }
      setIsOpen(false)
      await loadBranches()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save branch'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (deleteId === null) return
    setIsDeleting(true)
    try {
      await branchService.deleteBranch(deleteId)
      toast.success('Branch deleted successfully')
      setDeleteId(null)
      await loadBranches()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete branch'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    branches,
    isLoading,
    isOpen,
    editId,
    formName,
    formAddress,
    isSubmitting,
    deleteId,
    isDeleting,
    setIsOpen,
    setFormName,
    setFormAddress,
    setDeleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  }
}
