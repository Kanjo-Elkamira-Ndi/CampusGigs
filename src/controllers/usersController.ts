import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import * as usersService from '../services/usersService'

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const user = await usersService.getUserById(req.user.id)
  res.json(ApiResponse.success(user, 'Profile retrieved'))
})

export const updateMe = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const updated = await usersService.updateProfile(req.user.id, req.body)
  res.json(ApiResponse.success(updated, 'Profile updated successfully'))
})

export const getPublicProfile = asyncWrapper(async (req: Request, res: Response) => {
  const user = await usersService.getUserPublicProfile(req.params.id as string)
  res.json(ApiResponse.success(user, 'Public profile retrieved'))
})
