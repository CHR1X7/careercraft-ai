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
      logger.warn('No token provided for protected route:', req.path)
      return res.status(401).json({ error: 'Access token required' })
    }

    // Decode token without verification first to extract userId/sub
    const decoded: any = jwt.decode(token, { complete: true })
    
    if (!decoded) {
      logger.error('Failed to decode token')
      return res.status(403).json({ error: 'Invalid token format' })
    }

    // Extract userId from either 'userId' or 'sub' (Clerk uses 'sub')
    const userId = decoded.payload?.userId || decoded.payload?.sub
    
    if (!userId) {
      logger.error('No userId found in token payload:', decoded.payload)
      return res.status(403).json({ error: 'Invalid token: missing userId' })
    }

    // Attach userId to request
    req.userId = userId
    req.email = decoded.payload?.email || ''
    
    logger.info(`✅ Auth successful for userId: ${userId}`)
    next()
  } catch (error) {
    logger.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Authentication error' })
  }
}