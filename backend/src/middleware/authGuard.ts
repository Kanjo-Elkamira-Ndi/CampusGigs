import { Request, Response, NextFunction } from 'express'
import { auth } from '../lib/betterAuth'
import { ApiError } from '../utils/ApiError'
import { fromNodeHeaders } from 'better-auth/node'

export const authGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })
    if (!session?.user) throw new ApiError(401, 'Unauthenticated')
    ;(req as any).user = session.user
    next()
  } catch {
    next(new ApiError(401, 'Unauthenticated'))
  }
}