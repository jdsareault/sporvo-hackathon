'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Layout from '@/app/components/layout/Layout'

interface LoginData {
  email: string
  password: string
  userType: 'STUDENT' | 'MENTOR'
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    userType: 'STUDENT'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-black">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {/* User Type Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">I am logging in as a:</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'STUDENT' })}
              className={`p-4 text-center rounded-lg border-2 transition-all
                ${formData.userType === 'STUDENT'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="font-semibold mb-1">Student</div>
              <div className="text-sm text-gray-600">Access your student dashboard</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'MENTOR' })}
              className={`p-4 text-center rounded-lg border-2 transition-all
                ${formData.userType === 'MENTOR'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="font-semibold mb-1">Mentor</div>
              <div className="text-sm text-gray-600">Access your mentor dashboard</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md 
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </Layout>
  )
} 