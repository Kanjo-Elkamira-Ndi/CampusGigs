import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import * as applicationsService from '../services/applicationsService'

export const createApplication = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const result = await applicationsService.createApplication(req.params.id as string, req.user.id, req.body)
  res.status(201).json(ApiResponse.success(result, 'Application submitted'))
})

export const listGigApplications = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const result = await applicationsService.listGigApplications(req.params.id as string, req.user.id)
  res.json(ApiResponse.success(result, `${result.length} applications retrieved`))
})
