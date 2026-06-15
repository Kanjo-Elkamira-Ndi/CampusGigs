import { z } from 'zod'

export const ListUserReviewsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
})

export type ListUserReviewsInput = z.infer<typeof ListUserReviewsSchema>
