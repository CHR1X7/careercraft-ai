import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { email, password, fullName } = req.body

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
        },
      })

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      logger.info(`New user registered: ${email}`)

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      })
    } catch (error) {
      logger.error('Signup error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      logger.info(`User logged in: ${email}`)

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      })
    } catch (error) {
      logger.error('Login error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async refreshToken(req: Request, res: Response) {
    // Implementation for token refresh
    res.json({ message: 'Token refreshed' })
  }
}