import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import * as authService from '../services/authService'
import * as usersService from '../services/usersService'

export const register = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.register(req.body)
  res.status(201).json(ApiResponse.success(result, 'Registration successful'))
})

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.login(req.body)
  res.json(ApiResponse.success(result, 'Login successful'))
})

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const user = await usersService.getUserById(req.user.id)
  res.json(ApiResponse.success(user, 'Profile retrieved'))
})
