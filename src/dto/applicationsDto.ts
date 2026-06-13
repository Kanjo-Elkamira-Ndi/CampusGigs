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
