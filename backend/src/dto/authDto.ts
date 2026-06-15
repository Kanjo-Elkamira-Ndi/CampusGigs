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

export const VerifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const ResendVerificationSchema = z.object({})

export const RefreshDto = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export const ForgotPasswordDto = z.object({
  email: z.string().email('Invalid email address'),
})

export const ResetPasswordDto = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type RegisterInput = z.infer<typeof RegisterDto>
export type LoginInput = z.infer<typeof LoginDto>
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>
export type RefreshInput = z.infer<typeof RefreshDto>
export type ChangePasswordInput = z.infer<typeof ChangePasswordDto>
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordDto>
export type ResetPasswordInput = z.infer<typeof ResetPasswordDto>
