import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { env } from '../config/env'

let io: SocketServer

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: [env.FRONTEND_URL],
      credentials: true,
    },
  })
  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}