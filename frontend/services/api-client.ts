import axios from 'axios'
import { auth } from '@clerk/nextjs/server'

// Ensure API_URL always has /api path
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
const API_URL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add Clerk token to all requests
apiClient.interceptors.request.use(async (config) => {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    console.warn('Failed to get Clerk token:', error)
  }
  return config
})

export default apiClient
