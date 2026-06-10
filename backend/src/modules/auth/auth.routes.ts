import { Router } from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from '../../lib/betterAuth'
import { getMe } from './auth.controller'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.get('/me', authGuard, getMe)
router.all('/*path', toNodeHandler(auth))

export default router
