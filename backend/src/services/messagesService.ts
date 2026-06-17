import { query, queryOne } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import type { SendMessageInput } from '../dto/messagesDto'
import { createNotification } from './notificationsService'

interface DbMessage {
  id: string
  application_id: string
  sender_id: string
  body: string
  read: boolean
  sent_at: string
  attachments: any
}

export const listThreads = async (userId: string) => {
  const rows = await query<any>(
    `SELECT
       a.id AS application_id,
       g.id AS gig_id,
       g.title AS gig_title,
       CASE WHEN a.worker_id = $1 THEN g.poster_id ELSE a.worker_id END AS other_user_id,
       CASE WHEN a.worker_id = $1 THEN u_poster.full_name ELSE u_worker.full_name END AS other_user_name,
       CASE WHEN a.worker_id = $1 THEN u_poster.avatar_url ELSE u_worker.avatar_url END AS other_user_avatar,
       m.body AS last_message_body,
       m.sent_at AS last_message_sent_at,
       m.sender_id AS last_message_sender_id,
       (SELECT COUNT(*) FROM messages WHERE application_id = a.id AND sender_id != $1 AND NOT read) AS unread_count
     FROM applications a
     JOIN gigs g ON g.id = a.gig_id
     JOIN users u_worker ON u_worker.id = a.worker_id
     JOIN users u_poster ON u_poster.id = g.poster_id
     LEFT JOIN LATERAL (
       SELECT body, sent_at, sender_id FROM messages WHERE application_id = a.id ORDER BY sent_at DESC LIMIT 1
     ) m ON true
     WHERE a.worker_id = $1 OR g.poster_id = $1
     ORDER BY m.sent_at DESC NULLS LAST`,
    [userId]
  )

  return rows.map((row: any) => ({
    id: row.application_id,
    otherUser: {
      id: row.other_user_id,
      fullName: row.other_user_name,
      avatarUrl: row.other_user_avatar,
    },
    gigTitle: row.gig_title,
    messages: row.last_message_body
      ? [{
          id: '',
          fromUserId: row.last_message_sender_id,
          text: row.last_message_body,
          sentAt: row.last_message_sent_at,
          attachments: [],
        }]
      : [],
    unreadCount: Number(row.unread_count),
  }))
}

export const getThread = async (applicationId: string, userId: string) => {
  const app = await queryOne<{ id: string; worker_id: string; gig_id: string }>(
    'SELECT id, worker_id, gig_id FROM applications WHERE id = $1',
    [applicationId]
  )
  if (!app) throw new ApiError(404, 'Thread not found')

  const gig = await queryOne<{ title: string; poster_id: string }>(
    'SELECT title, poster_id FROM gigs WHERE id = $1',
    [app.gig_id]
  )
  if (!gig) throw new ApiError(404, 'Gig not found')
  if (gig.poster_id !== userId && app.worker_id !== userId) {
    throw new ApiError(403, 'You are not a participant in this thread')
  }

  const otherUserId = gig.poster_id === userId ? app.worker_id : gig.poster_id
  const otherUser = await queryOne<{ name: string; full_name: string; avatar_url: string | null }>(
    'SELECT name, full_name, avatar_url FROM users WHERE id = $1',
    [otherUserId]
  )

  const messages = await query<DbMessage>(
    `SELECT id, application_id, sender_id, body, read, sent_at, attachments
     FROM messages
     WHERE application_id = $1
     ORDER BY sent_at ASC`,
    [applicationId]
  )

  await query(
    `UPDATE messages SET read = true WHERE application_id = $1 AND sender_id != $2 AND NOT read`,
    [applicationId, userId]
  )

  return {
    id: app.id,
    otherUser: {
      id: otherUserId,
      fullName: otherUser?.full_name ?? otherUser?.name ?? '',
      avatarUrl: otherUser?.avatar_url ?? null,
    },
    gigTitle: gig.title,
    messages: messages.map(m => ({
      id: m.id,
      fromUserId: m.sender_id,
      text: m.body,
      sentAt: m.sent_at,
      attachments: m.attachments ?? [],
    })),
  }
}

export const sendMessage = async (applicationId: string, userId: string, data: SendMessageInput) => {
  const app = await queryOne<{ id: string; worker_id: string; gig_id: string }>(
    'SELECT id, worker_id, gig_id FROM applications WHERE id = $1',
    [applicationId]
  )
  if (!app) throw new ApiError(404, 'Application not found')

  const gig = await queryOne<{ poster_id: string; title: string }>(
    'SELECT poster_id, title FROM gigs WHERE id = $1',
    [app.gig_id]
  )
  if (!gig) throw new ApiError(404, 'Gig not found')
  if (gig.poster_id !== userId && app.worker_id !== userId) {
    throw new ApiError(403, 'You are not a participant in this thread')
  }

  const [message] = await query<DbMessage>(
    `INSERT INTO messages (application_id, sender_id, body, attachments)
     VALUES ($1, $2, $3, $4)
     RETURNING id, application_id, sender_id, body, read, sent_at, attachments`,
    [applicationId, userId, data.text, data.attachments ? JSON.stringify(data.attachments) : '[]']
  )

  const otherUserId = gig.poster_id === userId ? app.worker_id : gig.poster_id
  createNotification(otherUserId, 'message', 'New Message', `You have a new message about "${gig.title}"`)

  return {
    id: message.id,
    applicationId: message.application_id,
    fromUserId: message.sender_id,
    text: message.body,
    sentAt: message.sent_at,
    attachments: message.attachments ?? [],
  }
}
