import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      email?: string
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // ✅ Allow public routes without auth
  const publicPaths = ['/', '/health', '/api/health']
  if (publicPaths.includes(req.path)) {
    return next()
  }

  // ✅ Handle CORS preflight (OPTIONS) without auth
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret',
      (err: any, decoded: any) => {
        if (err) {
          logger.error('Token verification failed:', err.message)
          return res.status(403).json({ error: 'Invalid or expired token' })
        }

        req.userId = decoded.userId
        req.email = decoded.email
        next()
      }
    )
  } catch (error) {
    logger.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Authentication error' })
  }
}