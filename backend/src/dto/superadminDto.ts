import { z } from 'zod'

export const SuperAdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const UpdateUserSchema = z.object({
  isBanned: z.boolean().optional(),
  role: z.enum(['WORKER', 'POSTER', 'ADMIN']).optional(),
  emailVerified: z.boolean().optional(),
  fullName: z.string().min(2).max(80).optional(),
  universityId: z.string().optional(),
}).strict()

export const CreateUniversitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  type: z.enum(['public', 'private']),
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type CreateUniversityInput = z.infer<typeof CreateUniversitySchema>
