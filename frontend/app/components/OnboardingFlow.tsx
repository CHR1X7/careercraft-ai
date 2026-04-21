'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { userService } from '@/services/user.service'

const roleCategories = [
  'Software Engineering', 'Data & Analytics', 'Product Management',
  'Design', 'Sales & Marketing', 'Finance', 'HR & People Ops'
]

const locations = [
  'Remote', 'San Francisco', 'New York', 'Los Angeles', 'Chicago',
  'Austin', 'Seattle', 'Boston', 'Denver', 'Toronto'
]

const experienceLevels = [
  'Entry Level & New Grad', 'Junior (1-2 years)', 'Mid-level (3-4 years)',
  'Senior (5-8 years)', 'Expert & Leadership (9+ years)'
]

const skills = [
  'Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 
  'Docker', 'Machine Learning', 'SQL', 'Git', 'JavaScript', 'Java',
  'Go', 'Rust', 'Data Analysis', 'Communication'
]

interface OnboardingData {
  roles: string[]
  locations: string[]
  experience: string[]
  skills: string[]
}

export default function OnboardingFlow() {
  const { user } = useUser()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    roles: [],
    locations: [],
    experience: [],
    skills: []
  })

  const steps = ['Roles', 'Locations', 'Experience', 'Skills', 'Review']

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleItem = (field: keyof OnboardingData, item: string) => {
    setData((prev) => {
      const current = prev[field]
      const isSelected = current.includes(item)
      return {
        ...prev,
        [field]: isSelected ? current.filter((i) => i !== item) : [...current, item]
      }
    })
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return data.roles.length > 0 && data.roles.length <= 5
      case 1:
        return data.locations.length > 0
      case 2:
        return data.experience.length > 0 && data.experience.length <= 2
      case 3:
        return data.skills.length > 0
      default:
        return true
    }
  }

  const saveOnboarding = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      await userService.updatePreferences(user.id, {
        preferredRoles: data.roles,
        preferredLocations: data.locations,
        experienceLevels: data.experience,
        preferredSkills: data.skills,
        onboardingCompleted: true
      })
      toast.success('Profile preferences saved!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              What roles interest you?
            </h2>
            <p className="text-gray-600 mb-6">Select up to 5 roles</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {roleCategories.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    if (!data.roles.includes(role) && data.roles.length >= 5) {
                      toast.error('Maximum 5 roles allowed')
                      return
                    }
                    toggleItem('roles', role)
                  }}
                  className={`p-3 rounded-lg border-2 font-medium transition ${
                    data.roles.includes(role)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Where would you like to work?
            </h2>
            <p className="text-gray-600 mb-6">Select one or more locations</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => toggleItem('locations', loc)}
                  className={`p-3 rounded-lg border-2 font-medium transition ${
                    data.locations.includes(loc)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              What's your experience level?
            </h2>
            <p className="text-gray-600 mb-6">Select up to 2 levels</p>
            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    if (!data.experience.includes(level) && data.experience.length >= 2) {
                      toast.error('Maximum 2 levels allowed')
                      return
                    }
                    toggleItem('experience', level)
                  }}
                  className={`w-full p-4 rounded-lg border-2 font-medium transition text-left ${
                    data.experience.includes(level)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              What skills do you have?
            </h2>
            <p className="text-gray-600 mb-6">Select skills you're proficient in</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleItem('skills', skill)}
                  className={`p-3 rounded-lg border-2 font-medium transition ${
                    data.skills.includes(skill)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Review Your Preferences</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Preferred Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {data.roles.map((role) => (
                    <span key={role} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Preferred Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {data.locations.map((loc) => (
                    <span key={loc} className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Experience Levels</h3>
                <div className="flex flex-wrap gap-2">
                  {data.experience.map((level) => (
                    <span key={level} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <span key={skill} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((s, idx) => (
                <div
                  key={s}
                  className={`flex items-center ${idx < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      idx <= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {idx < step ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        idx < step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              {steps.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 disabled:text-gray-400 font-semibold"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>

            {step === steps.length - 1 ? (
              <button
                onClick={saveOnboarding}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
