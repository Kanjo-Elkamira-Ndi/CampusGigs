import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './modules/auth/auth.routes'

export const createApp = () => {
  const app = express()

  app.use(helmet())
  app.use(cors({
    origin: [env.FRONTEND_URL, env.ADMIN_PANEL_URL],
    credentials: true,
  }))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // routes registered here 
  app.use('/api/v1/auth', authRoutes)
  app.use(errorHandler)
  return app
}