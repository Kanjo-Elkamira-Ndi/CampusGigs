import { UserRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  fullName: string
  role: UserRole
  universityId: string | null
  avatarUrl: string | null
  isBanned: boolean
  emailVerified: boolean
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
      admin?: {
        id: string
        email: string
        type: 'superadmin'
      }
    }
  }
}