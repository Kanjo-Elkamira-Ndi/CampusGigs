import { z } from 'zod'

export const UpdateProfileDto = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80).optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  universityId: z.string().uuid('Invalid university ID').optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
}).strict()

export type UpdateProfileInput = z.infer<typeof UpdateProfileDto>
