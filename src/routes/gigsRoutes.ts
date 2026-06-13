import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { requireRole } from '../middleware/requireRole'
import { validate } from '../middleware/validate'
import { ListGigsSchema, CreateGigSchema } from '../dto/gigsDto'
import * as gigsController from '../controllers/gigsController'
import applicationRoutes from './applicationsRoutes'

const router = Router()

router.get('/', validate(ListGigsSchema, 'query'), gigsController.listGigs)
router.post('/', authGuard, requireRole('POSTER'), validate(CreateGigSchema), gigsController.createGig)
router.get('/:id', gigsController.getGigById)
router.use('/:id/applications', applicationRoutes)

export default router
