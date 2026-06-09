import { z } from 'zod'

export const UpdateProfileDto = z.object({
  fullName: z.string().min(2).max(80).optional(),
  avatarUrl: z.string().url().optional(),
  universityId: z.string().uuid().optional(),
  bio: z.string().max(500).optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileDto>