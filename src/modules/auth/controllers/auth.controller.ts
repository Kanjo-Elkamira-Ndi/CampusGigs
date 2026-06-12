import { Request, Response } from 'express'
import { asyncWrapper } from '../../../utils/asyncWrapper'
import { ApiResponse } from '../../../utils/ApiResponse'
import * as authService from '../services/auth.service'

export const register = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.register(req.body)
  res.status(201).json(ApiResponse.success(result, 'Registration successful'))
})

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.login(req.body)
  res.json(ApiResponse.success(result, 'Login successful'))
})
