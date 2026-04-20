'use client'

import { useRouter } from 'next/navigation'
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import {
  Briefcase,
  ArrowRight,
  FileText,
  Target,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { isSignedIn } = useAuth()

  const features = [
    { icon: FileText, title: 'AI Resume Builder', desc: 'Create professional, ATS-optimized resumes' },
    { icon: Target, title: 'Smart Job Matching', desc: 'Get matched with perfect jobs' },
    { icon: Sparkles, title: 'Tailored Applications', desc: 'Generate personalized cover letters' },
    { icon: TrendingUp, title: 'Resume Scoring', desc: 'Get detailed match feedback' },
    { icon: Briefcase, title: 'Application Tracker', desc: 'Manage all applications' },
    { icon: Users, title: 'AI Career Coach', desc: 'Get personalized career advice' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">CareerCraft AI</span>
          </div>
          <div className="flex gap-4 items-center">
            {isSignedIn ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Dashboard
                </button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Land Your Dream Job with
            <span className="text-blue-600"> AI-Powered</span> Precision
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            CareerCraft AI streamlines your job search with intelligent resume optimization,
            personalized applications, and real-time job matching powered by advanced AI.
          </p>
          {isSignedIn ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 inline-flex items-center gap-2">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          )}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              100% Free
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Everything You Need to Succeed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                  <Icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Job Search?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who've found their dream jobs with CareerCraft AI
          </p>
          {isSignedIn ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100"
            >
              Go to Dashboard
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100">
                Get Started Free
              </button>
            </SignUpButton>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold">CareerCraft AI</span>
          </div>
          <p className="text-gray-400">© 2026 CareerCraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}