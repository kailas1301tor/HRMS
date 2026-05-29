// components/settings/designation-settings-card.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
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
import { Plus, Trash2, Edit3, Loader2, Briefcase } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { departmentService, type Department } from '@/services/department-service'
import { designationService, type Designation } from '@/services/designation-service'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function DesignationSettingsCard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedDeptId = searchParams.get('dept_id') || ''

  const setSelectedDeptId = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('dept_id', id)
    } else {
      params.delete('dept_id')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  // Department data
  const [departments, setDepartments] = useState<Department[]>([])
  const [isDeptLoading, setIsDeptLoading] = useState(true)

  // Designation data
  const [designations, setDesignations] = useState<Designation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Add/Edit Dialog
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formDepartmentId, setFormDepartmentId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete Dialog
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadDepts = async (): Promise<void> => {
      setIsDeptLoading(true)
      try {
        const data = await departmentService.getDepartments()
        setDepartments(data)
      } catch {
        toast.error('Failed to load departments')
      } finally {
        setIsDeptLoading(false)
      }
    }
    loadDepts()
  }, [])

  useEffect(() => {
    if (!selectedDeptId && departments.length > 0) {
      setSelectedDeptId(String(departments[0].id))
    }
  }, [selectedDeptId, departments])

  const loadDesignations = useCallback(async (deptId: number): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await designationService.getDesignations(deptId)
      setDesignations(data)
    } catch {
      toast.error('Failed to load designations')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDeptId) {
      loadDesignations(Number(selectedDeptId))
    }
  }, [selectedDeptId, loadDesignations])

  const handleDeptChange = (value: string): void => {
    setSelectedDeptId(value)
    setDesignations([])
  }

  const handleOpenAdd = (): void => {
    setFormName('')
    setFormDescription('')
    setFormDepartmentId(selectedDeptId)
    setEditId(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (desig: Designation): void => {
    setFormName(desig.name)
    setFormDescription(desig.description)
    setFormDepartmentId(String(desig.department))
    setEditId(desig.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!formName.trim() || !formDepartmentId) return

    const deptId = Number(formDepartmentId)
    setIsSubmitting(true)
    try {
      if (editId !== null) {
        await designationService.updateDesignation(editId, deptId, formName.trim(), formDescription.trim())
        toast.success('Designation updated successfully')
      } else {
        await designationService.createDesignation(deptId, formName.trim(), formDescription.trim())
        toast.success('Designation created successfully')
      }
      setIsOpen(false)
      // Refresh list for the currently viewed department
      if (selectedDeptId) {
        await loadDesignations(Number(selectedDeptId))
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save designation'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (deleteId === null || !selectedDeptId) return
    setIsDeleting(true)
    try {
      await designationService.deleteDesignation(deleteId)
      toast.success('Designation deleted successfully')
      setDeleteId(null)
      await loadDesignations(Number(selectedDeptId))
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete designation'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="bg-card/40 backdrop-blur border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-cloud font-semibold">Designations</CardTitle>
          {selectedDeptId && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="text-xs font-semibold text-violet-glow hover:text-violet-deep transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Department Selector */}
          {isDeptLoading ? (
            <Skeleton className="h-10 w-full rounded-xl bg-midnight/50" />
          ) : (
            <Select value={selectedDeptId} onValueChange={handleDeptChange}>
              <SelectTrigger className="bg-midnight border-border rounded-xl text-sm h-10 cursor-pointer">
                <SelectValue placeholder="Select a department..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/80 rounded-xl">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)} className="cursor-pointer">
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Designation List */}
          {!selectedDeptId ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Briefcase className="h-8 w-8 text-slate-500" />
              <p className="text-sm text-slate-400">Select a department to view designations.</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-xl bg-midnight/50" />
              <Skeleton className="h-14 w-full rounded-xl bg-midnight/50" />
            </div>
          ) : designations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Briefcase className="h-8 w-8 text-slate-500" />
              <p className="text-sm text-slate-400">No designations found for this department.</p>
              <p className="text-xs text-slate-500">Click &quot;Add&quot; to create one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {designations.map((desig) => (
                <div
                  key={desig.id}
                  className="flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-3 hover:border-violet-core/40 transition-all group"
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-slate-200">{desig.name}</span>
                    {desig.description && (
                      <p className="text-xs text-slate-400 font-normal">{desig.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-lg cursor-pointer"
                      onClick={() => handleOpenEdit(desig)}
                      aria-label={`Edit designation ${desig.name}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-lg cursor-pointer"
                      onClick={() => setDeleteId(desig.id)}
                      aria-label={`Delete designation ${desig.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!isSubmitting) setIsOpen(open) }}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold text-lg font-sans">
              {editId !== null ? 'Edit Designation' : 'Add Designation'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              {editId !== null ? 'Update the designation details below.' : 'Fill in the details to create a new designation.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Department
              </Label>
              <Select value={formDepartmentId} onValueChange={setFormDepartmentId}>
                <SelectTrigger className="bg-midnight border-border rounded-xl text-sm h-10 cursor-pointer">
                  <SelectValue placeholder="Select a department..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/80 rounded-xl">
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)} className="cursor-pointer">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Designation Name
              </Label>
              <Input
                id="desig-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="bg-midnight border-border rounded-xl text-sm"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-desc" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Description
              </Label>
              <Textarea
                id="desig-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g. Develops software applications"
                className="bg-midnight border-border rounded-xl text-sm min-h-20"
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
                disabled={isSubmitting || !formDepartmentId}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg font-sans">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm">
              This action cannot be undone. This will permanently delete the designation from the database.
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
