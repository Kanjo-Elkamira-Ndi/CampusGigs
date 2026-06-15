import { z } from 'zod'

export const UpdateProfileDto = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80).optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  universityId: z.string().min(1, 'University ID is required').optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  availability: z.string().optional(),
  experienceLevel: z.string().optional(),
  remoteAvailable: z.boolean().optional(),
}).strict()

export type UpdateProfileInput = z.infer<typeof UpdateProfileDto>
