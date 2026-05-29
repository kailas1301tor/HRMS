// validations/employee.schema.ts
import { z } from 'zod'

export const employeeSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(1, 'Username is required').max(150).trim(),
  email: z.string().min(1, 'Email is required').trim().email('Invalid email address'),
  password: z.string().optional(),
  full_name: z.string().min(1, 'Full name is required').max(100),
  phone_number: z.string().min(1, 'Phone number is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  employee_id: z.string().min(1, 'Employee ID is required'),
  status: z.string().min(1, 'Status is required'),
  shift: z.string().min(1, 'Shift is required'),
  joined_date: z.string().min(1, 'Joined date is required'),
  employee_type: z.string().min(1, 'Employee type is required'),
  basic_salary: z.string().min(1, 'Basic salary is required'),
  accommodation: z.string().min(1, 'Accommodation is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  address: z.string().min(1, 'Address is required'),
  
  // Bank details fields (flat inside form context, structured in API payload)
  bank_name: z.string().min(1, 'Bank name is required'),
  account_number: z.string().min(1, 'Account number is required'),
  ifsc: z.string().min(1, 'IFSC code is required'),
  branch: z.string().min(1, 'Branch is required'),
}).superRefine((data, ctx) => {
  // If id is not present (Create Mode), password is required and must be at least 6 characters
  if (!data.id) {
    if (!data.password || data.password.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password is required',
        path: ['password']
      })
    } else if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 6 characters long',
        path: ['password']
      })
    }
  }
})

export type EmployeeInput = z.infer<typeof employeeSchema>
