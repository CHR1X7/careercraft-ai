'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Briefcase, 
  FileText, 
  Target, 
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'AI Resume Builder',
      description: 'Create professional, ATS-optimized resumes with AI assistance'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Smart Job Matching',
      description: 'Get matched with jobs that fit your skills and preferences'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Tailored Applications',
      description: 'Generate personalized cover letters and answers instantly'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Resume Scoring',
      description: 'Get detailed feedback on how well you match job descriptions'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Application Tracker',
      description: 'Manage all your applications in one organized dashboard'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'AI Career Coach',
      description: 'Get personalized career advice and guidance'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">CareerCraft AI</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/login')}
              className="btn-secondary"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/signup')}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Land Your Dream Job with
              <span className="text-primary-600"> AI-Powered</span> Precision
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              CareerCraft AI streamlines your job search with intelligent resume optimization, 
              personalized applications, and real-time job matching powered by advanced AI.
            </p>
            <button 
              onClick={() => router.push('/signup')}
              className="btn-primary text-lg inline-flex items-center gap-2"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who've found their dream jobs with CareerCraft AI
          </p>
          <button 
            onClick={() => router.push('/signup')}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold">CareerCraft AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 CareerCraft AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}