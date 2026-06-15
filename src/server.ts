import 'dotenv/config'
import http from 'http'
import { createApp } from './app'
import { env } from './config/env'
import { initSocket } from './lib/socket'

const app = createApp()
const server = http.createServer(app)
initSocket(server)

server.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`)
  console.log(`📄 Environment: ${env.NODE_ENV}`)
})
