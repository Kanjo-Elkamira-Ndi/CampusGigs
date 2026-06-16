import { query } from '../lib/db'
import { parsePagination } from '../utils/pagination'
import type { ListFreelancersInput } from '../dto/freelancersDto'

interface DbFreelancer {
  id: string
  full_name: string
  avatar_url: string | null
  university_id: string | null
  university_name: string | null
  city: string | null
  bio: string | null
  avg_rating: string
  review_count: string
  created_at: string
  email_verified: boolean
  response_time: string | null
}

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
  rating: 'avg_rating DESC NULLS LAST',
  newest: 'created_at DESC',
  'rate-asc': 'avg_rating ASC NULLS LAST',
  'rate-desc': 'avg_rating DESC NULLS LAST',
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
  const countWhere = whereClause.replace(/u\./g, '')

  const orderBy = input.sort && SORT_MAP[input.sort] ? SORT_MAP[input.sort] : 'created_at DESC'

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*) FROM users u ${countWhere}`,
    params
  )
  const total = Number(count)

  const rows = await query<DbFreelancer>(
    `SELECT u.id, u.full_name, u.avatar_url, u.university_id, u.bio,
            u.avg_rating, u.review_count, u.created_at, u.email_verified,
            u.response_time,
            un.name AS university_name, un.city,
            (SELECT COALESCE(json_agg(s.name) FILTER (WHERE s.name IS NOT NULL), '[]'::json)::text
             FROM user_skills us JOIN skills s ON s.id = us.skill_id WHERE us.user_id = u.id) AS skills,
            (SELECT COUNT(*) FROM applications a WHERE a.worker_id = u.id AND a.status = 'COMPLETED') AS hired_count
     FROM users u
     LEFT JOIN universities un ON un.id = u.university_id
     ${whereClause}
     ORDER BY ${orderBy}
     LIMIT ${limit} OFFSET ${skip}`,
    params
  )

  const data: FreelancerResult[] = rows.map(row => {
    let skills: string[] = []
    try {
      if ((row as any).skills) {
        const parsed = JSON.parse((row as any).skills as string)
        skills = Array.isArray(parsed) ? parsed : []
      }
    } catch { skills = [] }
    return {
      id: row.id,
      fullName: row.full_name,
      avatarUrl: row.avatar_url,
      universityId: row.university_id,
      universityName: row.university_name ?? '',
      city: row.city ?? '',
      bio: row.bio,
      avgRating: Number(row.avg_rating),
      reviewCount: Number(row.review_count),
      createdAt: row.created_at,
      verified: row.email_verified,
      responseTime: row.response_time ?? null,
      hiredCount: Number((row as any).hired_count ?? 0),
      skills: skills ?? [],
      hourlyRate: null,
      availability: null,
      experienceLevel: null,
      remoteAvailable: false,
    }
  })

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: { page, limit, total, totalPages },
  }
}
