'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Copy, Edit2, Loader, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { applicationService } from '@/services/application.service'

interface TailoredAnswerProps {
  applicationId: string
  initialQuestion?: string
  onSave?: (answer: string) => void
}

const commonQuestions = [
  'Why are you a good fit for this role?',
  'What is your biggest strength?',
  'Describe a time you overcame a challenge',
  'What are your career goals?',
  'Why do you want to work for our company?',
  'How do you handle failure?',
  'Tell us about your leadership experience',
  'What are your weaknesses?',
  'How do you stay updated with industry trends?',
  'Describe your experience with [specific skill/technology]'
]

export default function TailoredAnswer({
  applicationId,
  initialQuestion = '',
  onSave
}: TailoredAnswerProps) {
  const [step, setStep] = useState<'select' | 'generate' | 'edit'>('select')
  const [question, setQuestion] = useState(initialQuestion)
  const [customQuestion, setCustomQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSelectQuestion = (q: string) => {
    setQuestion(q)
    setStep('generate')
  }

  const handleCustomQuestion = () => {
    if (customQuestion.trim()) {
      setQuestion(customQuestion)
      setStep('generate')
    } else {
      toast.error('Please enter a question')
    }
  }

  const generateAnswer = async () => {
    if (!question.trim()) {
      toast.error('Please select or enter a question')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Generating tailored answer...')

    try {
      const response = await applicationService.generateTailoredAnswer(
        applicationId,
        question
      )
      setAnswer(response.answer)
      setStep('edit')
      toast.success('Answer generated!', { id: loadingToast })
    } catch (error) {
      console.error('Error generating answer:', error)
      toast.error('Failed to generate answer', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const saveAnswer = () => {
    if (onSave) {
      onSave(answer)
    }
    toast.success('Answer saved!')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Generate Tailored Answer</h1>
          </div>
          <p className="text-blue-100">
            AI-powered personalized answers to interview questions
          </p>
        </div>

        <div className="p-6 md:p-8">
          {step === 'select' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Select a common question
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuestion(q)}
                      className="p-4 border border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left font-medium text-gray-800 hover:text-blue-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Or ask your own question
                </h2>
                <div className="space-y-3">
                  <textarea
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Enter your interview question here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  />
                  <button
                    onClick={handleCustomQuestion}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Use Custom Question
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'generate' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">Your Question:</p>
                <p className="text-blue-900">{question}</p>
              </div>

              <button
                onClick={generateAnswer}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating answer...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Answer
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setStep('select')
                  setQuestion('')
                  setCustomQuestion('')
                }}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Back
              </button>
            </motion.div>
          )}

          {step === 'edit' && answer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">Question:</p>
                <p className="text-blue-900">{question}</p>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Generated Answer
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-48 font-medium text-gray-800"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Feel free to edit the answer to better match your voice
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={saveAnswer}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Save Answer
                </button>
              </div>

              <button
                onClick={() => {
                  setStep('select')
                  setQuestion('')
                  setCustomQuestion('')
                  setAnswer('')
                }}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Generate Another Answer
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
