// components/settings/roles-permissions.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Shield, Plus, Edit3, Trash2, Check, Lock } from 'lucide-react'
import { RoleMatrixDialog } from './roles/role-matrix-dialog'

export interface Role {
  name: string
  description: string
  permissions: string[]
}

const SYSTEM_PERMISSIONS = [
  'VIEW DASHBOARD',
  'MANAGE EMPLOYEES',
  'MANAGE PAYROLL',
  'VIEW ALL ATTENDANCE',
  'MANAGE DOCUMENTS',
  'MANAGE SETTINGS',
  'VIEW REPORTS',
  'MANAGE OFFBOARDING',
  'VIEW ADMIN DASHBOARD',
  'VIEW ALL EMPLOYEES',
  'MANAGE ATTENDANCE',
  'MANAGE ASSETS',
  'MANAGE MASTERS',
  'APPROVE REQUESTS',
  'MANAGE ONBOARDING',
]

interface RolesPermissionsProps {
  userRoles: Role[]
  setUserRoles: (roles: Role[]) => void
}

export function RolesPermissions({ userRoles, setUserRoles }: RolesPermissionsProps) {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(1) // Default to 1 (EMPLOYEE)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [roleFormName, setRoleFormName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [roleEditIndex, setRoleEditIndex] = useState<number | null>(null)

  const handleOpenAddRole = () => {
    setRoleFormName('')
    setSelectedPermissions([])
    setRoleEditIndex(null)
    setIsRoleModalOpen(true)
  }

  const handleOpenEditRole = (index: number) => {
    const role = userRoles[index]
    if (!role) return
    setRoleFormName(role.name)
    setSelectedPermissions(role.permissions || [])
    setRoleEditIndex(index)
    setIsRoleModalOpen(true)
  }

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleFormName.trim()) return

    const name = roleFormName.trim()
    let description = ''
    if (name === 'Admin') {
      description = 'Full system access'
    } else if (name === 'EMPLOYEE') {
      description = 'Self-service access'
    } else if (name.toLowerCase().includes('finance manager') || name.toLowerCase().includes('finance')) {
      description = 'Finance approver for loan and salary advance requests before HR review'
    } else if (name.toLowerCase().includes('hr')) {
      description = 'HR module access'
    } else if (name.toLowerCase().includes('manager')) {
      description = 'Line manager with first-level leave approval access'
    } else {
      description = selectedPermissions.length > 0
        ? 'Access to: ' + selectedPermissions.slice(0, 3).join(', ') + (selectedPermissions.length > 3 ? '...' : '')
        : 'No permissions configured'
    }

    if (roleEditIndex !== null) {
      const updated = [...userRoles]
      updated[roleEditIndex] = { name, description, permissions: selectedPermissions }
      setUserRoles(updated)
    } else {
      setUserRoles([...userRoles, { name, description, permissions: selectedPermissions }])
    }
    setIsRoleModalOpen(false)
  }

  const handleTogglePermission = (perm: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, perm])
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== perm))
    }
  }

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">Roles & Permissions Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">Configure system access levels and permissions per employee role</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">System Roles</span>
        <Button
          onClick={handleOpenAddRole}
          className="bg-violet-core hover:bg-violet-deep text-white font-semibold flex items-center gap-1 cursor-pointer h-9 px-3 rounded-lg text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Configure Roles
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userRoles.map((role, index) => {
          const isSelected = selectedRoleIndex === index
          return (
            <div
              key={role.name}
              className={cn(
                'bg-midnight/40 border rounded-xl p-4 flex flex-col justify-between hover:border-violet-core/50 transition-all group relative min-h-[120px] shadow-sm cursor-pointer',
                isSelected ? 'border-violet-core ring-1 ring-violet-core/50' : 'border-border/80'
              )}
              onClick={() => setSelectedRoleIndex(index)}
            >
              <div className="space-y-1">
                <h4 className={cn('font-semibold text-sm', isSelected ? 'text-violet-glow' : 'text-cloud')}>{role.name}</h4>
                <p className="text-[11px] text-slate-400 leading-normal">{role.description}</p>
              </div>
              {role.name !== 'Admin' && (
                <div
                  className={cn(
                    'absolute top-2.5 right-2.5 transition-opacity flex gap-1 bg-midnight/95 p-1 rounded-lg border border-border/50 shadow-lg z-10',
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-violet-glow hover:bg-violet-core/20 rounded-md cursor-pointer"
                    onClick={() => handleOpenEditRole(index)}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-400 hover:bg-red-500/20 rounded-md cursor-pointer"
                    onClick={() => {
                      setUserRoles(userRoles.filter((_, i) => i !== index))
                      if (selectedRoleIndex === index) setSelectedRoleIndex(null)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedRoleIndex !== null && userRoles[selectedRoleIndex] && (
        <Card className="bg-card/35 backdrop-blur border border-border/80 shadow-lg mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-cloud flex items-center gap-2">
              <Shield className="h-4 w-4 text-violet-glow" />
              Permissions Explorer &mdash; {userRoles[selectedRoleIndex].name}
            </CardTitle>
            <CardDescription className="text-xs">
              Overview of configured access privileges. Highlights denote active system permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SYSTEM_PERMISSIONS.map((perm) => {
                const hasPerm = userRoles[selectedRoleIndex].permissions.includes(perm)
                return (
                  <div
                    key={perm}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border transition-all',
                      hasPerm
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-900/40 border-border/40 text-slate-400 opacity-60'
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider">{perm}</span>
                      <span className="text-[10px] opacity-80">{hasPerm ? 'Access Granted' : 'Restricted'}</span>
                    </div>
                    {hasPerm ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="h-3 w-3" />
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                        <Lock className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <RoleMatrixDialog
        open={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        roleEditIndex={roleEditIndex}
        roleFormName={roleFormName}
        setRoleFormName={setRoleFormName}
        selectedPermissions={selectedPermissions}
        onTogglePermission={handleTogglePermission}
        onSaveRole={handleSaveRole}
      />
    </div>
  )
}
