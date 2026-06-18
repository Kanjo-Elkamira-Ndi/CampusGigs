import { z } from 'zod'

export const CreateUniversityRequestSchema = z.object({
  name: z.string().min(2, 'University name must be at least 2 characters').max(200),
  city: z.string().max(100).optional(),
}).strict()

export const ReviewUniversityRequestSchema = z.object({
  action: z.enum(['APPROVED', 'REJECTED']),
}).strict()

export type CreateUniversityRequestInput = z.infer<typeof CreateUniversityRequestSchema>
export type ReviewUniversityRequestInput = z.infer<typeof ReviewUniversityRequestSchema>
