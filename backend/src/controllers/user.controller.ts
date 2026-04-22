import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export class UserController {
  // Create or update user profile
  async createProfile(req: Request, res: Response) {
    try {
      const userId = req.userId!
      const { skills, experience, education, preferences } = req.body

      // Check if profile exists
      const existingProfile = await prisma.userProfile.findUnique({
        where: { userId }
      })

      let profile
      if (existingProfile) {
        profile = await prisma.userProfile.update({
          where: { userId },
          data: {
            skills: skills || existingProfile.skills,
            experience: experience || existingProfile.experience,
            education: education || existingProfile.education,
            preferences: preferences || existingProfile.preferences
          }
        })
      } else {
        profile = await prisma.userProfile.create({
          data: {
            userId,
            skills: skills || [],
            experience: experience || [],
            education: education || [],
            preferences: preferences || {}
          }
        })
      }

      logger.info(`User profile updated for userId: ${userId}`)
      res.status(201).json(profile)
    } catch (error) {
      logger.error('Create profile error:', error)
      res.status(500).json({ error: 'Failed to create profile' })
    }
  }

  // Get user profile by ID
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.userId!

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          resumes: true,
          applications: {
            include: { job: true }
          }
        }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      logger.info(`User profile fetched: ${userId}`)
      res.json(user)
    } catch (error) {
      logger.error('Get profile error:', error)
      res.status(500).json({ error: 'Failed to fetch profile' })
    }
  }

  // Update user preferences
  async updatePreferences(req: Request, res: Response) {
    try {
      const userId = req.userId!
      const { preferences } = req.body

      const profile = await prisma.userProfile.update({
        where: { userId },
        data: { preferences }
      })

      logger.info(`User preferences updated: ${userId}`)
      res.json(profile)
    } catch (error) {
      logger.error('Update preferences error:', error)
      res.status(500).json({ error: 'Failed to update preferences' })
    }
  }
}
