import { Request, Response } from 'express'
import { auth } from '../../lib/betterAuth'
import { fromNodeHeaders } from 'better-auth/node'
import { asyncWrapper } from '../../utils/asyncWrapper'
import { ApiResponse } from '../../utils/ApiResponse'
import { ApiError } from '../../utils/ApiError'
import { queryOne } from '../../lib/db'

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session?.user) throw new ApiError(401, 'No active session')

  const user = await queryOne<{
    id: string
    email: string
    name: string
    full_name: string
    role: string
    university_id: string | null
    avatar_url: string | null
    bio: string | null
    avg_rating: string
    review_count: number
    is_banned: boolean
    email_verified: boolean
    created_at: string
  }>(
    `SELECT id, email, name, full_name, role,
            university_id, avatar_url, bio,
            avg_rating, review_count,
            is_banned, email_verified, created_at
     FROM users
     WHERE id = $1`,
    [session.user.id]
  )

  if (!user) throw new ApiError(404, 'User not found')

  res.json(ApiResponse.success({
    id:           user.id,
    email:        user.email,
    name:         user.name,
    fullName:     user.full_name,
    role:         user.role,
    universityId: user.university_id,
    avatarUrl:    user.avatar_url,
    bio:          user.bio,
    avgRating:    Number(user.avg_rating),
    reviewCount:  user.review_count,
    isBanned:     user.is_banned,
    emailVerified:user.email_verified,
    createdAt:    user.created_at,
  }, 'Session retrieved'))
})
