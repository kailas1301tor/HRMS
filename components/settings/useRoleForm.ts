// components/settings/useRoleForm.ts
import { useState, useEffect, useMemo } from 'react'
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

  useEffect(() => {
    if (action === 'edit' && roleEditId !== null) {
      const role = roles.find((r) => r.id === roleEditId)
      if (role) {
        if (roleFormName !== role.name) {
          setRoleFormName(role.name)
        }
        const newIds = role.permissions.map((p) => p.id)
        const hasChanged = selectedPermissionIds.length !== newIds.length || selectedPermissionIds.some((v, i) => v !== newIds[i])
        if (hasChanged) {
          setSelectedPermissionIds(newIds)
        }
      } else if (roles.length > 0) {
        const fetchRoleDetails = async () => {
          setIsSaving(true)
          try {
            const roleDetails = await roleService.getRoleById(roleEditId)
            if (roleDetails) {
              if (roleFormName !== roleDetails.name) {
                setRoleFormName(roleDetails.name)
              }
              const newIds = roleDetails.permissions.map((p) => p.id)
              const hasChanged = selectedPermissionIds.length !== newIds.length || selectedPermissionIds.some((v, i) => v !== newIds[i])
              if (hasChanged) {
                setSelectedPermissionIds(newIds)
              }
            } else {
              toast.error('Role not found')
              handleCancelForm()
            }
          } catch {
            toast.error('Failed to load role details')
            handleCancelForm()
          } finally {
            setIsSaving(false)
          }
        }
        fetchRoleDetails()
      }
    } else if (action === 'add') {
      if (roleFormName !== '' || selectedPermissionIds.length > 0 || formSearchQuery !== '') {
        setRoleFormName('')
        setSelectedPermissionIds([])
        setFormSearchQuery('')
      }
    }
  }, [action, roleEditId, roles, handleCancelForm])

  const handleTogglePermissionId = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissionIds((prev) => [...prev, id])
    } else {
      setSelectedPermissionIds((prev) => prev.filter((pId) => pId !== id))
    }
  }

  const handleToggleAllPermissions = (ids: number[], check: boolean) => {
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

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleFormName.trim()) return

    setIsSaving(true)
    try {
      if (roleEditId !== null) {
        const updatedRole = await roleService.updateRole(roleEditId, roleFormName.trim(), selectedPermissionIds)
        toast.success(`Role "${updatedRole.name}" updated successfully`)
      } else {
        const newRole = await roleService.createRole(roleFormName.trim(), selectedPermissionIds)
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
    sortedPermissions,
    filteredFormPermissions,
    handleTogglePermissionId,
    handleToggleAllPermissions,
    handleSaveRole,
  }
}
