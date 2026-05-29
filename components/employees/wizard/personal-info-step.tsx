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

interface PersonalInfoStepProps {
  isEditMode?: boolean
  dropdowns: DropdownData | null
}

export function PersonalInfoStep({ isEditMode = false, dropdowns }: PersonalInfoStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  const currentNationality = watch('nationality')

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-border/40">
        <h3 className="text-sm font-semibold text-cloud">Personal Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-dob" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Date of Birth
          </Label>
          <Input
            {...register('date_of_birth')}
            id="emp-dob"
            type="date"
            className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300"
            required
          />
          {errors.date_of_birth && <p className="text-xs text-destructive">{errors.date_of_birth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Nationality
          </Label>
          <Select
            value={currentNationality}
            onValueChange={(val) => setValue('nationality', val)}
          >
            <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm text-slate-300">
              <SelectValue placeholder="Select Nationality" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.nationalities.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationality && <p className="text-xs text-destructive">{errors.nationality.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-address" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Residential Address
        </Label>
        <Input
          {...register('address')}
          id="emp-address"
          placeholder="e.g. 123 Main St, Uptown"
          className="bg-midnight/55 border-border rounded-xl text-sm"
          required
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
      </div>
    </div>
  )
}
