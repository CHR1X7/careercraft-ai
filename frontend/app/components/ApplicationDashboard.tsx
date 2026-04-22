'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import {
  FileText,
  Clock,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Briefcase,
  ArrowRight,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'
import { applicationService, Application } from '@/services/application.service'

const statusConfig = {
  NOT_SUBMITTED: {
    label: 'Not Submitted',
    color: 'bg-gray-100 text-gray-800',
    icon: Clock
  },
  SUBMITTED: {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-800',
    icon: FileText
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Eye
  },
  INTERVIEW_REQUESTED: {
    label: 'Interview Requested',
    color: 'bg-purple-100 text-purple-800',
    icon: MessageSquare
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  }
}

interface ApplicationWithActions extends Application {
  loading?: boolean
}

export default function ApplicationDashboard() {
  const { user } = useUser()
  const [applications, setApplications] = useState<ApplicationWithActions[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadApplications()
    }
  }, [user?.id])

  const loadApplications = async () => {
    try {
      if (!user?.id) return
      const data = await applicationService.getUserApplications()
      setApplications(data)
    } catch (error) {
      console.error('Failed to load applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appId: string, newStatus: Application['status']) => {
    try {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, loading: true } : app
        )
      )

      await applicationService.updateStatus(appId, newStatus)
      
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus, loading: false } : app
        )
      )

      toast.success('Status updated!')
      setShowStatusMenu(null)
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, loading: false } : app
        )
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin">
            <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          </div>
          <p className="text-gray-600 font-medium">Loading your applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Applications</h1>
            <p className="text-gray-600">
              Track your job applications and their status
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            <Plus className="w-5 h-5" /> New Application
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', count: applications.length, color: 'bg-blue-50 text-blue-700' },
            {
              label: 'Submitted',
              count: applications.filter((a) => a.status !== 'NOT_SUBMITTED').length,
              color: 'bg-green-50 text-green-700'
            },
            {
              label: 'Under Review',
              count: applications.filter((a) => a.status === 'UNDER_REVIEW').length,
              color: 'bg-yellow-50 text-yellow-700'
            },
            {
              label: 'Interviews',
              count: applications.filter((a) => a.status === 'INTERVIEW_REQUESTED').length,
              color: 'bg-purple-50 text-purple-700'
            },
            {
              label: 'Accepted',
              count: applications.filter((a) => a.status === 'ACCEPTED').length,
              color: 'bg-green-50 text-green-700'
            }
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.color} rounded-lg p-4 text-center`}>
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start applying to jobs to see them here
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Find Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const config = statusConfig[app.status]
              const StatusIcon = config.icon

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200"
                >
                  <div className="p-6 flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {app.job.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{app.job.company}</p>
                      {app.job.location && (
                        <p className="text-sm text-gray-500">{app.job.location}</p>
                      )}
                      {app.notes && (
                        <p className="text-sm text-gray-700 mt-2 italic">
                          Notes: {app.notes}
                        </p>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowStatusMenu(showStatusMenu === app.id ? null : app.id)
                          }
                          disabled={app.loading}
                          className={`${config.color} px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-50`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {config.label}
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        {showStatusMenu === app.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            {Object.entries(statusConfig).map(([status, cfg]) => (
                              <button
                                key={status}
                                onClick={() =>
                                  updateStatus(app.id, status as Application['status'])
                                }
                                className="block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                              >
                                {cfg.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
