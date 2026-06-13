import { query, queryOne } from '../lib/db'
import { parsePagination } from '../utils/pagination'
import { ApiError } from '../utils/ApiError'
import type { ListGigsInput, CreateGigInput } from '../dto/gigsDto'

interface DbGig {
  id: string
  title: string
  description: string
  budget: string
  location: string
  category_name: string
  category_slug: string
  status: string
  slots: number
  deadline: string
  created_at: string
  poster_id: string
  poster_full_name: string
  poster_avatar_url: string | null
  application_count: string
  university_id: string | null
  is_easy_apply: boolean
  tags: string[] | null
}

interface GigResult {
  id: string
  title: string
  description: string
  budget: number
  location: string
  category: string
  categorySlug: string
  status: string
  slots: number
  deadline: string
  createdAt: string
  poster: {
    id: string
    fullName: string
    avatarUrl: string | null
  }
  applicationCount: number
  universityId: string | null
  isEasyApply: boolean
  tags: string[]
}

export const listGigs = async (input: ListGigsInput) => {
  const { page, limit, skip } = parsePagination({ page: String(input.page), limit: String(input.limit) })

  const conditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 0

  if (input.status) {
    paramIndex++
    conditions.push(`g.status = $${paramIndex}`)
    params.push(input.status)
  } else {
    conditions.push("g.status = 'OPEN'")
  }

  if (input.q) {
    paramIndex++
    conditions.push(`g.search_vector @@ plainto_tsquery('english', $${paramIndex})`)
    params.push(input.q)
  }

  if (input.category) {
    paramIndex++
    conditions.push(`c.slug = $${paramIndex}`)
    params.push(input.category)
  }

  if (input.minBudget !== undefined) {
    paramIndex++
    conditions.push(`g.budget >= $${paramIndex}`)
    params.push(input.minBudget)
  }

  if (input.maxBudget !== undefined) {
    paramIndex++
    conditions.push(`g.budget <= $${paramIndex}`)
    params.push(input.maxBudget)
  }

  if (input.posterId) {
    paramIndex++
    conditions.push(`g.poster_id = $${paramIndex}`)
    params.push(input.posterId)
  }

  if (input.universityId) {
    paramIndex++
    conditions.push(`g.university_id = $${paramIndex}`)
    params.push(input.universityId)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*)
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     ${whereClause}`,
    params
  )
  const total = Number(count)

  const rows = await query<DbGig>(
    `SELECT
       g.id,
       g.title,
       g.description,
       g.budget,
       g.location,
       c.name AS category_name,
       c.slug AS category_slug,
       g.status,
       g.slots,
       g.deadline,
       g.created_at,
       g.poster_id,
       g.university_id,
       g.is_easy_apply,
       g.tags,
       u.full_name AS poster_full_name,
       u.avatar_url AS poster_avatar_url,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id) AS application_count
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     LEFT JOIN users u ON u.id = g.poster_id
     ${whereClause}
     ORDER BY g.created_at DESC
     LIMIT ${limit} OFFSET ${skip}`,
    params
  )

  const data: GigResult[] = rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    budget: Number(row.budget),
    location: row.location,
    category: row.category_name,
    categorySlug: row.category_slug,
    status: row.status,
    slots: row.slots,
    deadline: row.deadline,
    createdAt: row.created_at,
    poster: {
      id: row.poster_id,
      fullName: row.poster_full_name,
      avatarUrl: row.poster_avatar_url,
    },
    applicationCount: Number(row.application_count),
    universityId: row.university_id,
    isEasyApply: row.is_easy_apply,
    tags: row.tags ?? [],
  }))

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: { page, limit, total, totalPages },
  }
}

export const getGigById = async (id: string) => {
  const row = await queryOne<DbGig>(
    `SELECT
       g.id,
       g.title,
       g.description,
       g.budget,
       g.location,
       c.name AS category_name,
       c.slug AS category_slug,
       g.status,
       g.slots,
       g.deadline,
       g.created_at,
       g.poster_id,
       g.university_id,
       g.is_easy_apply,
       g.tags,
       u.full_name AS poster_full_name,
       u.avatar_url AS poster_avatar_url,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id) AS application_count
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     LEFT JOIN users u ON u.id = g.poster_id
     WHERE g.id = $1`,
    [id]
  )

  if (!row) throw new ApiError(404, 'Gig not found')

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    budget: Number(row.budget),
    location: row.location,
    category: row.category_name,
    categorySlug: row.category_slug,
    status: row.status,
    slots: row.slots,
    deadline: row.deadline,
    createdAt: row.created_at,
    poster: {
      id: row.poster_id,
      fullName: row.poster_full_name,
      avatarUrl: row.poster_avatar_url,
    },
    applicationCount: Number(row.application_count),
    universityId: row.university_id,
    isEasyApply: row.is_easy_apply,
    tags: row.tags ?? [],
  }
}

export const createGig = async (data: CreateGigInput, posterId: string) => {
  const category = await queryOne<{ id: string }>('SELECT id FROM categories WHERE slug = $1', [data.category])
  if (!category) throw new ApiError(400, 'Invalid category')

  const deadlineDate = new Date(data.deadline).toISOString()

  interface DbInsertedGig {
    id: string
    title: string
    description: string
    budget: string
    location: string
    status: string
    slots: number
    deadline: string
    created_at: string
    poster_id: string
    university_id: string | null
    is_easy_apply: boolean
    tags: string[] | null
  }

  const gig = await queryOne<DbInsertedGig>(
    `INSERT INTO gigs (poster_id, category_id, title, description, budget, location, slots, deadline, university_id, is_easy_apply, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING
       id, title, description, budget, location, status, slots, deadline, created_at,
       poster_id, university_id, is_easy_apply, tags`,
    [
      posterId,
      category.id,
      data.title,
      data.description,
      data.budget,
      data.location,
      data.slots ?? 1,
      deadlineDate,
      data.universityId ?? null,
      data.isEasyApply ?? true,
      data.tags ?? [],
    ]
  )

  if (!gig) throw new ApiError(500, 'Failed to create gig')

  return {
    id: gig.id,
    title: gig.title,
    description: gig.description,
    budget: Number(gig.budget),
    location: gig.location,
    status: gig.status,
    slots: gig.slots,
    deadline: gig.deadline,
    createdAt: gig.created_at,
    poster: {
      id: posterId,
      fullName: '',
      avatarUrl: null,
    },
    universityId: gig.university_id,
    isEasyApply: gig.is_easy_apply,
    tags: gig.tags ?? [],
  }
}
