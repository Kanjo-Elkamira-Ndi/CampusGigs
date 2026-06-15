import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { asyncWrapper } from '../utils/asyncWrapper'
import { verifyAdminToken } from '../lib/superadminJwt'

export const superadminGuard = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.admin_token
    if (!token) {
      throw new ApiError(401, 'Missing admin authentication token')
    }

    let payload: { sub: string; email: string; type: string }
    try {
      payload = verifyAdminToken(token)
    } catch {
      throw new ApiError(401, 'Invalid or expired admin token')
    }

    if (payload.type !== 'superadmin') {
      throw new ApiError(401, 'Invalid admin token')
    }

    req.admin = {
      id: payload.sub,
      email: payload.email,
      type: 'superadmin',
    }

    next()
  }
)
