import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import * as applicationsController from '../controllers/applicationsController'

const router = Router()

router.get('/', authGuard, applicationsController.listMyApplications)
router.patch('/:id/accept', authGuard, applicationsController.acceptApplication)
router.patch('/:id/reject', authGuard, applicationsController.rejectApplication)
router.patch('/:id/complete', authGuard, applicationsController.completeApplication)

export default router
