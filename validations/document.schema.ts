// validations/document.schema.ts
import { z } from 'zod';

export const employeeDocumentUploadSchema = z.object({
  employee: z.string().min(1, 'Employee is required'),
  document_type: z.string().min(1, 'Document type is required'),
  document_number: z.string().min(1, 'Document number is required').max(50).trim(),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  file: z
    .any()
    .refine((val) => val instanceof File || (val && typeof val === 'object'), 'Document file is required'),
});

export const companyDocumentUploadSchema = z.object({
  company_document_type: z.string().min(1, 'Document type is required'),
  branch: z.string().min(1, 'Branch is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  file: z
    .any()
    .refine((val) => val instanceof File || (val && typeof val === 'object'), 'Document file is required'),
});

export type EmployeeDocumentUploadInput = z.infer<typeof employeeDocumentUploadSchema>;
export type CompanyDocumentUploadInput = z.infer<typeof companyDocumentUploadSchema>;
