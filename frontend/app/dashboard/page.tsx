'use client'

import { useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Briefcase, FileText, Search, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Dashboard() {
  const { user } = useUser()
  const [jobUrl, setJobUrl] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobUrl || !resumeText) {
      toast.error('Please provide both a Job URL and your Resume text.')
      return
    }

    setIsAnalyzing(true)
    const loadingToast = toast.loading('AI is scraping the job and analyzing your resume... This takes about 10-15 seconds. 🤖')

    try {
      // Calling our Python AI Service directly for the heavy lifting
      const response = await axios.post(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/api/analyze-resume`, {
        job_url: jobUrl,
        resume_text: resumeText
      })

      setResult(response.data)
      toast.success('Analysis Complete!', { id: loadingToast })
    } catch (error: any) {
      console.error(error)
      toast.error('Failed to analyze. Please check the URL and try again.', { id: loadingToast })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Briefcase className="text-blue-600 w-6 h-6" />
          <span className="font-bold text-xl">CareerCraft AI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium hidden md:block">
            Welcome, {user?.firstName}!
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 mt-6 grid md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-800">AI Resume Matcher</h2>
          </div>
          <p className="text-gray-500 mb-6">Paste a job posting URL and your resume. Our AI will scrape the job and tell you exactly how to tailor your resume to get the interview.</p>

          <form onSubmit={handleAnalyze} className="space-y-5">
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Paste Your Resume
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="John Doe&#10;Software Engineer&#10;Experience..."
                className="w-full p-3 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isAnalyzing ? (
                <span className="animate-pulse">🧠 AI is thinking...</span>
              ) : (
                <>Analyze Match <Sparkles className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </motion.div>

        {/* RIGHT COLUMN: AI Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {!result && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <div className="bg-gray-50 p-4 rounded-full">
                <Target className="w-12 h-12 text-gray-300" />
              </div>
              <p>Your AI analysis will appear here.<br/>Ready to land your dream job?</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-blue-600 font-medium animate-pulse">Scraping job & analyzing skills...</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-6">
              {/* Score Header */}
              <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Match Score</h3>
                <div className={`text-6xl font-black ${result.analysis.score >= 80 ? 'text-green-500' : result.analysis.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {result.analysis.score}%
                </div>
                <p className="text-gray-700 mt-3 font-medium">{result.job_info?.title} @ {result.job_info?.company}</p>
                <p className="text-sm text-gray-500 mt-2">{result.analysis.summary}</p>
              </div>

              {/* Matched & Missing Skills */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-semibold text-green-800 flex items-center gap-1 mb-3">
                    <CheckCircle className="w-4 h-4" /> Matched Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.matched_skills.map((skill: string, i: number) => (
                      <span key={i} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="font-semibold text-red-800 flex items-center gap-1 mb-3">
                    <AlertCircle className="w-4 h-4" /> Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.missing_skills.map((skill: string, i: number) => (
                      <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Suggestions */}
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> How to improve your resume:
                </h4>
                <ul className="space-y-3">
                  {result.analysis.suggestions.map((suggestion: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                      <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}

// Just a small dummy icon component for the empty state
function Target(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
}