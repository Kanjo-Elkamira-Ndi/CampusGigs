import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { requireRole } from '../middleware/requireRole'
import { validate } from '../middleware/validate'
import { CreateApplicationSchema } from '../dto/applicationsDto'
import * as applicationsController from '../controllers/applicationsController'

const router = Router({ mergeParams: true })

router.post('/', authGuard, requireRole('WORKER'), validate(CreateApplicationSchema), applicationsController.createApplication)
router.get('/', authGuard, applicationsController.listGigApplications)

export default router
