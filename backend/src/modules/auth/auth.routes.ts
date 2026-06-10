import { Router } from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from '../../lib/betterAuth'
import { getMe } from './auth.controller'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

// Better Auth handles all /sign-up, /sign-in, /sign-out,
// /get-session, /forgot-password, /reset-password, /verify-email
// Mount the handler for all Better Auth native routes
router.all('/better-auth/*', toNodeHandler(auth))

// Custom route — returns full Campus Gigs user profile from our DB
// not just the Better Auth session object
router.get('/me', authGuard, getMe)

export default router