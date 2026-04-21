import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import axios from 'axios'

const prisma = new PrismaClient()

export class ResumeController {
  // Upload/Create resume
  async createResume(req: Request, res: Response) {
    try {
      const { userId, title, content } = req.body

      const resume = await prisma.resume.create({
        data: {
          userId,
          title,
          content,
          isActive: true
        }
      })

      logger.info(`Resume created for userId: ${userId}`)
      res.status(201).json(resume)
    } catch (error) {
      logger.error('Create resume error:', error)
      res.status(500).json({ error: 'Failed to create resume' })
    }
  }

  // Get all resumes for user
  async getUserResumes(req: Request, res: Response) {
    try {
      const { userId } = req.params

      const resumes = await prisma.resume.findMany({
        where: { userId }
      })

      logger.info(`Resumes fetched for userId: ${userId}`)
      res.json(resumes)
    } catch (error) {
      logger.error('Get resumes error:', error)
      res.status(500).json({ error: 'Failed to fetch resumes' })
    }
  }

  // Analyze resume against job
  async analyzeResume(req: Request, res: Response) {
    try {
      const { userId, resumeId, jobUrl } = req.body

      // Get resume
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId }
      })

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' })
      }

      // Call Python AI service
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000'
      const analysis = await axios.post(
        `${aiServiceUrl}/api/analyze-resume`,
        {
          resume_text: resume.content,
          job_url: jobUrl
        }
      )

      logger.info(`Resume analyzed for userId: ${userId}`)
      res.json(analysis.data)
    } catch (error) {
      logger.error('Analyze resume error:', error)
      res.status(500).json({ 
        error: 'Failed to analyze resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Set resume as active
  async setActiveResume(req: Request, res: Response) {
    try {
      const { userId, resumeId } = req.body

      // Deactivate all user resumes
      await prisma.resume.updateMany({
        where: { userId },
        data: { isActive: false }
      })

      // Activate selected resume
      const resume = await prisma.resume.update({
        where: { id: resumeId },
        data: { isActive: true }
      })

      logger.info(`Active resume set for userId: ${userId}`)
      res.json(resume)
    } catch (error) {
      logger.error('Set active resume error:', error)
      res.status(500).json({ error: 'Failed to set active resume' })
    }
  }
}
