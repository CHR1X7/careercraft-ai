'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Briefcase, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import TailoredAnswer from '@/app/components/TailoredAnswer'
import { applicationService, Application } from '@/services/application.service'

export default function TailoredAnswersPage() {
  const { user } = useUser()
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

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
      if (data.length > 0) {
        setSelectedApp(data[0])
      }
    } catch (error) {
      console.error('Failed to load applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin">
            <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          </div>
          <p className="text-gray-600 font-medium">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Generate Interview Answers</h1>
          <p className="text-gray-600 mt-2">
            Get AI-generated, tailored answers for your interview questions
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar - Applications List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-blue-50 border-b">
                <h2 className="font-semibold text-gray-900">Your Applications</h2>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {applications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    <p className="mb-2">No applications yet</p>
                    <Link href="/applications" className="text-blue-600 hover:text-blue-700">
                      Create one
                    </Link>
                  </div>
                ) : (
                  applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`w-full p-4 text-left hover:bg-blue-50 transition ${
                        selectedApp?.id === app.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <p className="font-semibold text-gray-900 text-sm mb-1">
                        {app.job.title}
                      </p>
                      <p className="text-xs text-gray-600">{app.job.company}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3"
          >
            {selectedApp ? (
              <div className="space-y-6">
                {/* Selected Job Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedApp.job.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{selectedApp.job.company}</p>
                  {selectedApp.job.location && (
                    <p className="text-sm text-gray-500">{selectedApp.job.location}</p>
                  )}
                </div>

                {/* Tailored Answer Component */}
                <TailoredAnswer
                  applicationId={selectedApp.id}
                  onSave={(answer) => {
                    applicationService.updateApplicationNotes(selectedApp.id, { notes: answer })
                    toast.success('Answer saved!')
                  }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Application Selected
                </h3>
                <p className="text-gray-600">
                  Select an application from the list to generate interview answers
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
