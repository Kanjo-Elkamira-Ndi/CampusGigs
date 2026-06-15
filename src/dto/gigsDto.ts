import { z } from 'zod'

export const ListGigsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  universityId: z.string().optional(),
  minBudget: z.coerce.number().min(0).optional(),
  maxBudget: z.coerce.number().min(0).optional(),
  status: z.string().optional(),
  posterId: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
})

export type ListGigsInput = z.infer<typeof ListGigsSchema>

export const CreateGigSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  location: z.string().min(2, 'Location is required'),
  budget: z.coerce.number().min(500, 'Minimum budget is 500'),
  slots: z.coerce.number().int().min(1).max(10).optional().default(1),
  deadline: z.string().min(1, 'Deadline is required'),
  universityId: z.string().optional(),
  isEasyApply: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional(),
})

export type CreateGigInput = z.infer<typeof CreateGigSchema>

export const UpdateGigSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(2000).optional(),
  category: z.string().optional(),
  location: z.string().min(2).optional(),
  budget: z.coerce.number().min(500).optional(),
  slots: z.coerce.number().int().min(1).max(10).optional(),
  deadline: z.string().optional(),
  universityId: z.string().optional(),
  isEasyApply: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
}).strict()

export type UpdateGigInput = z.infer<typeof UpdateGigSchema>
