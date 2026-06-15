import { z } from 'zod'

export const CreateApplicationSchema = z.object({
  coverNote: z.string().min(10, 'Cover note must be at least 10 characters'),
})

export const ListApplicationsSchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
})

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>
export type ListApplicationsInput = z.infer<typeof ListApplicationsSchema>

export const RejectApplicationSchema = z.object({
  reason: z.string().optional(),
})

export type RejectApplicationInput = z.infer<typeof RejectApplicationSchema>

export const CreateReviewSchema = z.object({
  gigId: z.string().uuid(),
  revieweeId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
})

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>
