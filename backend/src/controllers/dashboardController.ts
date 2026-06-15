import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import * as dashboardService from '../services/dashboardService'

export const workerDashboard = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const data = await dashboardService.getWorkerDashboard(req.user.id)
  res.json(ApiResponse.success(data, 'Worker dashboard retrieved'))
})

export const posterDashboard = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const data = await dashboardService.getPosterDashboard(req.user.id)
  res.json(ApiResponse.success(data, 'Poster dashboard retrieved'))
})
