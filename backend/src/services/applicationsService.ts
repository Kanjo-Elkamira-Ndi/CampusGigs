import { query, queryOne } from '../lib/db'
import { parsePagination } from '../utils/pagination'
import { ApiError } from '../utils/ApiError'
import type { CreateApplicationInput } from '../dto/applicationsDto'
import { createNotification } from './notificationsService'

interface DbApplicationWithGig {
  id: string
  gig_id: string
  worker_id: string
  cover_note: string
  status: string
  applied_at: string
  gig_poster_id: string
  gig_slots: number
  gig_title: string
}

const getApplicationWithGig = async (applicationId: string) => {
  const row = await queryOne<DbApplicationWithGig>(
    `SELECT
       a.id,
       a.gig_id,
       a.worker_id,
       a.cover_note,
       a.status,
       a.applied_at,
       g.poster_id AS gig_poster_id,
       g.slots AS gig_slots,
       g.title AS gig_title
     FROM applications a
     JOIN gigs g ON g.id = a.gig_id
     WHERE a.id = $1`,
    [applicationId]
  )
  return row
}

const formatFullApplication = (row: any) => ({
  id: row.id,
  coverNote: row.cover_note,
  status: row.status,
  appliedAt: row.applied_at,
  gig: {
    id: row.gig_id,
    title: row.title,
    description: row.description,
    budget: Number(row.budget),
    location: row.location,
    universityId: row.university_id,
    universityName: row.university_name,
    city: row.city,
    category: row.category_name,
    categorySlug: row.category_slug,
    status: row.gig_status,
    slots: Number(row.slots),
    slotsRemaining: Number(row.slots) - Number(row.accepted_count ?? 0),
    deadline: row.deadline,
    createdAt: row.gig_created_at,
    poster: {
      id: row.poster_id,
      fullName: row.poster_full_name,
      avatarUrl: row.poster_avatar_url,
      universityName: row.poster_university_name,
      city: row.poster_city,
      avgRating: Number(row.poster_avg_rating ?? 0),
      reviewCount: Number(row.poster_review_count ?? 0),
    },
    applicationCount: Number(row.application_count ?? 0),
    isEasyApply: row.is_easy_apply,
    tags: row.tags ?? [],
  },
  worker: {
    id: row.worker_id,
    fullName: row.worker_full_name,
    avatarUrl: row.worker_avatar_url,
    universityName: row.worker_university_name,
    city: row.worker_city,
    avgRating: Number(row.worker_avg_rating ?? 0),
    reviewCount: Number(row.worker_review_count ?? 0),
    hiredCount: Number(row.worker_hired_count ?? 0),
    skills: row.worker_skills ?? [],
    hourlyRate: row.worker_hourly_rate ? Number(row.worker_hourly_rate) : null,
    bio: row.worker_bio ?? null,
    universityId: row.worker_university_id,
  },
})

const getFullApplication = async (applicationId: string) => {
  const row = await queryOne<any>(
    `SELECT
       a.id,
       a.cover_note,
       a.status,
       a.applied_at,
       g.id AS gig_id,
       g.title,
       g.description,
       g.budget,
       g.location,
       g.status AS gig_status,
       g.slots,
       g.deadline,
       g.created_at AS gig_created_at,
       g.university_id,
       g.is_easy_apply,
       g.tags,
       c.name AS category_name,
       c.slug AS category_slug,
       univ.name AS university_name,
       univ.city,
       (SELECT COUNT(*) FROM applications subq WHERE subq.gig_id = g.id) AS application_count,
       (SELECT COUNT(*) FROM applications subq WHERE subq.gig_id = g.id AND subq.status = 'ACCEPTED') AS accepted_count,
       u.id AS poster_id,
       u.full_name AS poster_full_name,
       u.avatar_url AS poster_avatar_url,
       u.avg_rating AS poster_avg_rating,
       u.review_count AS poster_review_count,
       poster_univ.name AS poster_university_name,
       poster_univ.city AS poster_city,
       w.id AS worker_id,
       w.full_name AS worker_full_name,
       w.avatar_url AS worker_avatar_url,
       w.bio AS worker_bio,
       w.avg_rating AS worker_avg_rating,
       w.review_count AS worker_review_count,
       w.hired_count AS worker_hired_count,
       w.skills AS worker_skills,
       w.hourly_rate AS worker_hourly_rate,
       w.university_id AS worker_university_id,
       w_univ.name AS worker_university_name,
       w_univ.city AS worker_city
     FROM applications a
     JOIN gigs g ON g.id = a.gig_id
     LEFT JOIN categories c ON c.id = g.category_id
     LEFT JOIN universities univ ON univ.id = g.university_id
     JOIN users u ON u.id = g.poster_id
     LEFT JOIN universities poster_univ ON poster_univ.id = u.university_id
     JOIN users w ON w.id = a.worker_id
     LEFT JOIN universities w_univ ON w_univ.id = w.university_id
     WHERE a.id = $1`,
    [applicationId]
  )
  if (!row) throw new ApiError(404, 'Application not found')
  return formatFullApplication(row)
}

const FULL_QUERY_JOINS = `
  JOIN gigs g ON g.id = a.gig_id
  LEFT JOIN categories c ON c.id = g.category_id
  LEFT JOIN universities univ ON univ.id = g.university_id
  JOIN users u ON u.id = g.poster_id
  LEFT JOIN universities poster_univ ON poster_univ.id = u.university_id
  JOIN users w ON w.id = a.worker_id
  LEFT JOIN universities w_univ ON w_univ.id = w.university_id
`

const FULL_QUERY_SELECT = `
  a.id,
  a.cover_note,
  a.status,
  a.applied_at,
  g.id AS gig_id,
  g.title,
  g.description,
  g.budget,
  g.location,
  g.status AS gig_status,
  g.slots,
  g.deadline,
  g.created_at AS gig_created_at,
  g.university_id,
  g.is_easy_apply,
  g.tags,
  c.name AS category_name,
  c.slug AS category_slug,
  univ.name AS university_name,
  univ.city,
  (SELECT COUNT(*) FROM applications subq WHERE subq.gig_id = g.id) AS application_count,
  (SELECT COUNT(*) FROM applications subq WHERE subq.gig_id = g.id AND subq.status = 'ACCEPTED') AS accepted_count,
  u.id AS poster_id,
  u.full_name AS poster_full_name,
  u.avatar_url AS poster_avatar_url,
  u.avg_rating AS poster_avg_rating,
  u.review_count AS poster_review_count,
  poster_univ.name AS poster_university_name,
  poster_univ.city AS poster_city,
  w.id AS worker_id,
  w.full_name AS worker_full_name,
  w.avatar_url AS worker_avatar_url,
  w.bio AS worker_bio,
  w.avg_rating AS worker_avg_rating,
  w.review_count AS worker_review_count,
  w.hired_count AS worker_hired_count,
  w.skills AS worker_skills,
  w.hourly_rate AS worker_hourly_rate,
  w.university_id AS worker_university_id,
  w_univ.name AS worker_university_name,
  w_univ.city AS worker_city
`

export const createApplication = async (
  gigId: string,
  workerId: string,
  data: CreateApplicationInput
) => {
  const gig = await queryOne<{ id: string; poster_id: string; status: string; slots: number }>(
    'SELECT id, poster_id, status, slots FROM gigs WHERE id = $1',
    [gigId]
  )
  if (!gig) throw new ApiError(404, 'Gig not found')
  if (gig.status !== 'OPEN') throw new ApiError(400, 'Gig is not open for applications')
  if (gig.poster_id === workerId) throw new ApiError(400, 'You cannot apply to your own gig')

  const worker = await queryOne<{ full_name: string }>(
    'SELECT full_name FROM users WHERE id = $1',
    [workerId]
  )

  try {
    const [application] = await query<{ id: string }>(
      `INSERT INTO applications (gig_id, worker_id, cover_note)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [gigId, workerId, data.coverNote]
    )

    // Notify the poster
    const gigInfo = await queryOne<{ title: string }>('SELECT title FROM gigs WHERE id = $1', [gigId])
    if (gigInfo) {
      createNotification(gig.poster_id, 'application', 'New Application', `"${worker?.full_name ?? 'A worker'}" applied to "${gigInfo.title}"`)
    }

    return getFullApplication(application.id)
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === '23505'
    ) {
      throw new ApiError(409, 'You have already applied to this gig')
    }
    throw err
  }
}

export const listGigApplications = async (gigId: string, posterId: string) => {
  const gig = await queryOne<{ id: string; poster_id: string }>(
    'SELECT id, poster_id FROM gigs WHERE id = $1',
    [gigId]
  )
  if (!gig) throw new ApiError(404, 'Gig not found')
  if (gig.poster_id !== posterId) throw new ApiError(403, 'You can only view applications for your own gigs')

  const rows = await query<any>(
    `SELECT ${FULL_QUERY_SELECT}
     FROM applications a
     ${FULL_QUERY_JOINS}
     WHERE a.gig_id = $1
     ORDER BY a.applied_at DESC`,
    [gigId]
  )

  return rows.map(formatFullApplication)
}

export const listMyApplications = async (
  userId: string,
  queryParams: { status?: string; page?: number; limit?: number }
) => {
  const { page, limit, skip } = parsePagination({ page: String(queryParams.page ?? 1), limit: String(queryParams.limit ?? 10) })

  const conditions: string[] = ['a.worker_id = $1']
  const params: unknown[] = [userId]
  let paramIndex = 1

  if (queryParams.status) {
    paramIndex++
    conditions.push(`a.status = $${paramIndex}`)
    params.push(queryParams.status)
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*) FROM applications a ${whereClause}`,
    params
  )
  const total = Number(count)

  const rows = await query<any>(
    `SELECT ${FULL_QUERY_SELECT}
     FROM applications a
     ${FULL_QUERY_JOINS}
     ${whereClause}
     ORDER BY a.applied_at DESC
     LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`,
    [...params, limit, skip]
  )

  const data = rows.map(formatFullApplication)

  const totalPages = Math.ceil(total / limit)
  return { data, meta: { page, limit, total, totalPages } }
}

export const acceptApplication = async (applicationId: string, posterId: string) => {
  const application = await getApplicationWithGig(applicationId)
  if (!application) throw new ApiError(404, 'Application not found')
  if (application.gig_poster_id !== posterId) throw new ApiError(403, 'You can only manage applications for your own gigs')
  if (application.status !== 'PENDING') throw new ApiError(400, 'Only pending applications can be accepted')

  await query(
    `UPDATE applications SET status = 'ACCEPTED', updated_at = NOW() WHERE id = $1`,
    [applicationId]
  )

  createNotification(application.worker_id, 'application', 'Application Accepted', `Your application for "${application.gig_title}" has been accepted`)

  return getFullApplication(applicationId)
}

export const rejectApplication = async (applicationId: string, posterId: string) => {
  const application = await getApplicationWithGig(applicationId)
  if (!application) throw new ApiError(404, 'Application not found')
  if (application.gig_poster_id !== posterId) throw new ApiError(403, 'You can only manage applications for your own gigs')
  if (application.status !== 'PENDING') throw new ApiError(400, 'Only pending applications can be rejected')

  await query(
    `UPDATE applications SET status = 'REJECTED', updated_at = NOW() WHERE id = $1`,
    [applicationId]
  )

  createNotification(application.worker_id, 'application', 'Application Rejected', `Your application for "${application.gig_title}" has been rejected`)

  return getFullApplication(applicationId)
}

export const completeApplication = async (applicationId: string, posterId: string) => {
  const application = await getApplicationWithGig(applicationId)
  if (!application) throw new ApiError(404, 'Application not found')
  if (application.gig_poster_id !== posterId) throw new ApiError(403, 'You can only manage applications for your own gigs')
  if (application.status !== 'ACCEPTED') throw new ApiError(400, 'Only accepted applications can be completed')

  await query(
    `UPDATE applications SET status = 'COMPLETED', updated_at = NOW() WHERE id = $1`,
    [applicationId]
  )

  return getFullApplication(applicationId)
}
