import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'

export const requireRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthenticated')
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied — required role: ${roles.join(' or ')}`
      )
    }
    next()
  }