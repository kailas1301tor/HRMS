import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EmployeeInput } from '@/validations/employee.schema'
import type { DropdownData } from '@/services/employee-service'

interface BasicInfoStepProps {
  isEditMode?: boolean
  dropdowns: DropdownData | null
}

export function BasicInfoStep({ isEditMode = false, dropdowns }: BasicInfoStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  const currentRole = watch('role')
  const currentDepartment = watch('department')
  const currentDesignation = watch('designation')
  const currentStatus = watch('status')
  const currentShift = watch('shift')

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-border/40">
        <h3 className="text-sm font-semibold text-cloud">Basic Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-full-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Full Name
          </Label>
          <Input
            {...register('full_name')}
            id="emp-full-name"
            placeholder="Enter Full Name"
            className="bg-midnight/55 border-border rounded-xl text-sm"
            required
          />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-username" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Username
          </Label>
          <Input
            {...register('username')}
            id="emp-username"
            placeholder="e.g. johndoe"
            className="bg-midnight/55 border-border rounded-xl text-sm"
            required
            disabled={isEditMode}
            autoComplete="off"
          />
          {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Email Address
        </Label>
        <Input
          {...register('email')}
          id="emp-email"
          type="email"
          placeholder="name@company.com"
          className="bg-midnight/55 border-border rounded-xl text-sm"
          required
          autoComplete="off"
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-phone" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Phone Number
          </Label>
          <Input
            {...register('phone_number')}
            id="emp-phone"
            placeholder="e.g. 1234567890"
            className="bg-midnight/55 border-border rounded-xl text-sm"
            required
          />
          {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-id" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Employee ID
          </Label>
          <Input
            {...register('employee_id')}
            id="emp-id"
            placeholder="e.g. EMP001"
            className="bg-midnight/55 border-border rounded-xl text-sm"
            required
            disabled={isEditMode}
          />
          {errors.employee_id && <p className="text-xs text-destructive">{errors.employee_id.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Role
          </Label>
          <Select
            value={currentRole}
            onValueChange={(val) => setValue('role', val)}
          >
            <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.roles.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Department
          </Label>
          <Select
            value={currentDepartment}
            onValueChange={(val) => setValue('department', val)}
          >
            <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.departments.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Designation
          </Label>
          <Select
            value={currentDesignation}
            onValueChange={(val) => setValue('designation', val)}
          >
            <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300">
              <SelectValue placeholder="Select Designation" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.designations
                .filter((item) => !currentDepartment || !item.department_id || String(item.department_id) === currentDepartment)
                .map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.designation && <p className="text-xs text-destructive">{errors.designation.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Status
          </Label>
          <Select
            value={currentStatus}
            onValueChange={(val) => setValue('status', val)}
          >
            <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.status_choices.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Shift
        </Label>
        <Select
          value={currentShift}
          onValueChange={(val) => setValue('shift', val)}
        >
          <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300">
            <SelectValue placeholder="Select Shift" />
          </SelectTrigger>
          <SelectContent>
            {dropdowns?.shifts.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.shift && <p className="text-xs text-destructive">{errors.shift.message}</p>}
      </div>
    </div>
  )
}
