import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { validate } from '../middleware/validate'
import { UpdateProfileDto } from '../dto/usersDto'
import * as usersController from '../controllers/usersController'

const router = Router()

router.get('/me', authGuard, usersController.getMe)
router.patch('/me', authGuard, validate(UpdateProfileDto), usersController.updateMe)
router.get('/:id', usersController.getPublicProfile)

export default router
