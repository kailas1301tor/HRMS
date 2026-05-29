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

interface EmploymentDetailsStepProps {
  isEditMode?: boolean
  dropdowns: DropdownData | null
}

export function EmploymentDetailsStep({ isEditMode = false, dropdowns }: EmploymentDetailsStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  const currentEmployeeType = watch('employee_type')
  const currentAccommodation = watch('accommodation')

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-border/40">
        <h3 className="text-sm font-semibold text-cloud">Employment Details</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-joined-date" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Joined Date
          </Label>
          <Input
            {...register('joined_date')}
            id="emp-joined-date"
            type="date"
            className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300"
            required
          />
          {errors.joined_date && <p className="text-xs text-destructive">{errors.joined_date.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Employee Type
          </Label>
          <Select
            value={currentEmployeeType}
            onValueChange={(val) => setValue('employee_type', val)}
          >
            <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.employee_types.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employee_type && <p className="text-xs text-destructive">{errors.employee_type.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-basic-salary" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Basic Salary (USD)
          </Label>
          <Input
            {...register('basic_salary')}
            id="emp-basic-salary"
            type="number"
            step="0.01"
            placeholder="e.g. 5000.00"
            className="bg-midnight/55 border-border rounded-xl text-sm"
            required
          />
          {errors.basic_salary && <p className="text-xs text-destructive">{errors.basic_salary.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Accommodation
          </Label>
          <Select
            value={currentAccommodation}
            onValueChange={(val) => setValue('accommodation', val)}
          >
            <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300">
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.accommodation_choices.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accommodation && <p className="text-xs text-destructive">{errors.accommodation.message}</p>}
        </div>
      </div>
    </div>
  )
}
