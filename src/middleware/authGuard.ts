import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { asyncWrapper } from '../utils/asyncWrapper'
import { verifyAccessToken } from '../lib/jwt'
import { queryOne } from '../lib/db'

export const authGuard = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or invalid authorization header')
    }

    const token = header.slice(7)
    let payload: { sub: string; email: string; role: string; tokenVersion?: number }
    try {
      payload = verifyAccessToken(token)
    } catch {
      throw new ApiError(401, 'Invalid or expired token')
    }

    const user = await queryOne<{ token_version: number }>(
      'SELECT token_version FROM users WHERE id = $1',
      [payload.sub]
    )
    if (!user) throw new ApiError(401, 'User not found')
    if (payload.tokenVersion !== undefined && user.token_version !== payload.tokenVersion) {
      throw new ApiError(401, 'Session expired. Please log in again.')
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as 'WORKER' | 'POSTER' | 'ADMIN',
      name: '',
      fullName: '',
      universityId: null,
      avatarUrl: null,
      isBanned: false,
      emailVerified: false,
    }

    next()
  }
)
