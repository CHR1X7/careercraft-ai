import axios from 'axios'

// Ensure API_URL always has /api path
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
const API_URL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
  return config
})

export default apiClient
