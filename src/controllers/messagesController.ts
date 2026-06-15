import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
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
  res.status(201).json(ApiResponse.success(message, 'Message sent'))
})
