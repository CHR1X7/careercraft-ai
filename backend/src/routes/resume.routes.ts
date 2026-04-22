import { Router } from 'express'
import { ResumeController } from '../controllers/resume.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const resumeController = new ResumeController()

// All routes require authentication
router.use(authenticateToken)

// Create resume
router.post('/', resumeController.createResume.bind(resumeController))

// Get user resumes
router.get('/', resumeController.getUserResumes.bind(resumeController))

// Analyze resume
router.post('/analyze', resumeController.analyzeResume.bind(resumeController))

// Set active resume
router.put('/active', resumeController.setActiveResume.bind(resumeController))

export default router
