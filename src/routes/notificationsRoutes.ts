import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { validate } from '../middleware/validate'
import { ListNotificationsSchema, MarkNotifReadSchema } from '../dto/notificationsDto'
import * as notificationsController from '../controllers/notificationsController'

const router = Router()

router.get('/', authGuard, validate(ListNotificationsSchema, 'query'), notificationsController.list)
router.patch('/read-all', authGuard, notificationsController.markAllRead)
router.get('/unread-count', authGuard, notificationsController.unreadCount)
router.patch('/:id', authGuard, validate(MarkNotifReadSchema), notificationsController.markRead)

export default router
