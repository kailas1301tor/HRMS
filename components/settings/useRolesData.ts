// components/settings/useRolesData.ts
import { useState, useEffect, useMemo } from 'react'
import { roleService, type BackendRole } from '@/services/role-service'
import { permissionService, type BackendPermission } from '@/services/permission-service'
import { toast } from 'sonner'

export interface UseRolesDataReturn {
  roles: BackendRole[]
  allPermissions: BackendPermission[]
  isLoading: boolean
  selectedRoleIndex: number | null
  setSelectedRoleIndex: (index: number | null) => void
  explorerSearch: string
  setExplorerSearch: (query: string) => void
  filteredExplorerPermissions: BackendPermission[]
  activeRole: BackendRole | null
  setRoles: React.Dispatch<React.SetStateAction<BackendRole[]>>
  refreshData: () => Promise<void>
}

export function useRolesData(): UseRolesDataReturn {
  const [roles, setRoles] = useState<BackendRole[]>([])
  const [allPermissions, setAllPermissions] = useState<BackendPermission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(0)
  const [explorerSearch, setExplorerSearch] = useState('')

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [fetchedRoles, fetchedPermissions] = await Promise.all([
        roleService.getRoles(),
        permissionService.getPermissions()
      ])
      setRoles(fetchedRoles)
      setAllPermissions(fetchedPermissions)
      setSelectedRoleIndex(fetchedRoles.length > 0 ? 0 : null)
    } catch {
      toast.error('Failed to load roles and permissions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const activeRole = selectedRoleIndex !== null && selectedRoleIndex < roles.length ? roles[selectedRoleIndex] : null

  const filteredExplorerPermissions = useMemo(() => {
    return allPermissions.filter((perm) => {
      if (!explorerSearch.trim()) return true
      return perm.name.toLowerCase().includes(explorerSearch.toLowerCase().trim())
    })
  }, [allPermissions, explorerSearch])

  return {
    roles,
    allPermissions,
    isLoading,
    selectedRoleIndex,
    setSelectedRoleIndex,
    explorerSearch,
    setExplorerSearch,
    filteredExplorerPermissions,
    activeRole,
    setRoles,
    refreshData: loadData
  }
}
