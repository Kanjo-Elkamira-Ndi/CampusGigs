import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'

export const requireRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (!user) throw new ApiError(401, 'Unauthenticated')
    if (!roles.includes(user.role)) throw new ApiError(403, 'Forbidden')
    next()
  }