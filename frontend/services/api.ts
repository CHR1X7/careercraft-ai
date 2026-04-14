import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth Services
export const authService = {
  signup: async (data: { fullName: string; email: string; password: string }) => {
    const response = await apiClient.post('/auth/signup', data)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    return response.data
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('authToken')
  },
}

// User Services
export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile')
    return response.data
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put('/users/profile', data)
    return response.data
  },
}

// Resume Services
export const resumeService = {
  analyzeResume: async (data: { resumeText: string; jobUrl: string }) => {
    const response = await apiClient.post('/resume/analyze', data)
    return response.data
  },

  uploadResume: async (file: File) => {
    const formData = new FormData()
    formData.append('resume', file)
    const response = await apiClient.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

// Job Services
export const jobService = {
  searchJobs: async (params: any) => {
    const response = await apiClient.get('/jobs/search', { params })
    return response.data
  },

  getJobDetails: async (jobId: string) => {
    const response = await apiClient.get(`/jobs/${jobId}`)
    return response.data
  },
}

// AI Services
export const aiService = {
  generateAnswer: async (data: {
    jobDescription: string
    question: string
    userProfile: any
  }) => {
    const response = await apiClient.post('/ai/generate-answer', data)
    return response.data
  },

  chatWithAssistant: async (message: string) => {
    const response = await apiClient.post('/ai/chat', { message })
    return response.data
  },
}

export default apiClient