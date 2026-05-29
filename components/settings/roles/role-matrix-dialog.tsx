// components/settings/roles/role-matrix-dialog.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'

const LEFT_COLUMN_PERMISSIONS = [
  'VIEW DASHBOARD',
  'MANAGE EMPLOYEES',
  'MANAGE PAYROLL',
  'VIEW ALL ATTENDANCE',
  'MANAGE DOCUMENTS',
  'MANAGE SETTINGS',
  'VIEW REPORTS',
  'MANAGE OFFBOARDING',
]

const RIGHT_COLUMN_PERMISSIONS = [
  'VIEW ADMIN DASHBOARD',
  'VIEW ALL EMPLOYEES',
  'MANAGE ATTENDANCE',
  'MANAGE ASSETS',
  'MANAGE MASTERS',
  'APPROVE REQUESTS',
  'MANAGE ONBOARDING',
]

interface RoleMatrixDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleEditIndex: number | null
  roleFormName: string
  setRoleFormName: (name: string) => void
  selectedPermissions: string[]
  onTogglePermission: (perm: string, checked: boolean) => void
  onSaveRole: (e: React.FormEvent) => void
}

export function RoleMatrixDialog({
  open,
  onOpenChange,
  roleEditIndex,
  roleFormName,
  setRoleFormName,
  selectedPermissions,
  onTogglePermission,
  onSaveRole,
}: RoleMatrixDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border border-border/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg font-sans">
            {roleEditIndex !== null ? 'Edit Role Details' : 'Configure Role Details'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSaveRole} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="role-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
              Role Name
            </Label>
            <Input
              id="role-name"
              value={roleFormName}
              onChange={(e) => setRoleFormName(e.target.value)}
              placeholder="e.g. Finance Assistant"
              className="bg-midnight border-border rounded-xl text-sm"
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
              Configure Permissions Matrix
            </Label>
            <div className="grid grid-cols-2 gap-4 bg-midnight/40 border border-border/50 rounded-2xl p-4">
              <div className="space-y-3">
                {LEFT_COLUMN_PERMISSIONS.map((perm) => (
                  <div key={perm} className="flex items-center gap-3">
                    <Checkbox
                      id={'perm-' + perm}
                      checked={selectedPermissions.includes(perm)}
                      onCheckedChange={(checked) => onTogglePermission(perm, !!checked)}
                    />
                    <Label htmlFor={'perm-' + perm} className="text-xs text-slate-300 font-medium select-none cursor-pointer">
                      {perm}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {RIGHT_COLUMN_PERMISSIONS.map((perm) => (
                  <div key={perm} className="flex items-center gap-3">
                    <Checkbox
                      id={'perm-' + perm}
                      checked={selectedPermissions.includes(perm)}
                      onCheckedChange={(checked) => onTogglePermission(perm, !!checked)}
                    />
                    <Label htmlFor={'perm-' + perm} className="text-xs text-slate-300 font-medium select-none cursor-pointer">
                      {perm}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border/40">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 cursor-pointer">
              Save Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
