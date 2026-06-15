import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { validate } from '../middleware/validate'
import { SendMessageSchema } from '../dto/messagesDto'
import * as messagesController from '../controllers/messagesController'

const router = Router()

router.get('/', authGuard, messagesController.listThreads)
router.get('/:threadId', authGuard, messagesController.getThread)
router.post('/:threadId', authGuard, validate(SendMessageSchema), messagesController.sendMessage)

export default router
