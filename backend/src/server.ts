import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api/', limiter)

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

// Placeholder routes
app.get('/api/users', (req, res) => {
  res.json({ message: 'User routes coming soon' })
})

app.get('/api/resume', (req, res) => {
  res.json({ message: 'Resume routes coming soon' })
})

app.get('/api/jobs', (req, res) => {
  res.json({ message: 'Job routes coming soon' })
})

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app