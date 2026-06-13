import { query, queryOne } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import { UpdateProfileInput } from '../dto/usersDto'

interface DbUser {
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
  updated_at: string
}

interface DbReview {
  id: string
  rating: number
  comment: string
  created_at: string
  reviewer_id: string
  reviewer_name: string
  reviewer_avatar: string | null
}

const formatUser = (u: DbUser) => ({
  id:           u.id,
  email:        u.email,
  name:         u.name,
  fullName:     u.full_name,
  role:         u.role,
  universityId: u.university_id,
  avatarUrl:    u.avatar_url,
  bio:          u.bio,
  avgRating:    Number(u.avg_rating),
  reviewCount:  u.review_count,
  isBanned:     u.is_banned,
  emailVerified:u.email_verified,
  createdAt:    u.created_at,
  updatedAt:    u.updated_at,
})

export const getUserById = async (id: string) => {
  const user = await queryOne<DbUser>(
    `SELECT id, email, name, full_name, role, university_id,
            avatar_url, bio, avg_rating, review_count,
            is_banned, email_verified, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  )
  if (!user) throw new ApiError(404, 'User not found')

  const reviews = await query<DbReview>(
    `SELECT r.id, r.rating, r.comment, r.created_at,
            u.id AS reviewer_id, u.name AS reviewer_name,
            u.avatar_url AS reviewer_avatar
     FROM reviews r
     JOIN users u ON u.id = r.reviewer_id
     WHERE r.reviewee_id = $1
     ORDER BY r.created_at DESC
     LIMIT 5`,
    [id]
  )

  const counts = await queryOne<{ gig_count: string; app_count: string }>(
    `SELECT
       (SELECT COUNT(*) FROM gigs        WHERE poster_id = $1) AS gig_count,
       (SELECT COUNT(*) FROM applications WHERE worker_id = $1) AS app_count`,
    [id]
  )

  return {
    ...formatUser(user),
    reviewsReceived: reviews.map(r => ({
      id:        r.id,
      rating:    r.rating,
      comment:   r.comment,
      createdAt: r.created_at,
      reviewer: {
        id:        r.reviewer_id,
        name:      r.reviewer_name,
        avatarUrl: r.reviewer_avatar,
      },
    })),
    _count: {
      gigs:         Number(counts?.gig_count ?? 0),
      applications: Number(counts?.app_count ?? 0),
    },
  }
}

export const updateProfile = async (id: string, data: UpdateProfileInput) => {
  const exists = await queryOne('SELECT id FROM users WHERE id = $1', [id])
  if (!exists) throw new ApiError(404, 'User not found')

  const fields: string[] = []
  const values: unknown[] = []
  let i = 1

  if (data.fullName    !== undefined) { fields.push(`full_name = $${i++}`);   values.push(data.fullName) }
  if (data.bio         !== undefined) { fields.push(`bio = $${i++}`);         values.push(data.bio) }
  if (data.universityId!== undefined) { fields.push(`university_id = $${i++}`);values.push(data.universityId) }
  if (data.avatarUrl   !== undefined) { fields.push(`avatar_url = $${i++}`);  values.push(data.avatarUrl) }

  if (fields.length === 0) throw new ApiError(400, 'No fields to update')

  values.push(id)
  const user = await queryOne<DbUser>(
    `UPDATE users SET ${fields.join(', ')}
     WHERE id = $${i}
     RETURNING id, email, name, full_name, role,
               university_id, avatar_url, bio,
               avg_rating, review_count, updated_at`,
    values
  )

  return formatUser(user!)
}

export const getUserPublicProfile = async (id: string) => {
  const user = await queryOne<DbUser>(
    `SELECT id, name, full_name, role, university_id,
            avatar_url, bio, avg_rating, review_count, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  )
  if (!user) throw new ApiError(404, 'User not found')

  const reviews = await query<DbReview & { gig_id: string; gig_title: string }>(
    `SELECT r.id, r.rating, r.comment, r.created_at,
            u.id AS reviewer_id, u.name AS reviewer_name,
            u.avatar_url AS reviewer_avatar,
            g.id AS gig_id, g.title AS gig_title
     FROM reviews r
     JOIN users u ON u.id = r.reviewer_id
     JOIN gigs g ON g.id = r.gig_id
     WHERE r.reviewee_id = $1
     ORDER BY r.created_at DESC
     LIMIT 10`,
    [id]
  )

  const counts = await queryOne<{ gig_count: string; app_count: string }>(
    `SELECT
       (SELECT COUNT(*) FROM gigs        WHERE poster_id = $1) AS gig_count,
       (SELECT COUNT(*) FROM applications WHERE worker_id = $1) AS app_count`,
    [id]
  )

  return {
    id:           user.id,
    name:         user.name,
    fullName:     user.full_name,
    role:         user.role,
    universityId: user.university_id,
    avatarUrl:    user.avatar_url,
    bio:          user.bio,
    avgRating:    Number(user.avg_rating),
    reviewCount:  user.review_count,
    createdAt:    user.created_at,
    reviewsReceived: reviews.map(r => ({
      id:        r.id,
      rating:    r.rating,
      comment:   r.comment,
      createdAt: r.created_at,
      reviewer: {
        id:        r.reviewer_id,
        name:      r.reviewer_name,
        avatarUrl: r.reviewer_avatar,
      },
      gig: { id: r.gig_id, title: r.gig_title },
    })),
    _count: {
      gigs:         Number(counts?.gig_count ?? 0),
      applications: Number(counts?.app_count ?? 0),
    },
  }
}
