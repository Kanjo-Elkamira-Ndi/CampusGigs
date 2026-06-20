import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { query, queryOne } from './db'

let io: SocketServer

const onlineUsers = new Map<string, Set<string>>()

const getOnlineUserIds = () => Array.from(onlineUsers.keys())

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: [env.FRONTEND_URL],
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || (socket.handshake.query?.token as string)
    if (!token) return next(new Error('Authentication required'))

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string; role: string }
      ;(socket as any).userId = payload.sub
      ;(socket as any).userEmail = payload.email
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', async (socket) => {
    const userId = (socket as any).userId

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set())
    }
    onlineUsers.get(userId)!.add(socket.id)

    socket.join(`user:${userId}`)

    await query('UPDATE users SET last_seen = NOW() WHERE id = $1', [userId]).catch(() => {})

    io.emit('user:online', { userId, onlineUserIds: getOnlineUserIds() })

    socket.on('join:thread', (threadId: string) => {
      socket.join(`thread:${threadId}`)
    })

    socket.on('leave:thread', (threadId: string) => {
      socket.leave(`thread:${threadId}`)
    })

    socket.on(
      'message:send',
      async (
        data: { threadId: string; text: string; attachments?: any[]; isVoice?: boolean; replyToId?: string },
        callback: Function,
      ) => {
        try {
          const app = await queryOne<{ id: string; worker_id: string; poster_id: string }>(
            'SELECT a.id, a.worker_id, g.poster_id FROM applications a JOIN gigs g ON g.id = a.gig_id WHERE a.id = $1',
            [data.threadId],
          )
          if (!app) return callback?.({ success: false, error: 'Thread not found' })
          if (app.worker_id !== userId && app.poster_id !== userId)
            return callback?.({ success: false, error: 'Not a participant' })

          const attsJson = data.attachments?.length
            ? JSON.stringify(data.attachments)
            : '[]'

          const [message] = await query<any>(
            `INSERT INTO messages (application_id, sender_id, body, attachments, is_voice, status, reply_to_id)
             VALUES ($1, $2, $3, $4, $5, 'sent', $6)
             RETURNING id, application_id, sender_id, body, read, sent_at, attachments, is_voice, status, reply_to_id`,
            [data.threadId, userId, data.text, attsJson, data.isVoice ?? false, data.replyToId ?? null],
          )

          // Fetch replied-to message if this is a reply
          let replyTo: any = null
          if (message.reply_to_id) {
            const replied = await queryOne<any>(
              'SELECT id, sender_id, body, is_voice FROM messages WHERE id = $1',
              [message.reply_to_id],
            )
            if (replied) {
              replyTo = {
                id: replied.id,
                fromUserId: replied.sender_id,
                text: replied.body,
                isVoice: replied.is_voice,
              }
            }
          }

          const result = {
            id: message.id,
            applicationId: message.application_id,
            fromUserId: message.sender_id,
            text: message.body,
            sentAt: message.sent_at,
            attachments: message.attachments ?? [],
            isVoice: message.is_voice,
            status: message.status,
            replyTo,
          }

          io.to(`thread:${data.threadId}`).emit('message:received', result)

          const otherUserId = app.worker_id === userId ? app.poster_id : app.worker_id
          const otherSockets = onlineUsers.get(otherUserId)
          const isInThread = otherSockets?.size
            ? Array.from(otherSockets).some((sid) =>
                io.sockets.sockets.get(sid)?.rooms.has(`thread:${data.threadId}`),
              )
            : false

          if (!isInThread) {
            io.to(`user:${otherUserId}`).emit('message:notification', {
              threadId: data.threadId,
              fromUserId: userId,
              text: data.isVoice ? '🎤 Voice message' : data.text,
              sentAt: message.sent_at,
            })
          }

          callback?.({ success: true, data: result })
        } catch {
          callback?.({ success: false, error: 'Failed to send message' })
        }
      },
    )

    socket.on('message:delivered', async (messageIds: string[]) => {
      if (!messageIds?.length) return
      try {
        await query(
          `UPDATE messages SET status = 'delivered' WHERE id = ANY($1::uuid[]) AND status = 'sent'`,
          [messageIds],
        )
        for (const msgId of messageIds) {
          const msg = await queryOne<any>('SELECT application_id FROM messages WHERE id = $1', [msgId])
          if (msg) {
            io.to(`thread:${msg.application_id}`).emit('message:status', {
              messageIds,
              status: 'delivered',
            })
          }
        }
      } catch {}
    })

    socket.on('message:read', async (threadId: string) => {
      try {
        const updated = await query<any>(
          `UPDATE messages SET status = 'read', read = true
           WHERE application_id = $1 AND sender_id != $2 AND status != 'read'
           RETURNING id`,
          [threadId, userId],
        )
        const ids = updated.map((r: any) => r.id)
        if (ids.length > 0) {
          io.to(`thread:${threadId}`).emit('message:status', {
            messageIds: ids,
            status: 'read',
          })
        }
      } catch {}
    })

    socket.on('typing:start', (threadId: string) => {
      socket.to(`thread:${threadId}`).emit('typing:start', { threadId, userId })
    })

    socket.on('typing:stop', (threadId: string) => {
      socket.to(`thread:${threadId}`).emit('typing:stop', { threadId, userId })
    })

    socket.on('disconnect', async () => {
      const sockets = onlineUsers.get(userId)
      if (sockets) {
        sockets.delete(socket.id)
        if (sockets.size === 0) {
          onlineUsers.delete(userId)
          await query('UPDATE users SET last_seen = NOW() WHERE id = $1', [userId]).catch(() => {})
          io.emit('user:offline', { userId, onlineUserIds: getOnlineUserIds() })
        }
      }
    })
  })

  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}
