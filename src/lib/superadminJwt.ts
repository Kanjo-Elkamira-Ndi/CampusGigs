import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export function signAdminToken(payload: { id: string; email: string }): string {
  return jwt.sign(
    { sub: payload.id, email: payload.email, type: 'superadmin' },
    env.SUPERADMIN_JWT_SECRET,
    { expiresIn: env.SUPERADMIN_JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  )
}

export function verifyAdminToken(token: string): { sub: string; email: string; type: string } {
  return jwt.verify(token, env.SUPERADMIN_JWT_SECRET) as { sub: string; email: string; type: string }
}
