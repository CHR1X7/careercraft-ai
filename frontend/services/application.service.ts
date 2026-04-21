import apiClient from './api-client'

export interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface Application {
  id: string
  userId: string
  jobId: string
  job: Job
  status: 'NOT_SUBMITTED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'INTERVIEW_REQUESTED' | 'REJECTED' | 'ACCEPTED'
  coverLetter?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const applicationService = {
  // Create application
  async createApplication(data: {
    userId: string
    jobId?: string
    jobTitle?: string
    company?: string
    jobUrl: string
    jobDescription?: string
  }) {
    const response = await apiClient.post('/applications', data)
    return response.data as Application
  },

  // Get user applications
  async getUserApplications(userId: string) {
    const response = await apiClient.get(`/applications/user/${userId}`)
    return response.data as Application[]
  },

  // Update application status
  async updateStatus(
    applicationId: string,
    status: Application['status']
  ) {
    const response = await apiClient.put(`/applications/${applicationId}/status`, { status })
    return response.data as Application
  },

  // Generate tailored answer
  async generateTailoredAnswer(applicationId: string, question: string) {
    const response = await apiClient.post(
      `/applications/${applicationId}/generate-answer`,
      { question }
    )
    return response.data as { answer: string }
  },

  // Update application notes/cover letter
  async updateApplicationNotes(
    applicationId: string,
    data: { coverLetter?: string; notes?: string }
  ) {
    const response = await apiClient.patch(`/applications/${applicationId}/notes`, data)
    return response.data as Application
  }
}
