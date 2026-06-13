import jwt from 'jsonwebtoken'
import { env } from '../config/env'

interface TokenPayload {
  sub: string
  email: string
  role: string
  tokenVersion?: number
}

export function signAccessToken(payload: { id: string; email: string; role: string; tokenVersion?: number }): string {
  return jwt.sign(
    { sub: payload.id, email: payload.email, role: payload.role, tokenVersion: payload.tokenVersion },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
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

export function signResetToken(email: string): string {
  return jwt.sign(
    { sub: email, purpose: 'password-reset' },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export function verifyResetToken(token: string): string {
  const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; purpose: string }
  if (payload.purpose !== 'password-reset') {
    throw new jwt.JsonWebTokenError('Invalid token purpose')
  }
  return payload.sub
}
