import { query, queryOne } from '../lib/db'
import { parsePagination } from '../utils/pagination'
import { ApiError } from '../utils/ApiError'
import type { ListGigsInput, CreateGigInput, UpdateGigInput } from '../dto/gigsDto'

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
  poster_avg_rating: string | null
  poster_review_count: string | null
  poster_university_name: string | null
  poster_city: string | null
  application_count: string
  accepted_count: string
  university_id: string | null
  university_name: string | null
  city: string | null
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
  slotsRemaining: number
  deadline: string
  createdAt: string
  poster: {
    id: string
    fullName: string
    avatarUrl: string | null
    universityName: string | null
    city: string | null
    avgRating: number
    reviewCount: number
  }
  applicationCount: number
  universityId: string | null
  universityName: string | null
  city: string | null
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
       u.avg_rating AS poster_avg_rating,
       u.review_count AS poster_review_count,
       poster_univ.name AS poster_university_name,
       poster_univ.city AS poster_city,
       univ.name AS university_name,
       univ.city,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id) AS application_count,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id AND a.status = 'ACCEPTED') AS accepted_count
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     LEFT JOIN users u ON u.id = g.poster_id
     LEFT JOIN universities univ ON univ.id = g.university_id
     LEFT JOIN universities poster_univ ON poster_univ.id = u.university_id
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
    slotsRemaining: row.slots - Number(row.accepted_count),
    deadline: row.deadline,
    createdAt: row.created_at,
    poster: {
      id: row.poster_id,
      fullName: row.poster_full_name,
      avatarUrl: row.poster_avatar_url,
      universityName: row.poster_university_name,
      city: row.poster_city,
      avgRating: Number(row.poster_avg_rating ?? 0),
      reviewCount: Number(row.poster_review_count ?? 0),
    },
    applicationCount: Number(row.application_count),
    universityId: row.university_id,
    universityName: row.university_name,
    city: row.city,
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
       u.avg_rating AS poster_avg_rating,
       u.review_count AS poster_review_count,
       poster_univ.name AS poster_university_name,
       poster_univ.city AS poster_city,
       univ.name AS university_name,
       univ.city,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id) AS application_count,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id AND a.status = 'ACCEPTED') AS accepted_count
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     LEFT JOIN users u ON u.id = g.poster_id
     LEFT JOIN universities univ ON univ.id = g.university_id
     LEFT JOIN universities poster_univ ON poster_univ.id = u.university_id
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
    slotsRemaining: row.slots - Number(row.accepted_count),
    deadline: row.deadline,
    createdAt: row.created_at,
    poster: {
      id: row.poster_id,
      fullName: row.poster_full_name,
      avatarUrl: row.poster_avatar_url,
      universityName: row.poster_university_name,
      city: row.poster_city,
      avgRating: Number(row.poster_avg_rating ?? 0),
      reviewCount: Number(row.poster_review_count ?? 0),
    },
    applicationCount: Number(row.application_count),
    universityId: row.university_id,
    universityName: row.university_name,
    city: row.city,
    isEasyApply: row.is_easy_apply,
    tags: row.tags ?? [],
  }
}

export const createGig = async (data: CreateGigInput, posterId: string) => {
  const category = await queryOne<{ id: string }>('SELECT id FROM categories WHERE slug = $1', [data.category])
  if (!category) throw new ApiError(400, 'Invalid category')

  const deadlineDate = new Date(data.deadline).toISOString()

  const gig = await queryOne<{ id: string }>(
    `INSERT INTO gigs (poster_id, category_id, title, description, budget, location, slots, deadline, university_id, is_easy_apply, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
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

  return getGigById(gig.id)
}

export const updateGig = async (id: string, posterId: string, data: UpdateGigInput) => {
  const existing = await queryOne<{ id: string; poster_id: string }>(
    'SELECT id, poster_id FROM gigs WHERE id = $1',
    [id]
  )
  if (!existing) throw new ApiError(404, 'Gig not found')
  if (existing.poster_id !== posterId) throw new ApiError(403, 'Not authorized to update this gig')

  const updates: string[] = []
  const params: unknown[] = []
  let paramIndex = 0

  if (data.title !== undefined) {
    paramIndex++
    updates.push(`title = $${paramIndex}`)
    params.push(data.title)
  }

  if (data.description !== undefined) {
    paramIndex++
    updates.push(`description = $${paramIndex}`)
    params.push(data.description)
  }

  if (data.category !== undefined) {
    const category = await queryOne<{ id: string }>('SELECT id FROM categories WHERE slug = $1', [data.category])
    if (!category) throw new ApiError(400, 'Invalid category')
    paramIndex++
    updates.push(`category_id = $${paramIndex}`)
    params.push(category.id)
  }

  if (data.location !== undefined) {
    paramIndex++
    updates.push(`location = $${paramIndex}`)
    params.push(data.location)
  }

  if (data.budget !== undefined) {
    paramIndex++
    updates.push(`budget = $${paramIndex}`)
    params.push(data.budget)
  }

  if (data.slots !== undefined) {
    paramIndex++
    updates.push(`slots = $${paramIndex}`)
    params.push(data.slots)
  }

  if (data.deadline !== undefined) {
    paramIndex++
    updates.push(`deadline = $${paramIndex}`)
    params.push(new Date(data.deadline).toISOString())
  }

  if (data.universityId !== undefined) {
    paramIndex++
    updates.push(`university_id = $${paramIndex}`)
    params.push(data.universityId)
  }

  if (data.isEasyApply !== undefined) {
    paramIndex++
    updates.push(`is_easy_apply = $${paramIndex}`)
    params.push(data.isEasyApply)
  }

  if (data.tags !== undefined) {
    paramIndex++
    updates.push(`tags = $${paramIndex}`)
    params.push(data.tags)
  }

  if (updates.length === 0) throw new ApiError(400, 'No fields to update')

  params.push(id)
  await query(
    `UPDATE gigs SET ${updates.join(', ')} WHERE id = $${paramIndex + 1}`,
    params
  )

  return getGigById(id)
}

export const deleteGig = async (id: string, posterId: string) => {
  const existing = await queryOne<{ id: string; poster_id: string }>(
    'SELECT id, poster_id FROM gigs WHERE id = $1',
    [id]
  )
  if (!existing) throw new ApiError(404, 'Gig not found')
  if (existing.poster_id !== posterId) throw new ApiError(403, 'Not authorized to delete this gig')

  await query(
    "UPDATE gigs SET status = 'CANCELLED' WHERE id = $1",
    [id]
  )
}

export const closeGig = async (id: string, posterId: string) => {
  const existing = await queryOne<{ id: string; poster_id: string }>(
    'SELECT id, poster_id FROM gigs WHERE id = $1',
    [id]
  )
  if (!existing) throw new ApiError(404, 'Gig not found')
  if (existing.poster_id !== posterId) throw new ApiError(403, 'Not authorized to close this gig')

  await query(
    "UPDATE gigs SET status = 'COMPLETED' WHERE id = $1",
    [id]
  )

  return getGigById(id)
}

export const saveGig = async (gigId: string, userId: string) => {
  const gig = await queryOne<{ id: string }>('SELECT id FROM gigs WHERE id = $1', [gigId])
  if (!gig) throw new ApiError(404, 'Gig not found')

  try {
    await query(
      'INSERT INTO saved_gigs (user_id, gig_id) VALUES ($1, $2)',
      [userId, gigId]
    )
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === '23505') {
      throw new ApiError(409, 'Gig already saved')
    }
    throw err
  }
}

export const unsaveGig = async (gigId: string, userId: string) => {
  await query(
    'DELETE FROM saved_gigs WHERE user_id = $1 AND gig_id = $2',
    [userId, gigId]
  )
}

interface DbSavedGig {
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
  poster_avg_rating: string | null
  poster_review_count: string | null
  poster_university_name: string | null
  poster_city: string | null
  application_count: string
  accepted_count: string
  university_id: string | null
  university_name: string | null
  city: string | null
  is_easy_apply: boolean
  tags: string[] | null
  saved_at: string
}

export const getSavedGigs = async (userId: string) => {
  const rows = await query<DbSavedGig>(
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
       u.avg_rating AS poster_avg_rating,
       u.review_count AS poster_review_count,
       poster_univ.name AS poster_university_name,
       poster_univ.city AS poster_city,
       univ.name AS university_name,
       univ.city,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id) AS application_count,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id AND a.status = 'ACCEPTED') AS accepted_count,
       sg.created_at AS saved_at
     FROM saved_gigs sg
     JOIN gigs g ON g.id = sg.gig_id
     LEFT JOIN categories c ON c.id = g.category_id
     LEFT JOIN users u ON u.id = g.poster_id
     LEFT JOIN universities univ ON univ.id = g.university_id
     LEFT JOIN universities poster_univ ON poster_univ.id = u.university_id
     WHERE sg.user_id = $1
     ORDER BY sg.created_at DESC`,
    [userId]
  )

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    budget: Number(row.budget),
    location: row.location,
    category: row.category_name,
    categorySlug: row.category_slug,
    status: row.status,
    slots: row.slots,
    slotsRemaining: row.slots - Number(row.accepted_count),
    deadline: row.deadline,
    createdAt: row.created_at,
    poster: {
      id: row.poster_id,
      fullName: row.poster_full_name,
      avatarUrl: row.poster_avatar_url,
      universityName: row.poster_university_name,
      city: row.poster_city,
      avgRating: Number(row.poster_avg_rating ?? 0),
      reviewCount: Number(row.poster_review_count ?? 0),
    },
    applicationCount: Number(row.application_count),
    universityId: row.university_id,
    universityName: row.university_name,
    city: row.city,
    isEasyApply: row.is_easy_apply,
    tags: row.tags ?? [],
    savedAt: row.saved_at,
  }))
}
