// components/employees/add-employee-modal.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { employeeService, type DropdownData, type DropdownItem } from '@/services/employee-service'
import { employeeSchema, type EmployeeInput } from '@/validations/employee.schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import type { Employee } from './employee-table'
import { BasicInfoStep } from './wizard/basic-info-step'
import { EmploymentDetailsStep } from './wizard/employment-details-step'
import { PersonalInfoStep } from './wizard/personal-info-step'
import { BankInfoStep } from './wizard/bank-info-step'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface AddEmployeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (employee: Employee) => void
  editEmployee?: Employee | null
}

const defaultValues: EmployeeInput = {
  id: '', username: '', email: '', password: '', full_name: '', phone_number: '', role: '2',
  department: '1', designation: '1', employee_id: '', status: 'Active', shift: '1',
  joined_date: new Date().toISOString().split('T')[0], employee_type: '1',
  basic_salary: '', accommodation: 'Not provided', date_of_birth: '', nationality: '1', address: '',
  bank_name: '', account_number: '', ifsc: '', branch: '',
}

export function AddEmployeeModal({ open, onOpenChange, onSuccess, editEmployee }: AddEmployeeModalProps) {
  const [addStep, setAddStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [dropdowns, setDropdowns] = useState<DropdownData | null>(null)
  const isEditMode = !!editEmployee

  const methods = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  const { reset, watch, handleSubmit } = methods

  useEffect(() => {
    if (!open) return
    setAddStep(1)
    setDropdowns(null)
    
    async function initForm() {
      setIsLoading(true)
      try {
        const data = await employeeService.getDropdowns()
        setDropdowns(data)
        
        const findIdByName = (list: DropdownItem[] | undefined, name: string): string => {
          if (!list || !name) return list?.[0] ? String(list[0].id) : ''
          const match = list.find(item => item.name.toLowerCase() === name.toLowerCase())
          return match ? String(match.id) : (list[0] ? String(list[0].id) : '')
        }

        if (editEmployee) {
          reset({
            id: String(editEmployee.id),
            username: editEmployee.user?.username || '',
            email: editEmployee.user?.email || '',
            password: '',
            full_name: editEmployee.full_name,
            phone_number: editEmployee.phone_number,
            role: editEmployee.role_name ? findIdByName(data.roles, editEmployee.role_name) : String(editEmployee.role),
            department: findIdByName(data.departments, editEmployee.department),
            designation: findIdByName(data.designations, editEmployee.designation),
            employee_id: editEmployee.employee_id,
            status: editEmployee.status,
            shift: findIdByName(data.shifts, editEmployee.shift),
            joined_date: editEmployee.joined_date ? editEmployee.joined_date.split('T')[0] : '',
            employee_type: findIdByName(data.employee_types, editEmployee.employee_type),
            basic_salary: editEmployee.basic_salary,
            accommodation: editEmployee.accommodation,
            date_of_birth: editEmployee.date_of_birth ? editEmployee.date_of_birth.split('T')[0] : '',
            nationality: findIdByName(data.nationalities, editEmployee.nationality),
            address: editEmployee.address,
            bank_name: editEmployee.bank_details?.bank_name || '',
            account_number: editEmployee.bank_details?.account_number || '',
            ifsc: editEmployee.bank_details?.ifsc || '',
            branch: editEmployee.bank_details?.branch || '',
          })
        } else {
          reset({
            id: '', username: '', email: '', password: '', full_name: '', phone_number: '',
            role: data.roles[0] ? String(data.roles[0].id) : '2',
            department: data.departments[0] ? String(data.departments[0].id) : '1',
            designation: data.designations[0] ? String(data.designations[0].id) : '1',
            employee_id: '', status: 'Active',
            shift: data.shifts[0] ? String(data.shifts[0].id) : '1',
            joined_date: new Date().toISOString().split('T')[0],
            employee_type: data.employee_types[0] ? String(data.employee_types[0].id) : '1',
            basic_salary: '', accommodation: 'Not provided', date_of_birth: '',
            nationality: data.nationalities[0] ? String(data.nationalities[0].id) : '1',
            address: '', bank_name: '', account_number: '', ifsc: '', branch: '',
          })
        }
      } catch (err) {
        toast.error('Failed to load form options')
      } finally {
        setIsLoading(false)
      }
    }
    
    initForm()
  }, [open, reset, editEmployee])

  const onSubmit = async (data: EmployeeInput) => {
    setIsLoading(true)
    try {
      const payload: any = {
        username: data.username.trim(),
        email: data.email.trim(),
        full_name: data.full_name.trim(),
        phone_number: data.phone_number.trim(),
        role: Number(data.role),
        department: Number(data.department),
        designation: Number(data.designation),
        employee_id: data.employee_id.trim(),
        status: data.status,
        shift: Number(data.shift),
        joined_date: data.joined_date,
        employee_type: Number(data.employee_type),
        basic_salary: data.basic_salary,
        accommodation: data.accommodation,
        date_of_birth: data.date_of_birth,
        nationality: Number(data.nationality),
        address: data.address.trim(),
        bank_details: {
          bank_name: data.bank_name.trim(),
          account_number: data.account_number.trim(),
          ifsc: data.ifsc.trim(),
          branch: data.branch.trim(),
        }
      }

      if (!isEditMode) {
        payload.password = data.password?.trim() || 'securepassword123'
      }

      if (isEditMode && editEmployee) {
        const updated = await employeeService.updateEmployee({ ...payload, id: Number(editEmployee.id) })
        toast.success('Employee updated successfully')
        onSuccess(updated)
      } else {
        const created = await employeeService.createEmployee(payload)
        toast.success('Employee created successfully')
        onSuccess(created)
      }
      onOpenChange(false)
    } catch (err: any) {
      toast.error(isEditMode ? 'Failed to update employee' : 'Failed to create employee', {
        description: err.message || 'Validation error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault()
    const fields = [
      ['full_name', 'username', 'email', 'password', 'phone_number', 'employee_id', 'role', 'department', 'designation', 'status', 'shift'],
      ['basic_salary', 'joined_date', 'employee_type', 'accommodation'],
      ['date_of_birth', 'nationality', 'address']
    ][addStep - 1]
    
    if (fields) {
      const fieldsToValidate = fields.filter(f => !(f === 'password' && isEditMode))
      const isValid = await methods.trigger(fieldsToValidate as any)
      if (!isValid) return
    }
    setAddStep(addStep + 1)
  }

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
          <div className="space-y-5 py-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-3 w-1/4 bg-slate-700/80 rounded" />
              <div className="h-10 bg-slate-800/80 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-1/3 bg-slate-700/80 rounded" />
                <div className="h-10 bg-slate-800/80 rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-1/3 bg-slate-700/80 rounded" />
                <div className="h-10 bg-slate-800/80 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-1/3 bg-slate-700/80 rounded" />
                <div className="h-10 bg-slate-800/80 rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-1/3 bg-slate-700/80 rounded" />
                <div className="h-10 bg-slate-800/80 rounded-xl" />
              </div>
            </div>
            <div className="h-20 bg-slate-800/80 rounded-xl mt-4" />
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit, (errors) => {
                console.warn('Form validation errors:', errors)
                const errMsgs = Object.keys(errors)
                  .map((key) => {
                    const error = errors[key as keyof typeof errors] as any
                    return `${key}: ${error?.message || 'Invalid field'}`
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
