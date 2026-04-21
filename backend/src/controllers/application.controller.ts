import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import axios from 'axios'

const prisma = new PrismaClient()

export class ApplicationController {
  // Create or get application
  async createApplication(req: Request, res: Response) {
    try {
      const { userId, jobId, jobTitle, company, jobUrl, jobDescription } = req.body

      // Create job if it doesn't exist
      let job = await prisma.job.findUnique({
        where: { url: jobUrl }
      })

      if (!job) {
        job = await prisma.job.create({
          data: {
            title: jobTitle || 'Job Position',
            company: company || 'Company',
            description: jobDescription || '',
            location: '',
            url: jobUrl
          }
        })
      }

      // Create or get application
      let application = await prisma.application.findFirst({
        where: {
          userId,
          jobId: job.id
        }
      })

      if (!application) {
        application = await prisma.application.create({
          data: {
            userId,
            jobId: job.id,
            status: 'NOT_SUBMITTED'
          }
        })
      }

      logger.info(`Application created for userId: ${userId}, jobId: ${job.id}`)
      res.status(201).json(application)
    } catch (error) {
      logger.error('Create application error:', error)
      res.status(500).json({ error: 'Failed to create application' })
    }
  }

  // Get all applications for user
  async getUserApplications(req: Request, res: Response) {
    try {
      const { userId } = req.params

      const applications = await prisma.application.findMany({
        where: { userId },
        include: { job: true }
      })

      logger.info(`Applications fetched for userId: ${userId}`)
      res.json(applications)
    } catch (error) {
      logger.error('Get applications error:', error)
      res.status(500).json({ error: 'Failed to fetch applications' })
    }
  }

  // Update application status
  async updateStatus(req: Request, res: Response) {
    try {
      const { applicationId } = req.params
      const { status } = req.body

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: { status }
      })

      logger.info(`Application status updated: ${applicationId} -> ${status}`)
      res.json(application)
    } catch (error) {
      logger.error('Update status error:', error)
      res.status(500).json({ error: 'Failed to update status' })
    }
  }

  // Generate tailored answer
  async generateTailoredAnswer(req: Request, res: Response) {
    try {
      const { applicationId, question } = req.body

      // Get application and job details
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true, user: { include: { profile: true } } }
      })

      if (!application) {
        return res.status(404).json({ error: 'Application not found' })
      }

      // Get user profile
      const userProfile = {
        skills: application.user.profile?.skills || [],
        experience: application.user.profile?.experience || [],
        education: application.user.profile?.education || []
      }

      // Call Python AI service
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000'
      const generatedAnswer = await axios.post(
        `${aiServiceUrl}/api/generate-answer`,
        {
          job_description: application.job.description,
          question: question,
          user_profile: userProfile
        }
      )

      logger.info(`Answer generated for applicationId: ${applicationId}`)
      res.json(generatedAnswer.data)
    } catch (error) {
      logger.error('Generate answer error:', error)
      res.status(500).json({ 
        error: 'Failed to generate answer',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Update cover letter/notes
  async updateApplicationNotes(req: Request, res: Response) {
    try {
      const { applicationId } = req.params
      const { coverLetter, notes } = req.body

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: {
          coverLetter: coverLetter || undefined,
          notes: notes || undefined
        }
      })

      logger.info(`Application notes updated: ${applicationId}`)
      res.json(application)
    } catch (error) {
      logger.error('Update notes error:', error)
      res.status(500).json({ error: 'Failed to update notes' })
    }
  }
}
