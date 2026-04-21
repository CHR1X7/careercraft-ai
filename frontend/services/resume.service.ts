import apiClient from './api-client'

export interface Resume {
  id: string
  userId: string
  title: string
  content: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ResumeAnalysis {
  score: number
  summary: string
  matched_skills: string[]
  missing_skills: string[]
  suggestions: string[]
  strengths: string[]
  areas_for_improvement: string[]
}

export const resumeService = {
  // Create resume
  async createResume(userId: string, title: string, content: string) {
    const response = await apiClient.post('/resume', {
      userId,
      title,
      content
    })
    return response.data
  },

  // Get user resumes
  async getUserResumes(userId: string) {
    const response = await apiClient.get(`/resume/user/${userId}`)
    return response.data
  },

  // Analyze resume against job
  async analyzeResume(userId: string, resumeId: string, jobUrl: string) {
    const response = await apiClient.post('/resume/analyze', {
      userId,
      resumeId,
      jobUrl
    })
    return response.data as ResumeAnalysis
  },

  // Set resume as active
  async setActiveResume(userId: string, resumeId: string) {
    const response = await apiClient.put('/resume/active', {
      userId,
      resumeId
    })
    return response.data
  }
}
