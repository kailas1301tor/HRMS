// components/settings/useRoleForm.ts
import { useState, useEffect, useMemo, useRef } from 'react'
import { roleService, type BackendRole } from '@/services/role-service'
import { type BackendPermission } from '@/services/permission-service'
import { toast } from 'sonner'

export interface UseRoleFormProps {
  action: string
  roleEditId: number | null
  roles: BackendRole[]
  allPermissions: BackendPermission[]
  handleCancelForm: () => void
  refreshRoles: () => Promise<void>
}

export interface UseRoleFormReturn {
  roleFormName: string
  setRoleFormName: (name: string) => void
  selectedPermissionIds: number[]
  setSelectedPermissionIds: (ids: number[]) => void
  formSearchQuery: string
  setFormSearchQuery: (query: string) => void
  isSaving: boolean
  isLoadingDetails: boolean
  sortedPermissions: BackendPermission[]
  filteredFormPermissions: BackendPermission[]
  handleTogglePermissionId: (id: number, checked: boolean) => void
  handleToggleAllPermissions: (ids: number[], check: boolean) => void
  handleSaveRole: (e: React.FormEvent) => Promise<void>
}

export function useRoleForm({
  action,
  roleEditId,
  roles,
  allPermissions,
  handleCancelForm,
  refreshRoles,
}: UseRoleFormProps): UseRoleFormReturn {
  const [roleFormName, setRoleFormName] = useState('')
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [formSearchQuery, setFormSearchQuery] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const fetchIdRef = useRef(0)
  const handleCancelFormRef = useRef(handleCancelForm)
  const syncedFormKeyRef = useRef<string | null>(null)

  useEffect(() => {
    handleCancelFormRef.current = handleCancelForm
  }, [handleCancelForm])

  useEffect(() => {
    const formKey = `${action}:${roleEditId ?? 'new'}`

    if (action === 'add') {
      if (syncedFormKeyRef.current === formKey) return
      syncedFormKeyRef.current = formKey
      setRoleFormName('')
      setSelectedPermissionIds([])
      setFormSearchQuery('')
      setIsLoadingDetails(false)
      return
    }

    if (action !== 'edit' || roleEditId === null) {
      syncedFormKeyRef.current = null
      return
    }

    const role = roles.find((r) => r.id === roleEditId)
    if (role) {
      if (syncedFormKeyRef.current === formKey) return
      syncedFormKeyRef.current = formKey
      setRoleFormName(role.name)
      setSelectedPermissionIds(role.permissions.map((p) => p.id))
      setIsLoadingDetails(false)
      return
    }

    if (roles.length === 0) {
      setIsLoadingDetails(true)
      return
    }

    if (syncedFormKeyRef.current === formKey) return
    syncedFormKeyRef.current = formKey

    const fetchId = ++fetchIdRef.current
    setIsLoadingDetails(true)

    const fetchRoleDetails = async (): Promise<void> => {
      try {
        const roleDetails = await roleService.getRoleById(roleEditId)
        if (fetchId !== fetchIdRef.current) return
        if (roleDetails) {
          setRoleFormName(roleDetails.name)
          setSelectedPermissionIds(roleDetails.permissions.map((p) => p.id))
        } else {
          toast.error('Role not found')
          handleCancelFormRef.current()
        }
      } catch {
        if (fetchId !== fetchIdRef.current) return
        toast.error('Failed to load role details')
        handleCancelFormRef.current()
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoadingDetails(false)
        }
      }
    }

    void fetchRoleDetails()

    return () => {
      fetchIdRef.current += 1
    }
  }, [action, roleEditId, roles])

  const handleTogglePermissionId = (id: number, checked: boolean): void => {
    if (checked) {
      setSelectedPermissionIds((prev) => [...prev, id])
    } else {
      setSelectedPermissionIds((prev) => prev.filter((pId) => pId !== id))
    }
  }

  const handleToggleAllPermissions = (ids: number[], check: boolean): void => {
    if (check) {
      setSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...ids])))
    } else {
      setSelectedPermissionIds((prev) => prev.filter((pId) => !ids.includes(pId)))
    }
  }

  const sortedPermissions = useMemo(() => {
    return allPermissions.slice().sort((a, b) => a.name.localeCompare(b.name))
  }, [allPermissions])

  const filteredFormPermissions = useMemo(() => {
    const query = formSearchQuery.toLowerCase().trim()
    if (!query) return sortedPermissions
    return sortedPermissions.filter((p) => p.name.toLowerCase().includes(query))
  }, [sortedPermissions, formSearchQuery])

  const handleSaveRole = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!roleFormName.trim()) return

    setIsSaving(true)
    try {
      if (roleEditId !== null) {
        const updatedRole = await roleService.updateRole(roleEditId, roleFormName.trim(), selectedPermissionIds)
        await roleService.assignPermissionsToGroup(roleEditId, selectedPermissionIds)
        toast.success(`Role "${updatedRole.name}" updated successfully`)
      } else {
        const newRole = await roleService.createRole(roleFormName.trim(), selectedPermissionIds)
        await roleService.assignPermissionsToGroup(newRole.id, selectedPermissionIds)
        toast.success(`Role "${newRole.name}" created successfully`)
      }
      handleCancelForm()
      await refreshRoles()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save role'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    roleFormName,
    setRoleFormName,
    selectedPermissionIds,
    setSelectedPermissionIds,
    formSearchQuery,
    setFormSearchQuery,
    isSaving,
    isLoadingDetails,
    sortedPermissions,
    filteredFormPermissions,
    handleTogglePermissionId,
    handleToggleAllPermissions,
    handleSaveRole,
  }
}
