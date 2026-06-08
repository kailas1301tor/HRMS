// components/documents/employee-document-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload, Plus } from 'lucide-react'
import type { Employee } from '@/components/employees/employee-table'
import { employeeDocumentUploadSchema, type EmployeeDocumentUploadInput } from '@/validations/document.schema'

interface EmployeeDocumentFormProps {
  employees: Employee[]
  documentTypes: { id: number; name: string }[]
  onSubmit: (data: EmployeeDocumentUploadInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function EmployeeDocumentForm({
  employees,
  documentTypes,
  onSubmit,
  onCancel,
  isSubmitting,
}: EmployeeDocumentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeDocumentUploadInput>({
    resolver: zodResolver(employeeDocumentUploadSchema),
    defaultValues: { employee: '', document_type: '', document_number: '', expiry_date: '', file: undefined },
  })

  const file = watch('file')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      {/* Employee Selection */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Employee</Label>
        <Select
          onValueChange={(val) => setValue('employee', val, { shouldValidate: true })}
        >
          <SelectTrigger className="w-full bg-midnight border-border text-xs text-slate-300">
            <SelectValue placeholder="Select employee..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={String(emp.id)}>
                {emp.full_name} ({emp.employee_id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.employee && (
          <p className="text-[11px] text-destructive font-medium">{errors.employee.message}</p>
        )}
      </div>

      {/* Document Type Selection */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Document Category</Label>
        <Select
          onValueChange={(val) => setValue('document_type', val, { shouldValidate: true })}
        >
          <SelectTrigger className="w-full bg-midnight border-border text-xs text-slate-300">
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            {documentTypes.map((type) => (
              <SelectItem key={type.id} value={String(type.id)}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.document_type && (
          <p className="text-[11px] text-destructive font-medium">{errors.document_type.message}</p>
        )}
      </div>

      {/* Document Number */}
      <div className="space-y-1.5">
        <Label htmlFor="doc_number" className="text-xs text-slate-400">Document Number</Label>
        <Input
          id="doc_number"
          placeholder="e.g. Passport/ID number"
          className="bg-midnight border-border text-xs h-10 rounded-xl"
          {...register('document_number')}
        />
        {errors.document_number && (
          <p className="text-[11px] text-destructive font-medium">{errors.document_number.message}</p>
        )}
      </div>

      {/* Expiry Date */}
      <div className="space-y-1.5">
        <Label htmlFor="expiry_date" className="text-xs text-slate-400">Expiry Date</Label>
        <Input
          id="expiry_date"
          type="date"
          className="bg-midnight border-border text-xs h-10 rounded-xl"
          {...register('expiry_date')}
        />
        {errors.expiry_date && (
          <p className="text-[11px] text-destructive font-medium">{errors.expiry_date.message}</p>
        )}
      </div>

      {/* File Dropzone */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-400">Select Document File</Label>
        <div className="flex flex-col items-center justify-center border border-dashed border-border/80 hover:border-violet-glow/65 rounded-xl p-6 bg-midnight/25 cursor-pointer relative group transition-colors">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const fileObj = e.target.files?.[0]
              if (fileObj) {
                setValue('file', fileObj, { shouldValidate: true })
              }
            }}
          />
          <Upload className="w-8 h-8 text-slate-500 group-hover:text-violet-glow mb-2 transition-colors" />
          <p className="text-xs font-semibold text-cloud text-center truncate w-full max-w-[280px]">
            {file ? file.name : 'Click to select / drop document'}
          </p>
          <p className="text-[10px] text-slate-500 text-center mt-1">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'PDF, JPG, PNG, DOCX up to 10MB'}
          </p>
        </div>
        {errors.file && (
          <p className="text-[11px] text-destructive font-medium">{errors.file.message as string}</p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-border/40 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl h-10 w-full text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-xl h-10 w-full text-xs"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...</>
          ) : (
            <><Plus className="w-4 h-4 mr-1.5" /> Add Document</>
          )}
        </Button>
      </div>
    </form>
  )
}
