import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { signAdminToken } from '../lib/superadminJwt'
import { env } from '../config/env'
import * as superadminService from '../services/superadminService'

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const result = await superadminService.login(req.body.email, req.body.password, req.ip)
  const token = signAdminToken({ id: result.id, email: result.email })

  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 4 * 60 * 60 * 1000,
  })

  res.json(ApiResponse.success({ admin: result }, 'Login successful'))
})

export const logout = asyncWrapper(async (req: Request, res: Response) => {
  if (req.admin) await superadminService.logout(req.admin.id)
  res.clearCookie('admin_token')
  res.json(ApiResponse.success(null, 'Logged out'))
})

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.admin) throw new ApiError(401, 'Unauthenticated')
  const admin = await superadminService.getMe(req.admin.id)
  res.json(ApiResponse.success(admin, 'Admin profile retrieved'))
})

export const getDashboard = asyncWrapper(async (_req: Request, res: Response) => {
  const data = await superadminService.getDashboard()
  res.json(ApiResponse.success(data, 'Dashboard data retrieved'))
})

export const listUsers = asyncWrapper(async (req: Request, res: Response) => {
  const result = await superadminService.listUsers(req.query as never)
  res.json(ApiResponse.success(result, `${result.total} users retrieved`))
})

export const updateUser = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.admin) throw new ApiError(401, 'Unauthenticated')
  const user = await superadminService.updateUser(req.params.id as string, req.body, req.admin.id)
  res.json(ApiResponse.success(user, 'User updated'))
})

export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.admin) throw new ApiError(401, 'Unauthenticated')
  await superadminService.deleteUser(req.params.id as string, req.admin.id)
  res.json(ApiResponse.success(null, 'User deleted'))
})

export const listGigs = asyncWrapper(async (req: Request, res: Response) => {
  const result = await superadminService.listGigs(req.query as never)
  res.json(ApiResponse.success(result, `${result.total} gigs retrieved`))
})

export const deleteGig = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.admin) throw new ApiError(401, 'Unauthenticated')
  await superadminService.deleteGig(req.params.id as string, req.admin.id)
  res.json(ApiResponse.success(null, 'Gig deleted'))
})

export const listAuditLogs = asyncWrapper(async (req: Request, res: Response) => {
  const result = await superadminService.listAuditLogs(req.query as never)
  res.json(ApiResponse.success(result, `${result.total} audit logs retrieved`))
})

export const listUniversities = asyncWrapper(async (_req: Request, res: Response) => {
  const data = await superadminService.listUniversities()
  res.json(ApiResponse.success(data, `${data.length} universities retrieved`))
})

export const createUniversity = asyncWrapper(async (req: Request, res: Response) => {
  const data = await superadminService.createUniversity(req.body)
  res.status(201).json(ApiResponse.success(data, 'University created'))
})

export const listReviews = asyncWrapper(async (req: Request, res: Response) => {
  const result = await superadminService.listReviews(req.query as never)
  res.json(ApiResponse.success(result, `${result.total} reviews retrieved`))
})

export const deleteReview = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.admin) throw new ApiError(401, 'Unauthenticated')
  await superadminService.deleteReview(req.params.id as string, req.admin.id)
  res.json(ApiResponse.success(null, 'Review deleted'))
})

export const listCategories = asyncWrapper(async (_req: Request, res: Response) => {
  const data = await superadminService.listCategories()
  res.json(ApiResponse.success(data, `${data.length} categories retrieved`))
})
