import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { uploadAvatar, uploadChatFile } from '../middleware/upload'
import * as uploadController from '../controllers/uploadController'

const router = Router()

router.post('/avatar', authGuard, uploadAvatar, uploadController.uploadAvatar)
router.post('/chat/image', authGuard, uploadChatFile, uploadController.uploadChatImage)
router.post('/chat/voice', authGuard, uploadChatFile, uploadController.uploadChatVoice)

export default router
