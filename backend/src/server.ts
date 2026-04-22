import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import resumeRoutes from './routes/resume.routes'
import applicationRoutes from './routes/application.routes'
import { errorHandler } from './middleware/errorHandler'
import { logger } from './utils/logger'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
// Security
app.use(helmet())
// CORS configuration - include all origins directly
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://careercraft-ai-aske.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Clerk-Session-Token']
}))
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)
// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CareerCraft Backend'
  })
})
// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CareerCraft AI Backend',
    version: '1.0.0',
    status: 'running'
  })
})
// API Routes - remove /api/ prefix
app.use('/', authRoutes)        // → /auth
app.use('/', userRoutes)        // → /users
app.use('/', resumeRoutes)     // → /resume  ✅
app.use('/', applicationRoutes) // → /applications
// Error handling
app.use(errorHandler)
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})
export default app