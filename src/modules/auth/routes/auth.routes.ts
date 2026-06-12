import { Router } from 'express'
import { authGuard } from '../../../middleware/authGuard'
import { validate } from '../../../middleware/validate'
import { RegisterDto, LoginDto } from '../auth.dto'
import * as authController from '../controllers/auth.controller'

const router = Router()

router.post('/register', validate(RegisterDto), authController.register)
router.post('/login', validate(LoginDto), authController.login)
router.get('/me', authGuard, authController.getMe)

export default router
