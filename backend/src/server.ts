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

// CORS - allow all origins
app.use(cors({
  origin: '*',
  credentials: true
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

// Health check - MUST be before routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CareerCraft Backend'
  })
})

// Root endpoint - MUST be before routes
app.get('/', (req, res) => {
  res.json({
    message: 'CareerCraft AI Backend',
    version: '1.0.0',
    status: 'running'
  })
})

// API Routes - mount at DIFFERENT paths to avoid conflicts!
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/applications', applicationRoutes)

// Error handling
app.use(errorHandler)

export default app

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})