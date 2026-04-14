import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middleware/validate'

const router = Router()
const authController = new AuthController()

router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('fullName').trim().notEmpty(),
    validate
  ],
  authController.signup.bind(authController)
)

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
  ],
  authController.login.bind(authController)
)

router.post('/refresh-token', authController.refreshToken.bind(authController))

export default router