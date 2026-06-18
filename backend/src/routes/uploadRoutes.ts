import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { uploadAvatar } from '../middleware/upload'
import * as uploadController from '../controllers/uploadController'

const router = Router()

router.post('/avatar', authGuard, uploadAvatar, uploadController.uploadAvatar)

export default router
