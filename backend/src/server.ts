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
const PORT = Number(process.env.PORT) || 5000  // ✅ Convert to number

// Security
app.use(helmet())

// CORS - allow specific origins
const allowedOrigins = [
  'https://careercraft-ai-aske.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS policy violation'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/applications', applicationRoutes)

// Error handling
app.use(errorHandler)

export default app

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})