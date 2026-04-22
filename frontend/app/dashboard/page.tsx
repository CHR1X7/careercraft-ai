'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Briefcase,
  FileText,
  Target,
  Sparkles,
  User,
  MessageSquare,
  BarChart3,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { userService } from '@/services/user.service'

export default function Dashboard() {
  const { user } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        if (user?.id) {
          const profile = await userService.getProfile()
          if (profile?.profile && !profile.profile.profileCompleted) {
            router.push('/profile')
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkProfileCompletion()
  }, [user?.id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const features = [
    {
      id: 'resume',
      icon: FileText,
      title: 'Resume Analyzer',
      description: 'Analyze how well your resume matches job descriptions',
      href: '/resume',
      color: 'from-blue-600 to-blue-400'
    },
    {
      id: 'applications',
      icon: Target,
      title: 'Track Applications',
      description: 'Keep track of all your job applications and their status',
      href: '/applications',
      color: 'from-purple-600 to-purple-400'
    },
    {
      id: 'answers',
      icon: MessageSquare,
      title: 'Interview Answers',
      description: 'Generate tailored answers to common interview questions',
      href: '/answers',
      color: 'from-green-600 to-green-400'
    },
    {
      id: 'profile',
      icon: User,
      title: 'My Profile',
      description: 'Manage your skills, experience, and preferences',
      href: '/profile',
      color: 'from-orange-600 to-orange-400'
    },
    {
      id: 'onboarding',
      icon: Sparkles,
      title: 'Preferences',
      description: 'Update your job search preferences and interests',
      href: '/onboarding',
      color: 'from-pink-600 to-pink-400'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">CareerCraft AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-white font-semibold">{user?.firstName}</p>
              <p className="text-blue-200 text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-8 md:p-12">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl">
                Your AI-powered job application assistant is ready to help you land your dream role.
                Let's get started by analyzing your resume, generating interview answers, or updating your profile.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={feature.href}>
                  <div className="group relative h-full rounded-2xl overflow-hidden cursor-pointer">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                    {/* Card content */}
                    <div className="relative h-full bg-white/10 backdrop-blur border border-white/20 p-6 flex flex-col justify-between group-hover:bg-white/5 transition-all duration-300 rounded-2xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-2xl transition-all">
                          {feature.title}
                        </h3>
                        <p className="text-blue-100 text-sm group-hover:text-white transition-colors">
                          {feature.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-blue-300 group-hover:text-blue-100 font-semibold">
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Resumes', value: '0', icon: FileText },
            { label: 'Applications', value: '0', icon: Target },
            { label: 'Interviews', value: '0', icon: MessageSquare },
            { label: 'Success Rate', value: '0%', icon: Sparkles }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-purple-500/20 p-8"
        >
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to land your dream job?</h3>
            <p className="text-purple-100 mb-6">
              Start by analyzing your resume against job descriptions or updating your profile to get better matches.
            </p>
            <Link href="/resume">
              <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all flex items-center gap-2">
                Analyze Your Resume <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}