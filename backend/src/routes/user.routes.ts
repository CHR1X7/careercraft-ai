import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const userController = new UserController()

// All routes require authentication
router.use(authenticateToken)

// Create or update user profile
router.post('/profile', userController.createProfile.bind(userController))

// Get user profile by ID
router.get('/', userController.getProfile.bind(userController))

// Update user preferences
router.put('/preferences', userController.updatePreferences.bind(userController))

export default router
