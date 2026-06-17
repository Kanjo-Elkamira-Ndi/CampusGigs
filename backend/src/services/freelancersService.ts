import { query } from '../lib/db'
import { parsePagination } from '../utils/pagination'
import type { ListFreelancersInput } from '../dto/freelancersDto'

interface FreelancerResult {
  id: string
  fullName: string
  avatarUrl: string | null
  universityId: string | null
  universityName: string
  city: string
  bio: string | null
  avgRating: number
  reviewCount: number
  createdAt: string
  verified: boolean
  responseTime: string | null
  hiredCount: number
  skills: string[]
  hourlyRate: number | null
  availability: string | null
  experienceLevel: string | null
  remoteAvailable: boolean
}

const SORT_MAP: Record<string, string> = {
  rating: 'u.avg_rating DESC NULLS LAST',
  newest: 'u.created_at DESC',
  'rate-asc': 'u.avg_rating ASC NULLS LAST',
  'rate-desc': 'u.avg_rating DESC NULLS LAST',
}

export const listFreelancers = async (input: ListFreelancersInput) => {
  const { page, limit, skip } = parsePagination({ page: String(input.page), limit: String(input.limit) })

  const conditions: string[] = ["u.role = 'WORKER'", 'u.is_banned = false']
  const params: unknown[] = []
  let paramIndex = 0

  if (input.q) {
    paramIndex++
    conditions.push(
      `to_tsvector('simple', coalesce(u.name, '') || ' ' || coalesce(u.full_name, '') || ' ' || coalesce(u.university_id, '') || ' ' || coalesce(u.bio, '')) @@ plainto_tsquery('simple', $${paramIndex})`
    )
    params.push(input.q)
  }

  if (input.universityIds) {
    const ids = input.universityIds.split(',').map(s => s.trim()).filter(Boolean)
    if (ids.length > 0) {
      paramIndex++
      conditions.push(`u.university_id = ANY($${paramIndex}::text[])`)
      params.push(ids)
    }
  }

  if (input.minRating !== undefined) {
    paramIndex++
    conditions.push(`u.avg_rating >= $${paramIndex}`)
    params.push(input.minRating)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const orderBy = input.sort && SORT_MAP[input.sort] ? SORT_MAP[input.sort] : 'created_at DESC'

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*) FROM users u ${whereClause}`,
    params
  )
  const total = Number(count)

  const rows = await query<any>(
    `SELECT u.id, u.full_name, u.avatar_url, u.university_id, u.bio,
            u.avg_rating, u.review_count, u.created_at, u.email_verified,
            u.response_time, u.skills, u.hired_count,
            u.hourly_rate, u.availability, u.experience_level, u.remote_available, u.verified,
            un.name AS university_name, un.city
     FROM users u
     LEFT JOIN universities un ON un.id = u.university_id
     ${whereClause}
     ORDER BY ${orderBy}
     LIMIT ${limit} OFFSET ${skip}`,
    params
  )

  const data: FreelancerResult[] = rows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    fullName: row.full_name as string,
    avatarUrl: (row.avatar_url as string) ?? null,
    universityId: (row.university_id as string) ?? null,
    universityName: (row.university_name as string) ?? '',
    city: (row.city as string) ?? '',
    bio: (row.bio as string) ?? null,
    avgRating: Number(row.avg_rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    createdAt: row.created_at as string,
    verified: Boolean(row.verified ?? row.email_verified ?? false),
    responseTime: (row.response_time as string) ?? null,
    hiredCount: Number(row.hired_count ?? 0),
    skills: (row.skills as string[]) ?? [],
    hourlyRate: row.hourly_rate ? Number(row.hourly_rate) : null,
    availability: (row.availability as string) ?? null,
    experienceLevel: (row.experience_level as string) ?? null,
    remoteAvailable: Boolean(row.remote_available ?? false),
  }))

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: { page, limit, total, totalPages },
  }
}
