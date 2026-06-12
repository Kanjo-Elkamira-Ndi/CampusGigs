import { Request, Response, NextFunction } from 'express'
import { auth } from '../lib/betterAuth'
import { fromNodeHeaders } from 'better-auth/node'
import { ApiError } from '../utils/ApiError'
import { asyncWrapper } from '../utils/asyncWrapper'

export const authGuard = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    if (!session?.user) {
      throw new ApiError(401, 'Unauthenticated — please log in')
    }

    if ((session.user as any).isBanned) {
      throw new ApiError(403, 'Your account has been banned')
    }

    req.user = session.user as any
    next()
  }
)
