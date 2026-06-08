// components/documents/company-document-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload, Plus } from 'lucide-react'
import { companyDocumentUploadSchema, type CompanyDocumentUploadInput } from '@/validations/document.schema'

interface CompanyDocumentFormProps {
  branches: { id: number; name: string }[]
  documentTypes: { id: number; name: string }[]
  onSubmit: (data: CompanyDocumentUploadInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function CompanyDocumentForm({
  branches,
  documentTypes,
  onSubmit,
  onCancel,
  isSubmitting,
}: CompanyDocumentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyDocumentUploadInput>({
    resolver: zodResolver(companyDocumentUploadSchema),
    defaultValues: { company_document_type: '', branch: '', issue_date: '', expiry_date: '', file: undefined },
  })

  const file = watch('file')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      {/* Company Document Category */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Document Category</Label>
        <Select
          onValueChange={(val) => setValue('company_document_type', val, { shouldValidate: true })}
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
        {errors.company_document_type && (
          <p className="text-[11px] text-destructive font-medium">{errors.company_document_type.message}</p>
        )}
      </div>

      {/* Branch Selection */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Branch</Label>
        <Select
          onValueChange={(val) => setValue('branch', val, { shouldValidate: true })}
        >
          <SelectTrigger className="w-full bg-midnight border-border text-xs text-slate-300">
            <SelectValue placeholder="Select branch..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            {branches.map((b) => (
              <SelectItem key={b.id} value={String(b.id)}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.branch && (
          <p className="text-[11px] text-destructive font-medium">{errors.branch.message}</p>
        )}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="issue_date" className="text-xs text-slate-400">Issue Date</Label>
          <Input
            id="issue_date"
            type="date"
            className="bg-midnight border-border text-xs h-10 rounded-xl"
            {...register('issue_date')}
          />
          {errors.issue_date && (
            <p className="text-[11px] text-destructive font-medium">{errors.issue_date.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company_expiry_date" className="text-xs text-slate-400">Expiry Date</Label>
          <Input
            id="company_expiry_date"
            type="date"
            className="bg-midnight border-border text-xs h-10 rounded-xl"
            {...register('expiry_date')}
          />
          {errors.expiry_date && (
            <p className="text-[11px] text-destructive font-medium">{errors.expiry_date.message}</p>
          )}
        </div>
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
