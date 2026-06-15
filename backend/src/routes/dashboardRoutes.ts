import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { requireRole } from '../middleware/requireRole'
import * as dashboardController from '../controllers/dashboardController'

const router = Router()

router.get('/worker', authGuard, requireRole('WORKER'), dashboardController.workerDashboard)
router.get('/poster', authGuard, requireRole('POSTER'), dashboardController.posterDashboard)

export default router
