// components/settings/roles/role-matrix-dialog.tsx
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Search, Loader2, ShieldCheck, CheckSquare, Square } from 'lucide-react'
import type { BackendPermission } from '@/services/permission-service'
import { cn } from '@/lib/utils'

interface RoleMatrixDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleEditId: number | null
  roleFormName: string
  setRoleFormName: (name: string) => void
  selectedPermissionIds: number[]
  onTogglePermissionId: (id: number, checked: boolean) => void
  onToggleAllGroupPermissions: (ids: number[], check: boolean) => void
  onSaveRole: (e: React.FormEvent) => void
  allPermissions: BackendPermission[]
  isSaving: boolean
}

const CATEGORIES = {
  'Asset Management': [
    'asset', 'asset amc', 'asset assignment history', 'asset disposal',
    'asset document', 'asset maintenance history', 'asset category',
    'asset document type', 'asset status', 'asset type'
  ],
  'Employee Management': [
    'employee', 'employee bank details', 'employee document',
    'employee document type', 'employee type'
  ],
  'Company & HR Masters': [
    'department', 'designation', 'branch', 'shift', 'nationality',
    'vendor', 'maintenance shop', 'service type', 'leave type'
  ],
  'System & Security': [
    'user', 'group', 'permission', 'session'
  ],
  'Administrative': [
    'log entry', 'content type', 'company document', 'company document type'
  ]
}

function getCategoryOfPermission(permName: string): string {
  const parts = permName.split(' ')
  let model = permName
  if (parts[0] === 'Can' && (parts[1] === 'add' || parts[1] === 'change' || parts[1] === 'delete' || parts[1] === 'view')) {
    model = parts.slice(2).join(' ')
  }

  for (const [catName, models] of Object.entries(CATEGORIES)) {
    if (models.includes(model.toLowerCase())) {
      return catName
    }
  }
  return 'Other Permissions'
}

export function RoleMatrixDialog({
  open,
  onOpenChange,
  roleEditId,
  roleFormName,
  setRoleFormName,
  selectedPermissionIds,
  onTogglePermissionId,
  onToggleAllGroupPermissions,
  onSaveRole,
  allPermissions,
  isSaving,
}: RoleMatrixDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Group permissions and filter by search query
  const groupedPermissions = useMemo(() => {
    const groups: { [key: string]: BackendPermission[] } = {
      'Asset Management': [],
      'Employee Management': [],
      'Company & HR Masters': [],
      'System & Security': [],
      'Administrative': [],
      'Other Permissions': []
    }

    const query = searchQuery.toLowerCase().trim()

    allPermissions.forEach((perm) => {
      if (query && !perm.name.toLowerCase().includes(query)) {
        return
      }
      const category = getCategoryOfPermission(perm.name)
      groups[category].push(perm)
    })

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(groups).filter(([_, perms]) => perms.length > 0)
    )
  }, [allPermissions, searchQuery])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border border-border/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] flex flex-col">
        <DialogHeader className="pb-2 border-b border-border/40">
          <DialogTitle className="text-cloud font-semibold text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-violet-glow" />
            {roleEditId !== null ? 'Edit Role Details' : 'Configure New Role'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSaveRole} className="space-y-5 pt-4 flex-1 flex flex-col">
          {/* Role Name input */}
          <div className="space-y-2">
            <Label htmlFor="role-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Role Name
            </Label>
            <Input
              id="role-name"
              value={roleFormName}
              onChange={(e) => setRoleFormName(e.target.value)}
              placeholder="e.g. Finance Assistant"
              className="bg-midnight border-border rounded-xl text-sm h-11"
              required
              disabled={isSaving}
            />
          </div>

          {/* Search bar for permissions */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permissions (e.g. Can add asset)..."
              className="pl-10 bg-midnight border-border rounded-xl text-sm h-10"
              disabled={isSaving}
            />
          </div>

          {/* Permissions Matrix */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[40vh]">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Configure Permissions Matrix
            </Label>

            {Object.keys(groupedPermissions).length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border/60 rounded-2xl bg-midnight/20">
                <p className="text-xs text-slate-500">No permissions match your search query</p>
              </div>
            ) : (
              Object.entries(groupedPermissions).map(([category, perms]) => {
                const groupPermissionIds = perms.map((p) => p.id)
                const checkedCount = perms.filter((p) => selectedPermissionIds.includes(p.id)).length
                const isAllSelected = checkedCount === perms.length

                return (
                  <div key={category} className="bg-midnight/40 border border-border/50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <h5 className="text-xs font-bold text-violet-glow uppercase tracking-wider">{category}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isSaving}
                        onClick={() => onToggleAllGroupPermissions(groupPermissionIds, !isAllSelected)}
                        className="text-[10px] font-semibold text-slate-400 hover:text-violet-glow h-6 px-2 flex items-center gap-1 hover:bg-violet-core/10 rounded-md cursor-pointer"
                      >
                        {isAllSelected ? (
                          <>
                            <Square className="h-3 w-3" /> Deselect All
                          </>
                        ) : (
                          <>
                            <CheckSquare className="h-3 w-3" /> Select All ({perms.length})
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 pt-1">
                      {perms.map((perm) => {
                        const isChecked = selectedPermissionIds.includes(perm.id)
                        return (
                          <div key={perm.id} className="flex items-center gap-3 group/item">
                            <Checkbox
                              id={'perm-' + perm.id}
                              checked={isChecked}
                              onCheckedChange={(checked) => onTogglePermissionId(perm.id, !!checked)}
                              disabled={isSaving}
                            />
                            <Label
                              htmlFor={'perm-' + perm.id}
                              className={cn(
                                "text-xs font-medium select-none cursor-pointer leading-none transition-colors",
                                isChecked ? "text-slate-200" : "text-slate-400 group-hover/item:text-slate-300"
                              )}
                            >
                              {perm.name}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="pt-4 border-t border-border/40 gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-xl px-5 cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving Role...
                </>
              ) : (
                'Save Role Configuration'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
