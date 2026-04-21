import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()
const userController = new UserController()

// Create or update user profile
router.post('/profile', userController.createProfile.bind(userController))

// Get user profile by ID
router.get('/:userId', userController.getProfile.bind(userController))

// Update user preferences
router.put('/:userId/preferences', userController.updatePreferences.bind(userController))

export default router
