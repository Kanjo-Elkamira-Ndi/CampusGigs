import { Router } from 'express'
import { authGuard } from '../../middleware/authGuard'
import { validate } from '../../middleware/validate'
import { UpdateProfileDto } from './users.dto'
import * as usersController from './users.controller'

const router = Router()

router.get('/me', authGuard, usersController.getMe)
router.patch('/me', authGuard, validate(UpdateProfileDto), usersController.updateMe)
router.get('/:id', usersController.getPublicProfile)

export default router
