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

export const verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.body.email)
  res.json(ApiResponse.success(null, 'Email verified successfully'))
})

export const resendVerification = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  await authService.resendVerification(req.user.id)
  res.json(ApiResponse.success(null, 'Verification email sent'))
})

export const logout = asyncWrapper(async (_req: Request, res: Response) => {
  await authService.logout()
  res.json(ApiResponse.success(null, 'Logged out successfully'))
})

export const changePassword = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  await authService.changePassword(req.user.id, req.body)
  res.json(ApiResponse.success(null, 'Password changed successfully'))
})

export const deleteAccount = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  await authService.deleteAccount(req.user.id)
  res.json(ApiResponse.success(null, 'Account deleted successfully'))
})

export const refresh = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.refreshToken(req.body.refreshToken)
  res.json(ApiResponse.success(result, 'Token refreshed successfully'))
})

export const forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email)
  res.json(ApiResponse.success(null, 'If an account with that email exists, a reset link has been sent'))
})

export const resetPassword = asyncWrapper(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body)
  res.json(ApiResponse.success(null, 'Password reset successfully'))
})

export const signOutAll = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  await authService.signOutAll(req.user.id)
  res.json(ApiResponse.success(null, 'Signed out of all sessions'))
})
