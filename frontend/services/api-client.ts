import axios from 'axios'
import { getAuth } from '@clerk/nextjs'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add Clerk token to requests
apiClient.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== 'undefined') {
      const { getToken } = await import('@clerk/nextjs/client')
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch (error) {
    console.error('Failed to get Clerk token:', error)
  }
  return config
})

export default apiClient
