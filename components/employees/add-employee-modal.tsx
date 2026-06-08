// components/employees/add-employee-modal.tsx
'use client'

import { FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { type DropdownData } from '@/services/employee-service'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import type { Employee } from './employee-table'
import { BasicInfoStep } from './wizard/basic-info-step'
import { EmploymentDetailsStep } from './wizard/employment-details-step'
import { PersonalInfoStep } from './wizard/personal-info-step'
import { BankInfoStep } from './wizard/bank-info-step'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAddEmployeeModal } from './useAddEmployeeModal'

interface AddEmployeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (employee: Employee) => void
  editEmployee?: Employee | null
}

export function AddEmployeeModal({ open, onOpenChange, onSuccess, editEmployee }: AddEmployeeModalProps) {
  const {
    addStep,
    isLoading,
    dropdowns,
    isEditMode,
    methods,
    setAddStep,
    onSubmit,
    handleNextStep,
  } = useAddEmployeeModal(open, onOpenChange, onSuccess, editEmployee)

  const { handleSubmit } = methods

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border border-border/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg font-sans">
            {isEditMode ? 'Edit Employee Details' : 'Add Employee'}
          </DialogTitle>
          <div className="flex items-center gap-1.5 pt-2">
            {[1, 2, 3, 4].map(s => (
              <span key={s} className={cn('h-1.5 flex-1 rounded-full', addStep >= s ? 'bg-violet-core' : 'bg-slate-700')} />
            ))}
          </div>
          <p className="text-xs text-slate-400">Step {addStep} of 4</p>
        </DialogHeader>

        {isLoading && !dropdowns ? (
          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/4 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-xl mt-4" />
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit, (fieldErrors) => {
                console.warn('Form validation errors:', fieldErrors)
                const errMsgs = Object.entries(fieldErrors)
                  .map(([key, fieldError]) => {
                    const message = fieldError?.message
                    return `${key}: ${typeof message === 'string' ? message : 'Invalid field'}`
                  })
                  .join(', ')
                toast.error('Form validation failed. Please check all steps.', {
                  description: errMsgs,
                })
              })}
              className="space-y-4 pt-4"
              autoComplete="off"
            >
              {addStep === 1 && <BasicInfoStep isEditMode={isEditMode} dropdowns={dropdowns} />}
              {addStep === 2 && <EmploymentDetailsStep isEditMode={isEditMode} dropdowns={dropdowns} />}
              {addStep === 3 && <PersonalInfoStep isEditMode={isEditMode} dropdowns={dropdowns} />}
              {addStep === 4 && <BankInfoStep />}

              <DialogFooter className="flex items-center justify-between pt-4 border-t border-border/40">
                {addStep > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setAddStep(addStep - 1)} className="h-10 rounded-xl" disabled={isLoading}>
                    Back
                  </Button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="h-10 rounded-xl" disabled={isLoading}>Cancel</Button>
                  </DialogClose>
                  {addStep === 4 ? (
                    <Button type="submit" className="h-10 bg-primary text-primary-foreground font-semibold rounded-xl px-5 flex items-center gap-2" disabled={isLoading}>
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isLoading ? 'Saving...' : isEditMode ? 'Update Details' : 'Add Employee'}
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleNextStep} className="h-10 bg-primary text-primary-foreground font-semibold rounded-xl px-5">
                      Next
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  )
}
