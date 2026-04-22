import apiClient from './api-client'

export interface UserProfile {
  id: string
  userId: string
  skills: string[]
  experience: any[]
  education: any[]
  preferences: any
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  fullName: string
  profile?: UserProfile
  resumes: any[]
  applications: any[]
}

export const userService = {
  // Create or update user profile
  async createProfile(data: {
    skills?: string[]
    experience?: any[]
    education?: any[]
    preferences?: any
  }) {
    const response = await apiClient.post('/users/profile', data)
    return response.data
  },

  // Get user profile by ID
  async getProfile() {
    const response = await apiClient.get('/users/')
    return response.data
  },

  // Update user preferences
  async updatePreferences(preferences: any) {
    const response = await apiClient.put('/users/preferences', { preferences })
    return response.data
  }
}
