'use client'

import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Briefcase, ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">CareerCraft AI</span>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Dashboard
                </button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Land Your Dream Job with <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Professional resume scoring, AI-generated cover letters, and smart job matching — all in one place.
        </p>

        {isSignedIn ? (
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-3"
          >
            Go to Dashboard <ArrowRight />
          </button>
        ) : (
          <SignUpButton mode="modal">
            <button className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-3">
              Start Free with Google or Email <Sparkles />
            </button>
          </SignUpButton>
        )}
      </main>
    </div>
  )
}