import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { superadminGuard } from '../middleware/superadminGuard'
import { validate } from '../middleware/validate'
import { CreateUniversityRequestSchema } from '../dto/universityRequestsDto'
import * as universityRequestsController from '../controllers/universityRequestsController'

const router = Router()

router.post('/', authGuard, validate(CreateUniversityRequestSchema), universityRequestsController.createRequest)
router.get('/my', authGuard, universityRequestsController.getMyRequest)

router.get('/', superadminGuard, universityRequestsController.listRequests)
router.patch('/:id/approve', superadminGuard, universityRequestsController.approveRequest)
router.patch('/:id/reject', superadminGuard, universityRequestsController.rejectRequest)

export default router
