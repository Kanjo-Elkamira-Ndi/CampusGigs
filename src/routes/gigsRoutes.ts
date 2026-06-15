import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { requireRole } from '../middleware/requireRole'
import { validate } from '../middleware/validate'
import { ListGigsSchema, CreateGigSchema, UpdateGigSchema } from '../dto/gigsDto'
import * as gigsController from '../controllers/gigsController'
import applicationRoutes from './applicationsRoutes'

const router = Router()

router.get('/', validate(ListGigsSchema, 'query'), gigsController.listGigs)
router.get('/saved', authGuard, gigsController.getSavedGigs)
router.post('/', authGuard, requireRole('POSTER'), validate(CreateGigSchema), gigsController.createGig)
router.get('/:id', gigsController.getGigById)
router.patch('/:id', authGuard, validate(UpdateGigSchema), gigsController.updateGig)
router.delete('/:id', authGuard, gigsController.deleteGig)
router.patch('/:id/close', authGuard, gigsController.closeGig)
router.post('/:id/save', authGuard, gigsController.saveGig)
router.delete('/:id/save', authGuard, gigsController.unsaveGig)
router.use('/:id/applications', applicationRoutes)

export default router
