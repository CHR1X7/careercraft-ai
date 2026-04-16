'use client'

import { useRouter } from 'next/navigation'
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  FileText, 
  Target, 
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle,
  Star
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { isSignedIn } = useAuth()

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'AI Resume Builder',
      description: 'Create professional, ATS-optimized resumes with AI assistance. Like FlowCV but smarter.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Smart Job Matching',
      description: 'Get matched with jobs that fit your skills and preferences perfectly.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Tailored Applications',
      description: 'Generate personalized cover letters and application answers instantly.',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Resume Scoring',
      description: 'Get detailed feedback on how well you match any job description.',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Application Tracker',
      description: 'Manage all your applications in one organized dashboard.',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'AI Career Coach',
      description: 'Chat with an AI that helps you prepare for interviews and grow your career.',
      color: 'bg-teal-50 text-teal-600'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Jobs Analyzed' },
    { value: '95%', label: 'Match Accuracy' },
    { value: '3x', label: 'More Interviews' },
    { value: 'Free', label: 'To Get Started' },
  ]

  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Software Engineer',
      text: 'Got 3 interviews in my first week using CareerCraft AI. The resume scorer is incredible!',
      rating: 5
    },
    {
      name: 'Marcus T.',
      role: 'Product Manager',
      text: 'The AI-generated cover letters sound genuinely human. I landed my dream job!',
      rating: 5
    },
    {
      name: 'Priya M.',
      role: 'Data Scientist',
      text: 'The job matching feature saved me hours of searching. Highly recommend!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerCraft AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-600 transition-colors">
              Features
            </button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-600 transition-colors">
              How it Works
            </button>
            <button onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-600 transition-colors">
              Reviews
            </button>
          </div>

          <div className="flex gap-3 items-center">
            {isSignedIn ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                >
                  Dashboard
                </button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-gray-700 font-semibold hover:text-blue-600 transition-colors text-sm">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                    Get Started Free
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 text-sm font-semibold">
              <Zap className="w-4 h-4" />
              Powered by Advanced AI (Groq + Mixtral)
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Land Your Dream Job with
              <span className="text-blue-600"> AI-Powered </span>
              Precision
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              CareerCraft AI streamlines your job search with intelligent resume optimization, 
              personalized applications, and real-time job matching powered by advanced AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      Start Your Journey <ArrowRight className="w-5 h-5" />
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-md border border-gray-200 flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" /> Sign In Securely
                    </button>
                  </SignInButton>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Google & GitHub login
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% Free to start
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All the tools you need to find, apply, and land your perfect job — in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${feature.color} group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Get started in minutes and land more interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Create Your Profile',
                description: 'Sign up with Google or GitHub. Tell us about your skills, experience, and dream job.',
                icon: <Users className="w-8 h-8" />
              },
              {
                step: '2',
                title: 'Paste a Job URL',
                description: 'Our AI scrapes the job posting and analyzes exactly what the employer wants.',
                icon: <Search className="w-8 h-8" />
              },
              {
                step: '3',
                title: 'Get AI Insights',
                description: 'Receive a match score, missing skills, and AI-generated tailored content.',
                icon: <Sparkles className="w-8 h-8" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              People Love CareerCraft AI
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{t.text}"</p>
                <div className="font-bold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who've found their dream jobs with CareerCraft AI.
              It's completely free to get started!
            </p>
            {isSignedIn ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
              >
                Go to Dashboard →
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl">
                  Get Started Free →
                </button>
              </SignUpButton>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CareerCraft AI</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                The AI-powered job search platform that helps you land your dream job faster.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-200">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Resume Builder</li>
                <li className="hover:text-white cursor-pointer">Job Matching</li>
                <li className="hover:text-white cursor-pointer">AI Coach</li>
                <li className="hover:text-white cursor-pointer">Application Tracker</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-200">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">About</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © 2024 CareerCraft AI. All rights reserved. Built with ❤️ using Next.js, Clerk & Groq AI.
          </div>
        </div>
      </footer>
    </div>
  )
}

// Search icon
function Search(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}