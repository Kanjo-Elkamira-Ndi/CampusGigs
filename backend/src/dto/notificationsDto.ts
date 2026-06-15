import { z } from 'zod'

export const ListNotificationsSchema = z.object({
  unreadOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
})

export const MarkNotifReadSchema = z.object({
  read: z.boolean(),
})

export type ListNotificationsInput = z.infer<typeof ListNotificationsSchema>
export type MarkNotifReadInput = z.infer<typeof MarkNotifReadSchema>
