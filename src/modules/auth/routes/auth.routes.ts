import { Router } from 'express'
import { validate } from '../../../middleware/validate'
import { RegisterDto, LoginDto } from '../auth.dto'
import * as authController from '../controllers/auth.controller'

const router = Router()

router.post('/register', validate(RegisterDto), authController.register)
router.post('/login', validate(LoginDto), authController.login)

export default router
