import { z } from 'zod'

export const RegisterDto = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['WORKER', 'POSTER']).default('WORKER'),
  universityId: z.string().min(1, 'University is required'),
})

export const LoginDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof RegisterDto>
export type LoginInput = z.infer<typeof LoginDto>
