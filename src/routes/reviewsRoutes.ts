import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { validate } from '../middleware/validate'
import { CreateReviewSchema } from '../dto/applicationsDto'
import * as reviewsController from '../controllers/reviewsController'

const router = Router()

router.post('/', authGuard, validate(CreateReviewSchema), reviewsController.createReview)

export default router
