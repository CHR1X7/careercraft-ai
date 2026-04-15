'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Briefcase, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/api'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<any>()

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await authService.login({
        email: data.email,
        password: data.password
      })
      toast.success('Welcome back!')
      router.push('/') // Redirect to home/dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-8">Sign in to continue your job search</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <button onClick={() => router.push('/signup')} className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  )
}