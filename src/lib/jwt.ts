import jwt from 'jsonwebtoken'
import { env } from '../config/env'

interface TokenPayload {
  sub: string
  email: string
  role: string
}

export function signAccessToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { sub: payload.id, email: payload.email, role: payload.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )
}

export function signRefreshToken(payload: { id: string }): string {
  return jwt.sign(
    { sub: payload.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  )
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string }
}
