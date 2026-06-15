import { query } from '../lib/db'
import { parsePagination } from '../utils/pagination'
import type { ListFreelancersInput } from '../dto/freelancersDto'

interface DbFreelancer {
  id: string
  full_name: string
  avatar_url: string | null
  university_id: string | null
  bio: string | null
  avg_rating: string
  review_count: string
  created_at: string
}

interface FreelancerResult {
  id: string
  fullName: string
  avatarUrl: string | null
  universityId: string | null
  bio: string | null
  avgRating: number
  reviewCount: number
  createdAt: string
}

const SORT_MAP: Record<string, string> = {
  rating: 'avg_rating DESC NULLS LAST',
  newest: 'created_at DESC',
  'rate-asc': 'avg_rating ASC NULLS LAST',
  'rate-desc': 'avg_rating DESC NULLS LAST',
}

export const listFreelancers = async (input: ListFreelancersInput) => {
  const { page, limit, skip } = parsePagination({ page: String(input.page), limit: String(input.limit) })

  const conditions: string[] = ["role = 'WORKER'", 'is_banned = false']
  const params: unknown[] = []
  let paramIndex = 0

  if (input.q) {
    paramIndex++
    conditions.push(
      `to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(full_name, '') || ' ' || coalesce(university_id, '') || ' ' || coalesce(bio, '')) @@ plainto_tsquery('simple', $${paramIndex})`
    )
    params.push(input.q)
  }

  if (input.universityIds) {
    const ids = input.universityIds.split(',').map(s => s.trim()).filter(Boolean)
    if (ids.length > 0) {
      paramIndex++
      conditions.push(`university_id = ANY($${paramIndex}::text[])`)
      params.push(ids)
    }
  }

  if (input.minRating !== undefined) {
    paramIndex++
    conditions.push(`avg_rating >= $${paramIndex}`)
    params.push(input.minRating)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const orderBy = input.sort && SORT_MAP[input.sort] ? SORT_MAP[input.sort] : 'created_at DESC'

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    params
  )
  const total = Number(count)

  const rows = await query<DbFreelancer>(
    `SELECT id, full_name, avatar_url, university_id, bio, avg_rating, review_count, created_at
     FROM users
     ${whereClause}
     ORDER BY ${orderBy}
     LIMIT ${limit} OFFSET ${skip}`,
    params
  )

  const data: FreelancerResult[] = rows.map(row => ({
    id: row.id,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    universityId: row.university_id,
    bio: row.bio,
    avgRating: Number(row.avg_rating),
    reviewCount: Number(row.review_count),
    createdAt: row.created_at,
  }))

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: { page, limit, total, totalPages },
  }
}
