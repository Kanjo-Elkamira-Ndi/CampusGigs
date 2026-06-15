import { query, queryOne } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import { UpdateProfileInput } from '../dto/usersDto'
import { parsePagination } from '../utils/pagination'

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
  university_name?: string | null
  city?: string | null
  skills?: string[]
  hourly_rate?: string | null
  availability?: string | null
  experience_level?: string | null
  remote_available?: boolean
  hired_count?: number
  response_time?: string | null
  verified?: boolean
}

interface DbReview {
  id: string
  rating: number
  comment: string
  created_at: string
  reviewer_id: string
  reviewer_name: string
  reviewer_avatar: string | null
  gig_id: string
  gig_title: string
  gig_category: string | null
  reviewer_avg_rating: string
  reviewer_review_count: number
}

const formatUser = (u: DbUser) => ({
  id:           u.id,
  email:        u.email,
  name:         u.name,
  fullName:     u.full_name,
  role:         u.role,
  universityId: u.university_id,
  universityName: u.university_name ?? null,
  city: u.city ?? null,
  avatarUrl:    u.avatar_url,
  bio:          u.bio,
  avgRating:    Number(u.avg_rating),
  reviewCount:  u.review_count,
  isBanned:     u.is_banned,
  emailVerified:u.email_verified,
  skills: u.skills ?? [],
  hourlyRate: u.hourly_rate ? Number(u.hourly_rate) : null,
  availability: u.availability ?? null,
  experienceLevel: u.experience_level ?? null,
  remoteAvailable: u.remote_available ?? false,
  hiredCount: u.hired_count ?? 0,
  responseTime: u.response_time ?? null,
  verified: u.verified ?? false,
  createdAt:    u.created_at,
  updatedAt:    u.updated_at,
})

export const getUserById = async (id: string) => {
  const user = await queryOne<DbUser>(
    `SELECT u.id, u.email, u.name, u.full_name, u.role, u.university_id,
            u.avatar_url, u.bio, u.avg_rating, u.review_count,
            u.is_banned, u.email_verified, u.created_at, u.updated_at,
            u.skills, u.hourly_rate, u.availability, u.experience_level,
            u.remote_available, u.hired_count, u.response_time, u.verified,
            univ.name AS university_name, univ.city AS university_city
     FROM users u
     LEFT JOIN universities univ ON univ.id = u.university_id
     WHERE u.id = $1`,
    [id]
  )
  if (!user) throw new ApiError(404, 'User not found')

  const reviews = await query<DbReview>(
    `SELECT r.id, r.rating, r.comment, r.created_at,
            u.id AS reviewer_id, u.name AS reviewer_name,
            u.avatar_url AS reviewer_avatar,
            u.avg_rating AS reviewer_avg_rating, u.review_count AS reviewer_review_count,
            g.id AS gig_id, g.title AS gig_title, c.name AS gig_category
     FROM reviews r
     JOIN users u ON u.id = r.reviewer_id
     LEFT JOIN gigs g ON g.id = r.gig_id
     LEFT JOIN categories c ON c.id = g.category_id
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
        fullName:  r.reviewer_name,
        avatarUrl: r.reviewer_avatar,
        avgRating: Number(r.reviewer_avg_rating ?? 0),
        reviewCount: Number(r.reviewer_review_count ?? 0),
      },
      gig: {
        id: r.gig_id,
        title: r.gig_title,
        category: r.gig_category,
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
  if (data.skills !== undefined) { fields.push(`skills = $${i++}`); values.push(data.skills) }
  if (data.hourlyRate !== undefined) { fields.push(`hourly_rate = $${i++}`); values.push(data.hourlyRate) }
  if (data.availability !== undefined) { fields.push(`availability = $${i++}`); values.push(data.availability) }
  if (data.experienceLevel !== undefined) { fields.push(`experience_level = $${i++}`); values.push(data.experienceLevel) }
  if (data.remoteAvailable !== undefined) { fields.push(`remote_available = $${i++}`); values.push(data.remoteAvailable) }

  if (fields.length === 0) throw new ApiError(400, 'No fields to update')

  values.push(id)
  await queryOne(
    `UPDATE users SET ${fields.join(', ')}
     WHERE id = $${i}`,
    values
  )

  const user = await queryOne<DbUser>(
    `SELECT u.id, u.email, u.name, u.full_name, u.role, u.university_id,
            u.avatar_url, u.bio, u.avg_rating, u.review_count,
            u.is_banned, u.email_verified, u.created_at, u.updated_at,
            u.skills, u.hourly_rate, u.availability, u.experience_level,
            u.remote_available, u.hired_count, u.response_time, u.verified,
            univ.name AS university_name, univ.city AS university_city
     FROM users u
     LEFT JOIN universities univ ON univ.id = u.university_id
     WHERE u.id = $1`,
    [id]
  )

  return formatUser(user!)
}

export const getUserReviews = async (userId: string, input: { page?: number; limit?: number }) => {
  const { page, limit, skip } = parsePagination({ page: String(input.page ?? 1), limit: String(input.limit ?? 10) })

  const [{ count }] = await query<{ count: string }>(
    'SELECT COUNT(*) FROM reviews WHERE reviewee_id = $1',
    [userId]
  )
  const total = Number(count)

  const rows = await query<any>(
    `SELECT r.id, r.rating, r.comment, r.created_at,
            u.id AS reviewer_id, u.name AS reviewer_name, u.avatar_url AS reviewer_avatar,
            u.avg_rating AS reviewer_avg_rating, u.review_count AS reviewer_review_count,
            g.id AS gig_id, g.title AS gig_title,
            c.name AS gig_category
     FROM reviews r
     JOIN users u ON u.id = r.reviewer_id
     JOIN gigs g ON g.id = r.gig_id
     LEFT JOIN categories c ON c.id = g.category_id
     WHERE r.reviewee_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, skip]
  )

  const agg = await queryOne<{ avg: string }>(
    'SELECT AVG(rating)::numeric(3,2) as avg FROM reviews WHERE reviewee_id = $1',
    [userId]
  )

  const data = rows.map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
    reviewer: {
      id: r.reviewer_id,
      name: r.reviewer_name,
      fullName: r.reviewer_name,
      avatarUrl: r.reviewer_avatar,
      avgRating: Number(r.reviewer_avg_rating ?? 0),
      reviewCount: Number(r.reviewer_review_count ?? 0),
    },
    gig: { id: r.gig_id, title: r.gig_title, category: r.gig_category },
  }))

  return {
    reviews: data,
    avgRating: agg?.avg ? Number(agg.avg) : 0,
    total,
  }
}

export const getUserPublicProfile = async (id: string) => {
  const user = await queryOne<DbUser>(
    `SELECT u.id, u.name, u.full_name, u.role, u.university_id,
            u.avatar_url, u.bio, u.avg_rating, u.review_count,
            u.created_at, u.updated_at,
            u.skills, u.hourly_rate, u.availability, u.experience_level,
            u.remote_available, u.hired_count, u.response_time, u.verified,
            univ.name AS university_name, univ.city AS university_city
     FROM users u
     LEFT JOIN universities univ ON univ.id = u.university_id
     WHERE u.id = $1`,
    [id]
  )
  if (!user) throw new ApiError(404, 'User not found')

  const reviews = await query<DbReview>(
    `SELECT r.id, r.rating, r.comment, r.created_at,
            u.id AS reviewer_id, u.name AS reviewer_name,
            u.avatar_url AS reviewer_avatar,
            u.avg_rating AS reviewer_avg_rating, u.review_count AS reviewer_review_count,
            g.id AS gig_id, g.title AS gig_title, c.name AS gig_category
     FROM reviews r
     JOIN users u ON u.id = r.reviewer_id
     JOIN gigs g ON g.id = r.gig_id
     LEFT JOIN categories c ON c.id = g.category_id
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
    universityName: user.university_name ?? null,
    city: user.city ?? null,
    avatarUrl:    user.avatar_url,
    bio:          user.bio,
    avgRating:    Number(user.avg_rating),
    reviewCount:  user.review_count,
    skills: user.skills ?? [],
    hourlyRate: user.hourly_rate ? Number(user.hourly_rate) : null,
    availability: user.availability ?? null,
    experienceLevel: user.experience_level ?? null,
    remoteAvailable: user.remote_available ?? false,
    hiredCount: user.hired_count ?? 0,
    responseTime: user.response_time ?? null,
    verified: user.verified ?? false,
    createdAt:    user.created_at,
    reviewsReceived: reviews.map(r => ({
      id:        r.id,
      rating:    r.rating,
      comment:   r.comment,
      createdAt: r.created_at,
      reviewer: {
        id:        r.reviewer_id,
        name:      r.reviewer_name,
        fullName:  r.reviewer_name,
        avatarUrl: r.reviewer_avatar,
        avgRating: Number(r.reviewer_avg_rating ?? 0),
        reviewCount: Number(r.reviewer_review_count ?? 0),
      },
      gig: { id: r.gig_id, title: r.gig_title, category: r.gig_category },
    })),
    _count: {
      gigs:         Number(counts?.gig_count ?? 0),
      applications: Number(counts?.app_count ?? 0),
    },
  }
}
