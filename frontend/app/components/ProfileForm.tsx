'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Save, Plus, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { userService } from '@/services/user.service'

interface Experience {
  company: string
  position: string
  duration: string
  description: string
}

interface Education {
  school: string
  degree: string
  field: string
  year: string
}

export default function ProfileForm() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [experience, setExperience] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [isAddingExp, setIsAddingExp] = useState(false)
  const [isAddingEdu, setIsAddingEdu] = useState(false)

  const [expForm, setExpForm] = useState<Experience>({
    company: '',
    position: '',
    duration: '',
    description: ''
  })

  const [eduForm, setEduForm] = useState<Education>({
    school: '',
    degree: '',
    field: '',
    year: ''
  })

  useEffect(() => {
    if (user?.id) {
      loadProfile()
    }
  }, [user?.id])

  const loadProfile = async () => {
    try {
      if (!user?.id) return
      const profile = await userService.getProfile(user.id)
      if (profile.profile) {
        setSkills(profile.profile.skills || [])
        setExperience(profile.profile.experience || [])
        setEducation(profile.profile.education || [])
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const addExperience = () => {
    if (expForm.company && expForm.position) {
      setExperience([...experience, expForm])
      setExpForm({ company: '', position: '', duration: '', description: '' })
      setIsAddingExp(false)
    }
  }

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index))
  }

  const addEducation = () => {
    if (eduForm.school && eduForm.degree) {
      setEducation([...education, eduForm])
      setEduForm({ school: '', degree: '', field: '', year: '' })
      setIsAddingEdu(false)
    }
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const saveProfile = async () => {
    if (!user?.id) {
      toast.error('User not found')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Saving profile...')

    try {
      await userService.createProfile({
        userId: user.id,
        skills,
        experience,
        education
      })
      toast.success('Profile saved successfully!', { id: loadingToast })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600 mb-8">
            Build your professional profile to get better job matches
          </p>

          {/* Skills Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Skills</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., Python, React, etc.)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                    {exp.description && (
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeExperience(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {isAddingExp ? (
                <div className="border border-blue-300 rounded-lg p-4 bg-blue-50 space-y-4">
                  <input
                    type="text"
                    placeholder="Company"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={expForm.position}
                    onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2022-2024)"
                    value={expForm.duration}
                    onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Description"
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addExperience}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingExp(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingExp(true)}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Education</h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    {edu.field && <p className="text-sm text-gray-500">Field: {edu.field}</p>}
                    {edu.year && <p className="text-sm text-gray-500">Year: {edu.year}</p>}
                  </div>
                  <button
                    onClick={() => removeEducation(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {isAddingEdu ? (
                <div className="border border-blue-300 rounded-lg p-4 bg-blue-50 space-y-4">
                  <input
                    type="text"
                    placeholder="School/University"
                    value={eduForm.school}
                    onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={eduForm.field}
                    onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={eduForm.year}
                    onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addEducation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingEdu(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingEdu(true)}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveProfile}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
