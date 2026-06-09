import { Request, Response } from 'express'
import { asyncWrapper } from '../../utils/asyncWrapper'
import { ApiResponse } from '../../utils/ApiResponse'
import * as usersService from './users.service'

export const getMe = asyncWrapper(async (req, res) => {
  const user = await usersService.getUserById((req as any).user.id)
  res.json(ApiResponse.success(user))
})

export const getPublicProfile = asyncWrapper(async (req, res) => {
  const user = await usersService.getUserById(req.params.id)
  res.json(ApiResponse.success(user))
})

export const updateMe = asyncWrapper(async (req, res) => {
  const user = await usersService.updateProfile((req as any).user.id, req.body)
  res.json(ApiResponse.success(user, 'Profile updated'))
})