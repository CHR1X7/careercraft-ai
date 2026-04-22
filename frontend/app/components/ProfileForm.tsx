'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Save, Plus, X } from 'lucide-react'
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

const industries = [
  'Aerospace', 'AI & Machine Learning', 'Automotive & Transportation', 'Consumer Goods',
  'Cybersecurity', 'Education', 'Financial Services', 'Energy', 'Biotechnology',
  'Consumer Software', 'Data & Analytics', 'Fintech', 'Consulting', 'Crypto & Web3',
  'Defense', 'Enterprise Software', 'Government & Public Sector', 'Industrial & Manufacturing',
  'Real Estate', 'Food & Agriculture', 'Hardware', 'Legal', 'Robotics & Automation',
  'Venture Capital', 'Design', 'Entertainment', 'Gaming', 'Healthcare',
  'Quantitative Finance', 'VR & AR', 'Social Impact'
]

const companySize = [
  { label: '1-10 employees', value: 10 },
  { label: '11-50 employees', value: 50 },
  { label: '51-200 employees', value: 200 },
  { label: '201-500 employees', value: 500 },
  { label: '501-1,000 employees', value: 1000 },
  { label: '1,001-5,000 employees', value: 5000 },
  { label: '5,001-10,000 employees', value: 10000 },
  { label: '10,001+ employees', value: 999999 }
]

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
  const [expectedSalary, setExpectedSalary] = useState('')
  const [minCompanySize, setMinCompanySize] = useState<number | null>(null)
  const [maxCompanySize, setMaxCompanySize] = useState<number | null>(null)
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([])
  const [excludedIndustries, setExcludedIndustries] = useState<string[]>([])
  const [preferredSkills, setPreferredSkills] = useState<string[]>([])
  const [excludedSkills, setExcludedSkills] = useState<string[]>([])

  useEffect(() => {
    if (user?.id) {
      loadProfile()
    }
  }, [user?.id])

  const loadProfile = async () => {
    try {
      const profile = await userService.getProfile()
      if (profile?.profile) {
        setSkills(profile.profile.skills || [])
        setExperience(profile.profile.experience || [])
        setEducation(profile.profile.education || [])
        setExpectedSalary(profile.profile.expectedSalary || '')
        setMinCompanySize(profile.profile.minCompanySize || null)
        setMaxCompanySize(profile.profile.maxCompanySize || null)
        setPreferredIndustries(profile.profile.preferredIndustries || [])
        setExcludedIndustries(profile.profile.excludedIndustries || [])
        setPreferredSkills(profile.profile.preferredSkills || [])
        setExcludedSkills(profile.profile.excludedSkills || [])
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

  const toggleIndustry = (industry: string, type: 'preferred' | 'excluded') => {
    if (type === 'preferred') {
      if (preferredIndustries.includes(industry)) {
        setPreferredIndustries(preferredIndustries.filter((i) => i !== industry))
      } else {
        setPreferredIndustries([...preferredIndustries, industry])
      }
    } else {
      if (excludedIndustries.includes(industry)) {
        setExcludedIndustries(excludedIndustries.filter((i) => i !== industry))
      } else {
        setExcludedIndustries([...excludedIndustries, industry])
      }
    }
  }

  const toggleSkillFilter = (skill: string, type: 'preferred' | 'excluded') => {
    if (type === 'preferred') {
      if (preferredSkills.includes(skill)) {
        setPreferredSkills(preferredSkills.filter((s) => s !== skill))
      } else {
        setPreferredSkills([...preferredSkills, skill])
      }
    } else {
      if (excludedSkills.includes(skill)) {
        setExcludedSkills(excludedSkills.filter((s) => s !== skill))
      } else {
        setExcludedSkills([...excludedSkills, skill])
      }
    }
  }

  const saveProfile = async () => {
    setLoading(true)
    const loadingToast = toast.loading('Saving profile...')
    try {
      await userService.createProfile({
        skills,
        experience,
        education,
        expectedSalary: expectedSalary ? parseFloat(expectedSalary) : null,
        minCompanySize,
        maxCompanySize,
        preferredIndustries,
        excludedIndustries,
        preferredSkills,
        excludedSkills
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8">
            Fill out your professional information to get better job matches and enable our AI to help you craft tailored applications
          </p>

          {/* Skills Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Core Skills</h2>
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Work Experience</h2>
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

          {/* Salary Preferences Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Compensation & Company</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Minimum Salary (USD)
                </label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="e.g., 100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">We'll only use this to match you with jobs</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Company Size
                  </label>
                  <select
                    value={minCompanySize || ''}
                    onChange={(e) => setMinCompanySize(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Any size</option>
                    {companySize.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Company Size
                  </label>
                  <select
                    value={maxCompanySize || ''}
                    onChange={(e) => setMaxCompanySize(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Any size</option>
                    {companySize.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Industries Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Industries</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Industries You're Interested In</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry, 'preferred')}
                      className={`p-3 rounded-lg border-2 font-medium transition text-left ${
                        preferredIndustries.includes(industry)
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Industries to Avoid</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry, 'excluded')}
                      className={`p-3 rounded-lg border-2 font-medium transition text-left ${
                        excludedIndustries.includes(industry)
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Filter Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Skill Preferences</h2>
            <p className="text-gray-600 mb-6">Mark skills you'd prefer to work with or want to avoid</p>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Preferred Skills (Indicate skill preference)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Machine Learning', 'SQL', 'Git', 'JavaScript', 'Java', 'Go', 'Rust', 'Data Analysis', 'Communication'].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkillFilter(skill, 'preferred')}
                      className={`p-3 rounded-lg border-2 font-medium transition text-sm ${
                        preferredSkills.includes(skill)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Skills to Avoid</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Machine Learning', 'SQL', 'Git', 'JavaScript', 'Java', 'Go', 'Rust', 'Data Analysis', 'Communication'].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkillFilter(skill, 'excluded')}
                      className={`p-3 rounded-lg border-2 font-medium transition text-sm ${
                        excludedSkills.includes(skill)
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
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