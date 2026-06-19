import bcrypt from 'bcryptjs'
import { query, queryOne, transaction } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import { parsePagination } from '../utils/pagination'
import type { UpdateUserInput, CreateUniversityInput } from '../dto/superadminDto'

interface DbAdmin {
  id: string
  email: string
  password_hash: string
  full_name: string
  last_login_at: string | null
  created_at: string
}

interface DbUser {
  id: string
  email: string
  name: string
  full_name: string
  role: string
  university_id: string | null
  university_name: string | null
  avatar_url: string | null
  bio: string | null
  avg_rating: string
  review_count: number
  is_banned: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

interface DbGig {
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
  poster_full_name: string
  poster_avatar_url: string | null
  category_id: string
  category_name: string
  category_slug: string
  university_id: string | null
  application_count: string
}

interface DbAuditLog {
  id: string
  admin_id: string
  admin_name: string
  admin_email: string
  action: string
  target_type: string
  target_id: string
  meta: unknown
  ip_address: string
  created_at: string
}

interface DbReview {
  id: string
  reviewer_id: string
  reviewer_name: string
  reviewee_id: string
  reviewee_name: string
  gig_id: string
  gig_title: string
  rating: number
  comment: string | null
  created_at: string
}

interface DbCategory {
  id: string
  name: string
  slug: string
}

interface DbUniversity {
  id: string
  name: string
  city: string
  type: string
  user_count: string
  gig_count: string
}

const formatUser = (u: DbUser) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  fullName: u.full_name,
  role: u.role,
  universityId: u.university_id,
  university: u.university_name ? { id: u.university_id, name: u.university_name } : null,
  avatarUrl: u.avatar_url,
  bio: u.bio,
  avgRating: Number(u.avg_rating),
  reviewCount: u.review_count,
  isBanned: u.is_banned,
  emailVerified: u.email_verified,
  createdAt: u.created_at,
  updatedAt: u.updated_at,
})

function writeAuditLog(
  client: import('pg').PoolClient | null,
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  meta?: unknown,
  ipAddress?: string,
) {
  const logQuery = `INSERT INTO audit_logs (admin_id, action, target_type, target_id, meta, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`
  const params = [
    adminId,
    action,
    targetType,
    targetId,
    meta ? JSON.stringify(meta) : null,
    ipAddress ?? null,
  ]
  if (client) {
    return client.query(logQuery, params)
  }
  return query(logQuery, params)
}

export const login = async (email: string, password: string, ipAddress?: string) => {
  const admin = await queryOne<DbAdmin>(
    'SELECT id, email, password_hash, full_name, last_login_at, created_at FROM super_admins WHERE email = $1',
    [email],
  )
  if (!admin) throw new ApiError(401, 'Invalid email or password')

  const valid = await bcrypt.compare(password, admin.password_hash)
  if (!valid) throw new ApiError(401, 'Invalid email or password')

  await queryOne('UPDATE super_admins SET last_login_at = NOW() WHERE id = $1', [admin.id])

  await query(
    `INSERT INTO audit_logs (admin_id, action, target_type, target_id, ip_address)
     VALUES ($1, 'LOGIN', 'super_admin', $2, $3)`,
    [admin.id, admin.id, ipAddress ?? null],
  )

  return {
    id: admin.id,
    email: admin.email,
    fullName: admin.full_name,
  }
}

export const logout = async (adminId: string) => {
  await query(
    `INSERT INTO audit_logs (admin_id, action, target_type, target_id)
     VALUES ($1, 'LOGOUT', 'super_admin', $2)`,
    [adminId, adminId],
  )
}

export const getMe = async (adminId: string) => {
  const admin = await queryOne<DbAdmin>(
    'SELECT id, email, full_name, last_login_at, created_at FROM super_admins WHERE id = $1',
    [adminId],
  )
  if (!admin) throw new ApiError(404, 'Admin not found')

  return {
    id: admin.id,
    email: admin.email,
    fullName: admin.full_name,
    lastLoginAt: admin.last_login_at,
    createdAt: admin.created_at,
  }
}

export const getDashboard = async () => {
  const [{ count: totalUsers }] = await query<{ count: string }>('SELECT COUNT(*) FROM users')
  const [{ count: totalGigs }] = await query<{ count: string }>('SELECT COUNT(*) FROM gigs')
  const [{ count: totalApplications }] = await query<{ count: string }>(
    'SELECT COUNT(*) FROM applications',
  )
  const [{ count: activeUniversities }] = await query<{ count: string }>(
    'SELECT COUNT(DISTINCT university_id) FROM users WHERE university_id IS NOT NULL',
  )
  const [{ count: bannedUsers }] = await query<{ count: string }>(
    "SELECT COUNT(*) FROM users WHERE is_banned = true",
  )
  const [{ count: unverifiedUsers }] = await query<{ count: string }>(
    "SELECT COUNT(*) FROM users WHERE email_verified = false",
  )
  const [{ count: openGigs }] = await query<{ count: string }>(
    "SELECT COUNT(*) FROM gigs WHERE status = 'OPEN'",
  )
  const [{ count: completedGigs }] = await query<{ count: string }>(
    "SELECT COUNT(*) FROM gigs WHERE status = 'COMPLETED'",
  )

  return {
    totalUsers: Number(totalUsers),
    totalGigs: Number(totalGigs),
    totalApplications: Number(totalApplications),
    activeUniversities: Number(activeUniversities),
    bannedUsers: Number(bannedUsers),
    unverifiedUsers: Number(unverifiedUsers),
    openGigs: Number(openGigs),
    completedGigs: Number(completedGigs),
  }
}

export const listUsers = async (input: {
  role?: string
  universityId?: string
  isBanned?: string
  q?: string
  search?: string
  page?: number
  limit?: number
}) => {
  const { page, limit, skip } = parsePagination({
    page: String(input.page ?? 1),
    limit: String(input.limit ?? 10),
  })

  const conditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 0

  if (input.role) {
    paramIndex++
    conditions.push(`u.role = $${paramIndex}`)
    params.push(input.role)
  }

  if (input.universityId) {
    paramIndex++
    conditions.push(`u.university_id = $${paramIndex}`)
    params.push(input.universityId)
  }

  if (input.isBanned !== undefined) {
    paramIndex++
    conditions.push(`u.is_banned = $${paramIndex}`)
    params.push(input.isBanned === 'true')
  }

  const searchTerm = input.q ?? input.search
  if (searchTerm) {
    paramIndex++
    conditions.push(
      `to_tsvector('simple', coalesce(u.name, '') || ' ' || coalesce(u.full_name, '') || ' ' || coalesce(u.email, '')) @@ plainto_tsquery('simple', $${paramIndex})`,
    )
    params.push(searchTerm)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*) FROM users u ${whereClause}`,
    params,
  )
  const total = Number(count)

  const rows = await query<DbUser>(
    `SELECT u.id, u.email, u.name, u.full_name, u.role, u.university_id,
            u.avatar_url, u.bio, u.avg_rating, u.review_count,
            u.is_banned, u.email_verified, u.created_at, u.updated_at,
            univ.name AS university_name
     FROM users u
     LEFT JOIN universities univ ON univ.id = u.university_id
     ${whereClause}
     ORDER BY u.created_at DESC
     LIMIT ${limit} OFFSET ${skip}`,
    params,
  )

  const totalPages = Math.ceil(total / limit)

  return {
    data: rows.map(formatUser),
    total,
    page,
    limit,
    totalPages,
  }
}

export const updateUser = async (
  userId: string,
  data: UpdateUserInput,
  adminId: string,
) => {
  const user = await queryOne<DbUser>(
    `SELECT id, email, name, full_name, role, university_id,
            avatar_url, bio, avg_rating, review_count,
            is_banned, email_verified, created_at, updated_at
     FROM users WHERE id = $1`,
    [userId],
  )
  if (!user) throw new ApiError(404, 'User not found')

  const fields: string[] = []
  const values: unknown[] = []
  let i = 1

  if (data.fullName !== undefined) {
    fields.push(`full_name = $${i++}`)
    values.push(data.fullName)
  }
  if (data.isBanned !== undefined) {
    fields.push(`is_banned = $${i++}`)
    values.push(data.isBanned)
  }
  if (data.role !== undefined) {
    fields.push(`role = $${i++}`)
    values.push(data.role)
  }
  if (data.emailVerified !== undefined) {
    fields.push(`email_verified = $${i++}`)
    values.push(data.emailVerified)
  }
  if (data.universityId !== undefined) {
    fields.push(`university_id = $${i++}`)
    values.push(data.universityId)
  }

  if (fields.length === 0) throw new ApiError(400, 'No fields to update')

  values.push(userId)
  const updated = await queryOne<DbUser>(
    `UPDATE users SET ${fields.join(', ')}
     WHERE id = $${i}
     RETURNING id, email, name, full_name, role, university_id,
               avatar_url, bio, avg_rating, review_count,
               is_banned, email_verified, created_at, updated_at`,
    values,
  )

  const changedFields: Record<string, unknown> = {}
  if (data.fullName !== undefined) changedFields.fullName = data.fullName
  if (data.isBanned !== undefined) changedFields.isBanned = data.isBanned
  if (data.role !== undefined) changedFields.role = data.role
  if (data.emailVerified !== undefined) changedFields.emailVerified = data.emailVerified
  if (data.universityId !== undefined) changedFields.universityId = data.universityId

  await query(
    `INSERT INTO audit_logs (admin_id, action, target_type, target_id, meta)
     VALUES ($1, 'UPDATE_USER', 'user', $2, $3)`,
    [adminId, userId, JSON.stringify(changedFields)],
  )

  return formatUser(updated!)
}

export const deleteUser = async (userId: string, adminId: string) => {
  const user = await queryOne('SELECT id FROM users WHERE id = $1', [userId])
  if (!user) throw new ApiError(404, 'User not found')

  await transaction(async (client) => {
    await client.query('DELETE FROM users WHERE id = $1', [userId])
    await client.query(
      `INSERT INTO audit_logs (admin_id, action, target_type, target_id)
       VALUES ($1, 'DELETE_USER', 'user', $2)`,
      [adminId, userId],
    )
  })
}

export const listGigs = async (input: {
  status?: string
  category?: string
  categorySlug?: string
  universityId?: string
  posterId?: string
  q?: string
  search?: string
  page?: number
  limit?: number
}) => {
  const { page, limit, skip } = parsePagination({
    page: String(input.page ?? 1),
    limit: String(input.limit ?? 10),
  })

  const conditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 0

  if (input.status) {
    paramIndex++
    conditions.push(`g.status = $${paramIndex}`)
    params.push(input.status)
  }

  const lookupCategory = input.category ?? input.categorySlug
  if (lookupCategory) {
    paramIndex++
    conditions.push(`c.slug = $${paramIndex}`)
    params.push(lookupCategory)
  }

  if (input.universityId) {
    paramIndex++
    conditions.push(`g.university_id = $${paramIndex}`)
    params.push(input.universityId)
  }

  if (input.posterId) {
    paramIndex++
    conditions.push(`g.poster_id = $${paramIndex}`)
    params.push(input.posterId)
  }

  const gigSearchTerm = input.q ?? input.search
  if (gigSearchTerm) {
    paramIndex++
    conditions.push(
      `g.search_vector @@ plainto_tsquery('english', $${paramIndex})`,
    )
    params.push(gigSearchTerm)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*)
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     ${whereClause}`,
    params,
  )
  const total = Number(count)

  const rows = await query<DbGig>(
    `SELECT
       g.id, g.title, g.description, g.budget, g.location,
       g.status, g.slots, g.deadline, g.created_at,
       g.poster_id, g.university_id,
       c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
       u.full_name AS poster_full_name,
       u.avatar_url AS poster_avatar_url,
       (SELECT COUNT(*) FROM applications a WHERE a.gig_id = g.id) AS application_count
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     LEFT JOIN users u ON u.id = g.poster_id
     ${whereClause}
     ORDER BY g.created_at DESC
     LIMIT ${limit} OFFSET ${skip}`,
    params,
  )

  const totalPages = Math.ceil(total / limit)

  return {
    data: rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      budget: Number(row.budget),
      location: row.location,
      status: row.status,
      slots: row.slots,
      deadline: row.deadline,
      createdAt: row.created_at,
      category: row.category_id
        ? { id: row.category_id, name: row.category_name, slug: row.category_slug }
        : null,
      poster: {
        id: row.poster_id,
        fullName: row.poster_full_name,
        avatarUrl: row.poster_avatar_url,
      },
      applicationCount: Number(row.application_count),
      universityId: row.university_id,
    })),
    total,
    page,
    limit,
    totalPages,
  }
}

export const deleteGig = async (gigId: string, adminId: string) => {
  const gig = await queryOne('SELECT id FROM gigs WHERE id = $1', [gigId])
  if (!gig) throw new ApiError(404, 'Gig not found')

  await transaction(async (client) => {
    await client.query('DELETE FROM gigs WHERE id = $1', [gigId])
    await client.query(
      `INSERT INTO audit_logs (admin_id, action, target_type, target_id)
       VALUES ($1, 'DELETE_GIG', 'gig', $2)`,
      [adminId, gigId],
    )
  })
}

export const listAuditLogs = async (input: {
  adminId?: string
  action?: string
  dateFrom?: string
  dateTo?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}) => {
  const { page, limit, skip } = parsePagination({
    page: String(input.page ?? 1),
    limit: String(input.limit ?? 10),
  })

  const conditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 0

  if (input.adminId) {
    paramIndex++
    conditions.push(`al.admin_id = $${paramIndex}`)
    params.push(input.adminId)
  }

  if (input.action) {
    paramIndex++
    conditions.push(`al.action = $${paramIndex}`)
    params.push(input.action)
  }

  const dateFrom = input.dateFrom ?? input.from
  if (dateFrom) {
    paramIndex++
    conditions.push(`al.created_at >= $${paramIndex}`)
    params.push(dateFrom)
  }

  const dateTo = input.dateTo ?? input.to
  if (dateTo) {
    paramIndex++
    conditions.push(`al.created_at <= $${paramIndex}`)
    params.push(dateTo)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*) FROM audit_logs al ${whereClause}`,
    params,
  )
  const total = Number(count)

  const rows = await query<DbAuditLog>(
    `SELECT al.id, al.admin_id, al.action, al.target_type, al.target_id,
            al.meta, al.ip_address, al.created_at,
            sa.full_name AS admin_name, sa.email AS admin_email
     FROM audit_logs al
     LEFT JOIN super_admins sa ON sa.id = al.admin_id
     ${whereClause}
     ORDER BY al.created_at DESC
     LIMIT ${limit} OFFSET ${skip}`,
    params,
  )

  const totalPages = Math.ceil(total / limit)

  return {
    data: rows.map((row) => ({
      id: row.id,
      admin: row.admin_id
        ? { id: row.admin_id, fullName: row.admin_name, email: row.admin_email }
        : null,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      meta: row.meta,
      ip: row.ip_address,
      createdAt: row.created_at,
    })),
    total,
    page,
    limit,
    totalPages,
  }
}

export const listUniversities = async () => {
  const rows = await query<DbUniversity>(
    `SELECT
       u.id, u.name, u.city, u.type,
       COUNT(DISTINCT usr.id) AS user_count,
       (SELECT COUNT(*) FROM gigs g WHERE g.university_id = u.id) AS gig_count
     FROM universities u
     LEFT JOIN users usr ON usr.university_id = u.id
     GROUP BY u.id, u.name, u.city, u.type
     ORDER BY user_count DESC`,
  )

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    city: row.city,
    type: row.type,
    userCount: Number(row.user_count),
    gigCount: Number(row.gig_count),
  }))
}

export const createUniversity = async (data: CreateUniversityInput) => {
  const existing = await queryOne(
    'SELECT id FROM universities WHERE id = $1',
    [data.id],
  )
  if (existing) throw new ApiError(409, 'University with this ID already exists')

  await query(
    `INSERT INTO universities (id, name, city, type) VALUES ($1, $2, $3, $4)`,
    [data.id, data.name, data.city, data.type],
  )

  return {
    id: data.id,
    name: data.name,
    city: data.city,
    type: data.type,
  }
}

export const listReviews = async (input: {
  page?: number
  limit?: number
}) => {
  const { page, limit, skip } = parsePagination({
    page: String(input.page ?? 1),
    limit: String(input.limit ?? 20),
  })

  const [{ count }] = await query<{ count: string }>(
    'SELECT COUNT(*) FROM reviews',
  )
  const total = Number(count)

  const rows = await query<DbReview>(
    `SELECT
       r.id, r.rating, r.comment, r.created_at,
       r.reviewer_id,
       rev.full_name AS reviewer_name,
       r.reviewee_id,
       revw.full_name AS reviewee_name,
       r.gig_id,
       g.title AS gig_title
     FROM reviews r
     LEFT JOIN users rev ON rev.id = r.reviewer_id
     LEFT JOIN users revw ON revw.id = r.reviewee_id
     LEFT JOIN gigs g ON g.id = r.gig_id
     ORDER BY r.created_at DESC
     LIMIT ${limit} OFFSET ${skip}`,
  )

  const totalPages = Math.ceil(total / limit)

  return {
    data: rows.map((row) => ({
      id: row.id,
      reviewer: row.reviewer_id
        ? { id: row.reviewer_id, fullName: row.reviewer_name }
        : null,
      reviewee: row.reviewee_id
        ? { id: row.reviewee_id, fullName: row.reviewee_name }
        : null,
      gig: row.gig_id ? { id: row.gig_id, title: row.gig_title } : null,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
    })),
    total,
    page,
    limit,
    totalPages,
  }
}

export const listCategories = async () => {
  const rows = await query<DbCategory>(
    'SELECT id, name, slug FROM categories ORDER BY name',
  )
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
  }))
}

export const deleteReview = async (reviewId: string, adminId: string) => {
  const review = await queryOne<{ id: string; reviewee_id: string }>(
    'SELECT id, reviewee_id FROM reviews WHERE id = $1',
    [reviewId],
  )
  if (!review) throw new ApiError(404, 'Review not found')

  const { reviewee_id } = review

  await transaction(async (client) => {
    await client.query('DELETE FROM reviews WHERE id = $1', [reviewId])

    const stats = await client.query<{ avg: string; count: string }>(
      `SELECT COALESCE(AVG(rating), 0) AS avg, COUNT(*) AS count
       FROM reviews WHERE reviewee_id = $1`,
      [reviewee_id],
    )

    await client.query(
      'UPDATE users SET avg_rating = $1, review_count = $2 WHERE id = $3',
      [stats.rows[0].avg, Number(stats.rows[0].count), reviewee_id],
    )

    await client.query(
      `INSERT INTO audit_logs (admin_id, action, target_type, target_id)
       VALUES ($1, 'DELETE_REVIEW', 'review', $2)`,
      [adminId, reviewId],
    )
  })
}
