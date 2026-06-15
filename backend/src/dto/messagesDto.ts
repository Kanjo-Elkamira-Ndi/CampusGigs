import { z } from 'zod'

export const SendMessageSchema = z.object({
  text: z.string().min(1, 'Message text is required').max(5000),
  attachments: z.array(z.object({
    type: z.enum(['image', 'file']),
    url: z.string().url(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
  })).optional(),
})

export type SendMessageInput = z.infer<typeof SendMessageSchema>
