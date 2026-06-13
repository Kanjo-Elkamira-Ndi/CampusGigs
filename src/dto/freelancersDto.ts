import { z } from 'zod'

export const ListFreelancersSchema = z.object({
  q: z.string().optional(),
  universityIds: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['rating', 'newest', 'rate-asc', 'rate-desc']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(12),
})

export type ListFreelancersInput = z.infer<typeof ListFreelancersSchema>
