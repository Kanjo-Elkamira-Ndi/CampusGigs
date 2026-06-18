import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'
import usersRoutes from './routes/usersRoutes'
import categoriesRoutes from './routes/categoriesRoutes'
import freelancersRoutes from './routes/freelancersRoutes'
import gigsRoutes from './routes/gigsRoutes'
import myApplicationsRoutes from './routes/myApplicationsRoutes'
import reviewsRoutes from './routes/reviewsRoutes'
import messagesRoutes from './routes/messagesRoutes'
import superadminRoutes from './routes/superadminRoutes'
import notificationsRoutes from './routes/notificationsRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import uploadRoutes from './routes/uploadRoutes'
import universityRequestsRoutes from './routes/universityRequestsRoutes'

export const createApp = () => {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: [env.FRONTEND_URL, env.ADMIN_PANEL_URL],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
  )
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    })
  })

  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/users', usersRoutes)
  app.use('/api/v1/categories', categoriesRoutes)
  app.use('/api/v1/freelancers', freelancersRoutes)
  app.use('/api/v1/gigs', gigsRoutes)
  app.use('/api/v1/my-applications', myApplicationsRoutes)
  app.use('/api/v1/reviews', reviewsRoutes)
  app.use('/api/v1/messages', messagesRoutes)
  app.use('/api/v1/superadmin', superadminRoutes)
  app.use('/api/v1/notifications', notificationsRoutes)
  app.use('/api/v1/dashboard', dashboardRoutes)
  app.use('/api/v1/upload', uploadRoutes)
  app.use('/api/v1/university-requests', universityRequestsRoutes)

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
  })

  app.use(errorHandler)
  return app
}
