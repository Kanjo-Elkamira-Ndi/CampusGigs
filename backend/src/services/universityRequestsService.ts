import { query, queryOne, transaction } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import { createNotification } from './notificationsService'
import type { CreateUniversityRequestInput } from '../dto/universityRequestsDto'

interface DbUniversityRequest {
  id: string
  user_id: string
  name: string
  city: string | null
  status: string
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

const formatRequest = (r: DbUniversityRequest) => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  city: r.city,
  status: r.status,
  createdAt: r.created_at,
  reviewedAt: r.reviewed_at,
  reviewedBy: r.reviewed_by,
})

export const createRequest = async (userId: string, input: CreateUniversityRequestInput) => {
  const existing = await queryOne<DbUniversityRequest>(
    `SELECT id, status FROM university_requests WHERE user_id = $1 AND status = 'PENDING'`,
    [userId]
  )
  if (existing) throw new ApiError(409, 'You already have a pending university request')

  const [request] = await query<DbUniversityRequest>(
    `INSERT INTO university_requests (user_id, name, city)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, input.name, input.city ?? null]
  )

  await queryOne(
    'UPDATE users SET university_request_status = $1 WHERE id = $2',
    ['PENDING', userId]
  )

  return formatRequest(request)
}

export const getMyRequest = async (userId: string) => {
  const request = await queryOne<DbUniversityRequest>(
    `SELECT * FROM university_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  )
  return request ? formatRequest(request) : null
}

export const listRequests = async (status?: string) => {
  const conditions: string[] = []
  const params: unknown[] = []

  if (status) {
    conditions.push(`status = $1`)
    params.push(status)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await query<DbUniversityRequest>(
    `SELECT * FROM university_requests ${whereClause} ORDER BY created_at DESC`,
    params
  )

  return rows.map(formatRequest)
}

export const approveRequest = async (requestId: string, adminId: string) => {
  const request = await queryOne<DbUniversityRequest>(
    `SELECT * FROM university_requests WHERE id = $1`,
    [requestId]
  )
  if (!request) throw new ApiError(404, 'University request not found')
  if (request.status !== 'PENDING') throw new ApiError(400, 'Request is not pending')

  await transaction(async (client) => {
    const uniId = `custom_${request.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`

    await client.query(
      `INSERT INTO universities (id, name, city, type) VALUES ($1, $2, $3, 'public')
       ON CONFLICT (id) DO NOTHING`,
      [uniId, request.name, request.city ?? '']
    )

    await client.query(
      `UPDATE university_requests SET status = 'APPROVED', reviewed_at = NOW(), reviewed_by = $1 WHERE id = $2`,
      [adminId, requestId]
    )

    await client.query(
      `UPDATE users SET university_id = $1, university_request_status = 'APPROVED' WHERE id = $2`,
      [uniId, request.user_id]
    )
  })

  await createNotification(
    request.user_id,
    'university_approved',
    'University Approved',
    `Your suggested university "${request.name}" has been approved and added to your profile.`
  )
}

export const rejectRequest = async (requestId: string, adminId: string) => {
  const request = await queryOne<DbUniversityRequest>(
    `SELECT * FROM university_requests WHERE id = $1`,
    [requestId]
  )
  if (!request) throw new ApiError(404, 'University request not found')
  if (request.status !== 'PENDING') throw new ApiError(400, 'Request is not pending')

  await queryOne(
    `UPDATE university_requests SET status = 'REJECTED', reviewed_at = NOW(), reviewed_by = $1 WHERE id = $2`,
    [adminId, requestId]
  )

  await queryOne(
    `UPDATE users SET university_request_status = 'REJECTED' WHERE id = $1`,
    [request.user_id]
  )

  await createNotification(
    request.user_id,
    'university_rejected',
    'University Request Declined',
    `Your suggested university "${request.name}" was not approved. You can suggest a different one.`
  )
}
