import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { env } from '../config/env'
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.errors)
    )
  }
  console.error('Unhandled error:', err)
  return res.status(500).json(
    ApiResponse.error(
      env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    )
  )
}