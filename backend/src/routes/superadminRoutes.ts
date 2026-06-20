import { Router } from 'express'
import { validate } from '../middleware/validate'
import { SuperAdminLoginSchema, UpdateUserSchema, CreateUniversitySchema } from '../dto/superadminDto'
import { superadminGuard } from '../middleware/superadminGuard'
import * as superadminController from '../controllers/superadminController'

const router = Router()

router.post('/auth/login', validate(SuperAdminLoginSchema), superadminController.login)
router.post('/auth/logout', superadminController.logout)
router.get('/auth/me', superadminGuard, superadminController.getMe)

router.get('/dashboard', superadminGuard, superadminController.getDashboard)
router.get('/users', superadminGuard, superadminController.listUsers)
router.patch('/users/:id', superadminGuard, validate(UpdateUserSchema), superadminController.updateUser)
router.delete('/users/:id', superadminGuard, superadminController.deleteUser)
router.get('/gigs', superadminGuard, superadminController.listGigs)
router.delete('/gigs/:id', superadminGuard, superadminController.deleteGig)
router.get('/audit-logs', superadminGuard, superadminController.listAuditLogs)
router.get('/universities', superadminGuard, superadminController.listUniversities)
router.post('/universities', superadminGuard, validate(CreateUniversitySchema), superadminController.createUniversity)
router.get('/reviews', superadminGuard, superadminController.listReviews)
router.delete('/reviews/:id', superadminGuard, superadminController.deleteReview)
router.get('/categories', superadminGuard, superadminController.listCategories)

export default router
