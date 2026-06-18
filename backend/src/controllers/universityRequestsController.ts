import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import * as universityRequestsService from '../services/universityRequestsService'

export const createRequest = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const request = await universityRequestsService.createRequest(req.user.id, req.body)
  res.status(201).json(ApiResponse.success(request, 'University request submitted'))
})

export const getMyRequest = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const request = await universityRequestsService.getMyRequest(req.user.id)
  res.json(ApiResponse.success(request, 'University request retrieved'))
})

export const listRequests = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.admin) throw new ApiError(401, 'Unauthenticated')
  const status = req.query.status as string | undefined
  const requests = await universityRequestsService.listRequests(status)
  res.json(ApiResponse.success(requests, `${requests.length} request(s) retrieved`))
})

export const approveRequest = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.admin) throw new ApiError(401, 'Unauthenticated')
  await universityRequestsService.approveRequest(req.params.id as string, req.admin.id)
  res.json(ApiResponse.success(null, 'University request approved'))
})

export const rejectRequest = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.admin) throw new ApiError(401, 'Unauthenticated')
  await universityRequestsService.rejectRequest(req.params.id as string, req.admin.id)
  res.json(ApiResponse.success(null, 'University request rejected'))
})
