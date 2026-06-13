import { Router } from 'express'
import { authGuard } from '../middleware/authGuard'
import { validate } from '../middleware/validate'
import { RegisterDto, LoginDto, VerifyEmailSchema, RefreshDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from '../dto/authDto'
import * as authController from '../controllers/authController'

const router = Router()

router.post('/register', validate(RegisterDto), authController.register)
router.post('/login', validate(LoginDto), authController.login)
router.post('/logout', authGuard, authController.logout)
router.post('/refresh', validate(RefreshDto), authController.refresh)
router.get('/me', authGuard, authController.getMe)
router.post('/verify-email', validate(VerifyEmailSchema), authController.verifyEmail)
router.post('/resend-verification', authGuard, authController.resendVerification)
router.post('/change-password', authGuard, validate(ChangePasswordDto), authController.changePassword)
router.delete('/delete-account', authGuard, authController.deleteAccount)
router.post('/forgot-password', validate(ForgotPasswordDto), authController.forgotPassword)
router.post('/reset-password', validate(ResetPasswordDto), authController.resetPassword)
router.post('/sessions/sign-out-all', authGuard, authController.signOutAll)

export default router
