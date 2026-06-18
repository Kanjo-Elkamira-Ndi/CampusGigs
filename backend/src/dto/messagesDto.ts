import { z } from 'zod'

const AttachmentSchema = z.object({
  type: z.enum(['image', 'file', 'voice']),
  url: z.string().url(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  fileType: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const SendMessageSchema = z.object({
  text: z.string().min(1, 'Message text is required').max(5000),
  attachments: z.array(AttachmentSchema).optional(),
  isVoice: z.boolean().optional(),
  replyToId: z.string().uuid().optional(),
})

export type SendMessageInput = z.infer<typeof SendMessageSchema>
