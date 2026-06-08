// components/employees/useAddEmployeeModal.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employeeService, type DropdownData, type DropdownItem, type CreateEmployeePayload } from '@/services/employee-service'
import { employeeSchema, type EmployeeInput } from '@/validations/employee.schema'
import type { Employee } from './employee-table'
import { toast } from 'sonner'

export interface UseAddEmployeeModalReturn {
  addStep: number
  isLoading: boolean
  dropdowns: DropdownData | null
  isEditMode: boolean
  methods: UseFormReturn<EmployeeInput>
  setAddStep: (step: number) => void
  onSubmit: (data: EmployeeInput) => Promise<void>
  handleNextStep: (e: React.MouseEvent) => Promise<void>
}

const defaultValues: EmployeeInput = {
  id: '', username: '', email: '', full_name: '', phone_number: '', role: '2',
  department: '1', designation: '1', employee_id: '', status: 'Active', shift: '1',
  joined_date: new Date().toISOString().split('T')[0], employee_type: '1',
  basic_salary: '', accommodation: 'Not provided', date_of_birth: '', nationality: '1', address: '',
  bank_name: '', account_number: '', ifsc: '', branch: '',
}

const findIdByName = (list: DropdownItem[] | undefined, name: string): string => {
  if (!list || !name) return list?.[0] ? String(list[0].id) : ''
  const match = list.find(item => item.name.toLowerCase() === name.toLowerCase())
  return match ? String(match.id) : (list[0] ? String(list[0].id) : '')
}

function getFormValuesFromEmployee(editEmployee: Employee, data: DropdownData): EmployeeInput {
  return {
    id: String(editEmployee.id),
    username: editEmployee.user?.username || '',
    email: editEmployee.user?.email || '',
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
  }
}

function getDefaultFormValues(data: DropdownData): EmployeeInput {
  return {
    id: '', username: '', email: '', full_name: '', phone_number: '',
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
  }
}

export function useAddEmployeeModal(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: (employee: Employee) => void,
  editEmployee: Employee | null | undefined
): UseAddEmployeeModalReturn {
  const [addStep, setAddStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [dropdowns, setDropdowns] = useState<DropdownData | null>(null)
  const isEditMode = !!editEmployee

  const methods = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  const { reset } = methods

  useEffect(() => {
    if (!open) return
    setAddStep(1)
    setDropdowns(null)
    
    const controller = new AbortController()

    async function initForm() {
      setIsLoading(true)
      try {
        const data = await employeeService.getDropdowns(controller.signal)
        setDropdowns(data)
        
        if (editEmployee) {
          reset(getFormValuesFromEmployee(editEmployee, data))
        } else {
          reset(getDefaultFormValues(data))
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        toast.error('Failed to load form options')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }
    
    initForm()

    return () => {
      controller.abort()
    }
  }, [open, reset, editEmployee])

  const onSubmit = async (data: EmployeeInput) => {
    setIsLoading(true)
    try {
      const payload: CreateEmployeePayload = {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Validation error'
      toast.error(isEditMode ? 'Failed to update employee' : 'Failed to create employee', {
        description: msg
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault()
    const fields = [
      ['full_name', 'username', 'email', 'phone_number', 'employee_id', 'role', 'department', 'designation', 'status', 'shift'],
      ['basic_salary', 'joined_date', 'employee_type', 'accommodation'],
      ['date_of_birth', 'nationality', 'address']
    ][addStep - 1]
    
    if (fields) {
      const fieldsToValidate = fields as Path<EmployeeInput>[]
      const isValid = await methods.trigger(fieldsToValidate)
      if (!isValid) return
    }
    setAddStep(addStep + 1)
  }

  return {
    addStep,
    isLoading,
    dropdowns,
    isEditMode,
    methods,
    setAddStep,
    onSubmit,
    handleNextStep,
  }
}
