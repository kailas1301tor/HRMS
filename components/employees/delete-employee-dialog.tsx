// components/employees/delete-employee-dialog.tsx
'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface DeleteEmployeeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteEmployeeDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteEmployeeDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-cloud font-semibold text-lg font-sans">
            Delete Employee Profile
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400 text-sm font-sans mt-2">
            Are you sure you want to delete this employee? This action is permanent and cannot be undone. All associated data will be deactivated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/40">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="h-10 rounded-xl" disabled={isDeleting} onClick={onClose}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            className="h-10 bg-destructive text-white hover:bg-destructive/90 font-semibold rounded-xl px-5 flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isDeleting ? 'Deleting...' : 'Delete Employee'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
