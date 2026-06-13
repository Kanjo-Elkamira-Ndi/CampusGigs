import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import * as notificationsService from '../services/notificationsService'

export const list = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const result = await notificationsService.listNotifications(req.user.id, req.query as any)
  res.json(ApiResponse.success(result, 'Notifications retrieved'))
})

export const markRead = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const updated = await notificationsService.markNotificationRead(req.params.id as string, req.user.id, req.body.read)
  res.json(ApiResponse.success(updated, 'Notification updated'))
})

export const markAllRead = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  await notificationsService.markAllRead(req.user.id)
  res.json(ApiResponse.success(null, 'All notifications marked as read'))
})

export const unreadCount = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const result = await notificationsService.getUnreadCount(req.user.id)
  res.json(ApiResponse.success(result, 'Unread count retrieved'))
})
