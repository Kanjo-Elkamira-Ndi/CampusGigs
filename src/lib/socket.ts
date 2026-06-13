import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { query, queryOne } from './db'

let io: SocketServer

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

  io.on('connection', (socket) => {
    const userId = (socket as any).userId
    console.log(`Socket connected: user ${userId}`)
    socket.join(`user:${userId}`)

    socket.on('join:thread', (threadId: string) => {
      socket.join(`thread:${threadId}`)
    })

    socket.on('message:send', async (data: { threadId: string; text: string }, callback) => {
      try {
        const app = await queryOne<{ id: string; worker_id: string; poster_id: string }>(
          'SELECT a.id, a.worker_id, g.poster_id FROM applications a JOIN gigs g ON g.id = a.gig_id WHERE a.id = $1',
          [data.threadId]
        )
        if (!app) {
          return callback?.({ success: false, error: 'Thread not found' })
        }
        if (app.worker_id !== userId && app.poster_id !== userId) {
          return callback?.({ success: false, error: 'Not a participant in this thread' })
        }

        const [message] = await query<any>(
          `INSERT INTO messages (application_id, sender_id, body)
           VALUES ($1, $2, $3)
           RETURNING id, application_id, sender_id, body, read, sent_at`,
          [data.threadId, userId, data.text]
        )

        const result = {
          id: message.id,
          applicationId: message.application_id,
          fromUserId: message.sender_id,
          text: message.body,
          sentAt: message.sent_at,
        }

        io.to(`thread:${data.threadId}`).emit('message:received', result)
        callback?.({ success: true, data: result })
      } catch (err) {
        callback?.({ success: false, error: 'Failed to send message' })
      }
    })

    socket.on('message:read', (threadId: string) => {
      query(
        `UPDATE messages SET read = true WHERE application_id = $1 AND sender_id != $2 AND NOT read`,
        [threadId, userId]
      ).catch(console.error)
    })

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: user ${userId}`)
    })
  })

  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}
