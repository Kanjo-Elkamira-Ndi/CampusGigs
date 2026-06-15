import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import * as reviewsService from '../services/reviewsService'

export const createReview = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  const result = await reviewsService.createReview(req.user.id, req.body)
  res.status(201).json(ApiResponse.success(result, 'Review created'))
})
