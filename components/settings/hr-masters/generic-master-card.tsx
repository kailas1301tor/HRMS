// components/settings/hr-masters/generic-master-card.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Plus, Trash2, Edit3, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export interface MasterItem {
  id: number
  name: string
}

interface GenericMasterCardProps {
  title: string
  items: MasterItem[]
  isLoading: boolean
  onSave: (id: number | null, name: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  placeholder: string
  label: string
}

export function GenericMasterCard({
  title,
  items,
  isLoading,
  onSave,
  onDelete,
  placeholder,
  label,
}: GenericMasterCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editItem, setEditItem] = useState<MasterItem | null>(null)
  const [formValue, setFormValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<MasterItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenAdd = (): void => {
    setFormValue('')
    setEditItem(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (item: MasterItem): void => {
    setFormValue(item.name)
    setEditItem(item)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!formValue.trim()) return

    setIsSubmitting(true)
    try {
      await onSave(editItem?.id ?? null, formValue.trim().toUpperCase())
      setIsOpen(false)
      toast.success(editItem ? `${label} updated successfully` : `${label} created successfully`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to save ${label.toLowerCase()}`
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await onDelete(deleteTarget.id)
      toast.success(`${label} deleted successfully`)
      setDeleteTarget(null)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to delete ${label.toLowerCase()}`
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="bg-card/40 backdrop-blur border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-cloud font-semibold">{title}</CardTitle>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="text-xs font-semibold text-violet-glow hover:text-violet-deep transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-xl bg-midnight/50" />
              <Skeleton className="h-12 w-full rounded-xl bg-midnight/50" />
              <Skeleton className="h-12 w-full rounded-xl bg-midnight/50" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-400">
              No {title.toLowerCase()} found.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-3 hover:border-violet-core/40 transition-all group"
              >
                <span className="text-sm font-medium text-slate-200">{item.name}</span>
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-lg cursor-pointer"
                    onClick={() => handleOpenEdit(item)}
                    aria-label={`Edit ${item.name}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-lg cursor-pointer"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold text-lg font-sans">
              {editItem ? `Edit ${label}` : `Add ${label}`}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              {editItem ? `Update the ${label.toLowerCase()} name below.` : `Enter a name for the new ${label.toLowerCase()}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="master-value" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                {label}
              </Label>
              <Input
                id="master-value"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder={placeholder}
                className="bg-midnight border-border rounded-xl text-sm"
                required
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter className="pt-4 border-t border-border/40">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 cursor-pointer flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg font-sans">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm">
              This action cannot be undone. This will permanently delete &quot;{deleteTarget?.name}&quot; from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 border-t border-border/40 gap-2">
            <AlertDialogCancel className="h-10 rounded-xl cursor-pointer" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-5 cursor-pointer flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
