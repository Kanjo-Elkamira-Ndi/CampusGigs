import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { query, queryOne } from '../lib/db'
import { getIO } from '../lib/socket'
import * as messagesService from '../services/messagesService'

export const listThreads = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const threads = await messagesService.listThreads(req.user.id)
  res.json(ApiResponse.success(threads, 'Threads retrieved'))
})

export const getThread = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const thread = await messagesService.getThread(req.params.threadId as string, req.user.id)
  res.json(ApiResponse.success(thread, 'Thread retrieved'))
})

export const sendMessage = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const message = await messagesService.sendMessage(req.params.threadId as string, req.user.id, req.body)

  // Broadcast via socket so the other participant gets real-time update
  try {
    const io = getIO()
    io.to(`thread:${req.params.threadId}`).emit('message:received', message)

    // Send notification to other participant's personal room
    const app = await queryOne<{ worker_id: string }>(
      'SELECT worker_id FROM applications WHERE id = $1',
      [req.params.threadId]
    )
    if (app) {
      const [gig] = await query<{ poster_id: string }>(
        'SELECT poster_id FROM gigs WHERE id = (SELECT gig_id FROM applications WHERE id = $1)',
        [req.params.threadId]
      )
      if (gig) {
        const otherUserId = gig.poster_id === req.user.id ? app.worker_id : gig.poster_id
        io.to(`user:${otherUserId}`).emit('message:notification', {
          threadId: req.params.threadId,
          fromUserId: req.user.id,
          text: message.text,
          sentAt: message.sentAt,
        })
      }
    }
  } catch {}

  res.status(201).json(ApiResponse.success(message, 'Message sent'))
})
