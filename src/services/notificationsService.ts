import { query, queryOne } from '../lib/db'
import { parsePagination } from '../utils/pagination'
import { ApiError } from '../utils/ApiError'
import type { ListNotificationsInput } from '../dto/notificationsDto'

interface DbNotification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}

export const listNotifications = async (userId: string, input: ListNotificationsInput) => {
  const { page, limit, skip } = parsePagination({ page: String(input.page), limit: String(input.limit) })

  const conditions: string[] = ['user_id = $1']
  const params: unknown[] = [userId]
  let paramIndex = 1

  if (input.unreadOnly) {
    paramIndex++
    conditions.push('NOT read')
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(*) FROM notifications ${whereClause}`,
    params
  )
  const total = Number(count)

  const rows = await query<DbNotification>(
    `SELECT id, user_id, type, title, message, read, created_at
     FROM notifications ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`,
    [...params, limit, skip]
  )

  const data = rows.map(r => ({
    id: r.id,
    type: r.type,
    title: r.title,
    message: r.message,
    time: r.created_at,
    read: r.read,
  }))

  const totalPages = Math.ceil(total / limit)
  return { data, meta: { page, limit, total, totalPages } }
}

export const markNotificationRead = async (id: string, userId: string, read: boolean) => {
  const notif = await queryOne<{ id: string; user_id: string }>(
    'SELECT id, user_id FROM notifications WHERE id = $1',
    [id]
  )
  if (!notif) throw new ApiError(404, 'Notification not found')
  if (notif.user_id !== userId) throw new ApiError(403, 'Not authorized')

  const [updated] = await query<DbNotification>(
    `UPDATE notifications SET read = $1 WHERE id = $2 RETURNING id, user_id, type, title, message, read, created_at`,
    [read, id]
  )
  return {
    id: updated.id,
    type: updated.type,
    title: updated.title,
    message: updated.message,
    time: updated.created_at,
    read: updated.read,
  }
}

export const markAllRead = async (userId: string) => {
  await query(
    'UPDATE notifications SET read = true WHERE user_id = $1 AND NOT read',
    [userId]
  )
}

export const getUnreadCount = async (userId: string) => {
  const [{ count }] = await query<{ count: string }>(
    'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND NOT read',
    [userId]
  )
  return { count: Number(count) }
}

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string
) => {
  await query(
    `INSERT INTO notifications (user_id, type, title, message) VALUES ($1, $2, $3, $4)`,
    [userId, type, title, message]
  )
}
