// validations/auth.schema.ts
import * as z from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username or Email is required' }).trim(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export type LoginValues = z.infer<typeof loginSchema>
