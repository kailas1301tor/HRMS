// components/settings/roles-permissions.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Shield, Plus, Check, Lock, Search, Loader2, ArrowLeft, CheckSquare, Square } from 'lucide-react'
import { useRolesData } from './useRolesData'
import { useRoleActions } from './useRoleActions'
import { useRoleForm } from './useRoleForm'
import { RoleCardSkeleton, ExplorerSkeleton, FormSkeleton } from './roles/roles-skeletons'
import { RoleCardList } from './roles/role-card-list'
import type { BackendRole } from '@/services/role-service'

export function RolesPermissions() {
  const {
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
    refreshData,
  } = useRolesData()

  const {
    action,
    roleEditId,
    isPending,
    handleOpenAddRole,
    handleOpenEditRole,
    handleCancelForm,
    handleDeleteRole,
  } = useRoleActions()

  const {
    roleFormName,
    setRoleFormName,
    selectedPermissionIds,
    formSearchQuery,
    setFormSearchQuery,
    isSaving,
    filteredFormPermissions,
    handleTogglePermissionId,
    handleToggleAllPermissions,
    handleSaveRole,
  } = useRoleForm({
    action,
    roleEditId,
    roles,
    allPermissions,
    handleCancelForm,
    refreshRoles: refreshData,
  })

  const onDeleteRole = (role: BackendRole, index: number) => {
    handleDeleteRole(role, index, roles, setRoles, selectedRoleIndex, setSelectedRoleIndex)
  }

  // --- RENDER 1: Form View (Add / Edit) ---
  if (action === 'add' || action === 'edit') {
    if (isLoading && roles.length === 0) {
      return <FormSkeleton />
    }

    const filteredIds = filteredFormPermissions.map((p) => p.id)
    const checkedCount = filteredFormPermissions.filter((p) => selectedPermissionIds.includes(p.id)).length
    const isAllChecked = filteredIds.length > 0 && checkedCount === filteredIds.length

    return (
      <Card className="bg-card/35 backdrop-blur border border-border/80 shadow-lg">
        <CardHeader className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCancelForm}
              disabled={isSaving}
              className="h-9 w-9 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-cloud font-semibold text-base flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-violet-glow" />
                {action === 'edit' ? `Edit Role Details` : 'Configure New Role'}
              </CardTitle>
              <CardDescription className="text-xs">
                {action === 'edit'
                  ? 'Modify role name and adjust access privilege configurations.'
                  : 'Define a new system role name and choose permissions.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSaveRole} className="space-y-6 pt-6 CardContent p-6">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="role-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Role Name
            </Label>
            <Input
              id="role-name"
              value={roleFormName}
              onChange={(e) => setRoleFormName(e.target.value)}
              placeholder="e.g. Payroll Specialist"
              className="bg-midnight border-border rounded-xl text-sm h-11"
              required
              disabled={isSaving}
            />
          </div>

          {/* Permissions Flat Grid Card */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Configure Permissions Matrix ({selectedPermissionIds.length} Selected)
              </Label>

              <div className="flex items-center gap-2">
                {/* Search query input */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    value={formSearchQuery}
                    onChange={(e) => setFormSearchQuery(e.target.value)}
                    placeholder="Search permissions..."
                    className="pl-8 bg-midnight border-border/60 rounded-lg text-xs h-8.5"
                    disabled={isSaving}
                  />
                </div>

                {/* Select All Toggle */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSaving || filteredFormPermissions.length === 0}
                  onClick={() => handleToggleAllPermissions(filteredIds, !isAllChecked)}
                  className="text-[10px] font-semibold text-slate-400 hover:text-violet-glow h-8.5 px-3.5 flex items-center gap-1 border border-border/50 hover:bg-violet-core/10 rounded-lg cursor-pointer flex-shrink-0"
                >
                  {isAllChecked ? (
                    <>
                      <Square className="h-3 w-3" /> Deselect All
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-3 w-3" /> Select All ({filteredFormPermissions.length})
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Flat Grid Container */}
            {filteredFormPermissions.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border/50 rounded-2xl bg-midnight/20">
                <p className="text-xs text-slate-500">No permissions match your search filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border border-border/40 rounded-2xl p-4 bg-midnight/25 shadow-inner">
                {filteredFormPermissions.map((perm) => {
                  const isChecked = selectedPermissionIds.includes(perm.id)
                  return (
                    <div
                      key={perm.id}
                      onClick={() => handleTogglePermissionId(perm.id, !isChecked)}
                      className={cn(
                        'flex items-center gap-3.5 p-4 border rounded-xl transition-all duration-200 cursor-pointer select-none',
                        isChecked
                          ? 'bg-violet-core/10 border-violet-core/80 shadow-[0_0_12px_rgba(139,92,246,0.08)]'
                          : 'bg-midnight/35 border-border/60 hover:border-violet-core/50'
                      )}
                    >
                      <Checkbox
                        id={'perm-' + perm.id}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleTogglePermissionId(perm.id, !!checked)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isSaving}
                        className="border-slate-400 dark:border-slate-600 data-[state=checked]:border-violet-core data-[state=checked]:bg-violet-core size-4.5"
                      />
                      <Label
                        htmlFor={'perm-' + perm.id}
                        className={cn(
                          'text-xs font-semibold leading-relaxed cursor-pointer transition-colors',
                          isChecked ? 'text-violet-glow' : 'text-slate-600 dark:text-slate-400'
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {perm.name}
                      </Label>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelForm}
              className="h-10 rounded-xl cursor-pointer"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-xl px-6 cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                'Save Access Configuration'
              )}
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  // --- RENDER 2: Listing View (Main Tab) ---
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
          disabled={isLoading || isPending}
          className="bg-violet-core hover:bg-violet-deep text-white font-semibold flex items-center gap-1 cursor-pointer h-9 px-3 rounded-lg text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Configure Roles
        </Button>
      </div>

      {/* Roles Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <RoleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <RoleCardList
          roles={roles}
          selectedRoleIndex={selectedRoleIndex}
          setSelectedRoleIndex={setSelectedRoleIndex}
          onEditRole={handleOpenEditRole}
          onDeleteRole={onDeleteRole}
          isPending={isPending}
        />
      )}

      {/* Permissions Explorer Details Card */}
      {(isLoading || (selectedRoleIndex !== null && activeRole)) && (
        <Card className="bg-card/35 backdrop-blur border border-border/80 shadow-lg mt-6">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-cloud flex items-center gap-2">
                <Shield className="h-4 w-4 text-violet-glow" />
                Permissions Explorer {activeRole ? `— ${activeRole.name}` : ''}
              </CardTitle>
              <CardDescription className="text-xs">
                Overview of active privileges. Highlights denote active system permissions.
              </CardDescription>
            </div>
            {/* Explorer Search Input */}
            {!isLoading && (
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  placeholder="Search active permissions..."
                  className="pl-8 bg-midnight/60 border-border/60 rounded-lg text-xs h-8"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ExplorerSkeleton />
            ) : filteredExplorerPermissions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500">No permissions found matching search filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredExplorerPermissions.map((perm) => {
                  const hasPerm = activeRole ? activeRole.permissions.some((p) => p.id === perm.id) : false
                  return (
                    <div
                      key={perm.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl border transition-all',
                        hasPerm
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-midnight/35 border-border/40 text-slate-500 opacity-50'
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider line-clamp-1">
                          {perm.name}
                        </span>
                        <span className="text-[10px] opacity-80">{hasPerm ? 'Access Granted' : 'Restricted'}</span>
                      </div>
                      {hasPerm ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-slate-500 flex-shrink-0">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
