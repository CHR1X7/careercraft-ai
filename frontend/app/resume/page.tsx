'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FileText,
  Search,
  Sparkles,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'
import { resumeService, ResumeAnalysis } from '@/services/resume.service'
import { applicationService } from '@/services/application.service'

export default function ResumePage() {
  const { user } = useUser()
  const router = useRouter()
  const [jobUrl, setJobUrl] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ResumeAnalysis | null>(null)
  const [activeResume, setActiveResume] = useState(false)
  const [savedResumes, setSavedResumes] = useState<any[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadResumes()
    }
  }, [user?.id])

  const loadResumes = async () => {
    try {
      if (!user?.id) return
      const resumes = await resumeService.getUserResumes(user.id)
      setSavedResumes(resumes)
      if (resumes.length > 0) {
        setSelectedResumeId(resumes[0].id)
        setResumeText(resumes[0].content)
      }
    } catch (error) {
      console.error('Failed to load resumes:', error)
    }
  }

  const saveResume = async () => {
    if (!user?.id || !resumeText.trim()) {
      toast.error('Please enter resume text')
      return
    }

    try {
      const resume = await resumeService.createResume(
        user.id,
        `Resume - ${new Date().toLocaleDateString()}`,
        resumeText
      )
      setSavedResumes([...savedResumes, resume])
      setSelectedResumeId(resume.id)
      toast.success('Resume saved!')
    } catch (error) {
      console.error('Failed to save resume:', error)
      toast.error('Failed to save resume')
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!jobUrl || !resumeText) {
      toast.error('Please provide both a Job URL and your Resume text.')
      return
    }

    if (!user?.id || !selectedResumeId) {
      toast.error('Please save a resume first')
      return
    }

    setIsAnalyzing(true)
    const loadingToast = toast.loading('AI is analyzing your resume... This takes about 10-15 seconds.')

    try {
      const analysis = await resumeService.analyzeResume(user.id, selectedResumeId, jobUrl)
      setResult(analysis)

      // Create application
      try {
        await applicationService.createApplication({
          userId: user.id,
          jobUrl,
          jobTitle: 'Job Position',
          company: 'Company'
        })
      } catch (appError) {
        console.error('Failed to create application:', appError)
      }

      toast.success('Analysis Complete!', { id: loadingToast })
    } catch (error: any) {
      console.error(error)
      toast.error(
        error.response?.data?.details || 'Failed to analyze. Please check the URL and try again.',
        { id: loadingToast }
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10" />
            Resume Analyzer
          </h1>
          <p className="text-blue-100">
            See how well your resume matches job descriptions and get actionable improvements
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 mt-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Input Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="text-blue-500 w-6 h-6" />
                  Resume Matcher
                </h2>
                <p className="text-gray-500">
                  Paste a job posting URL and your resume. Our AI will analyze the match.
                </p>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-5">
                {/* Job URL Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4" /> Job Posting URL
                  </label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://linkedin.com/jobs/..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Resume Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Your Resume
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="w-full p-3 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveResume}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Save Resume
                  </button>
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="animate-spin">⌛</span>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Saved Resumes */}
              {savedResumes.length > 0 && (
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 mb-3">Your Saved Resumes</h3>
                  <select
                    value={selectedResumeId || ''}
                    onChange={(e) => {
                      const resume = savedResumes.find((r) => r.id === e.target.value)
                      if (resume) {
                        setSelectedResumeId(resume.id)
                        setResumeText(resume.content)
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    {savedResumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {result ? (
              <div className="space-y-4">
                {/* Score Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
                  <p className="text-blue-100 text-sm font-medium mb-1">Match Score</p>
                  <div className="text-5xl font-bold mb-2">{result.score}%</div>
                  <p className="text-blue-100 text-sm">{result.summary}</p>
                </div>

                {/* Matched Skills */}
                {result.matched_skills.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Matched Skills ({result.matched_skills.length})
                    </h3>
                    <div className="space-y-2">
                      {result.matched_skills.map((skill) => (
                        <div key={skill} className="text-sm text-gray-700">
                          ✓ {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {result.missing_skills.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-200">
                    <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Missing Skills ({result.missing_skills.length})
                    </h3>
                    <div className="space-y-2">
                      {result.missing_skills.map((skill) => (
                        <div key={skill} className="text-sm text-gray-700">
                          • {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {result.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="text-sm text-gray-700">
                          {idx + 1}. {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Analyze your resume to see matching skills and improvement suggestions
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
