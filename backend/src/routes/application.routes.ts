import { Router } from 'express'
import { ApplicationController } from '../controllers/application.controller'

const router = Router()
const applicationController = new ApplicationController()

// Create application
router.post('/', applicationController.createApplication.bind(applicationController))

// Get user applications
router.get('/user/:userId', applicationController.getUserApplications.bind(applicationController))

// Update application status
router.put('/:applicationId/status', applicationController.updateStatus.bind(applicationController))

// Generate tailored answer
router.post('/:applicationId/generate-answer', applicationController.generateTailoredAnswer.bind(applicationController))

// Update application notes
router.patch('/:applicationId/notes', applicationController.updateApplicationNotes.bind(applicationController))

export default router
