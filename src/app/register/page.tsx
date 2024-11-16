'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/app/components/layout/Layout'

interface FormData {
  state: string
  sports: string
  interests: string
  goals: string
  name: string
  email: string
  password: string
  userType: 'STUDENT' | 'MENTOR'
  school?: string
  grade?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    state: '',
    sports: '',
    interests: '',
    goals: '',
    name: '',
    email: '',
    password: '',
    userType: 'STUDENT'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Registration failed')
      }

      // Redirect to dashboard or login page after successful registration
      router.push('/auth/signin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Registration</h1>
        
        {/* User Type Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">I am registering as a:</h2>
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
              <div className="text-sm text-gray-600">Track your progress and connect with mentors</div>
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
              <div className="text-sm text-gray-600">Guide and support student athletes</div>
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
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">State</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Sports</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="e.g., Basketball, Soccer"
              value={formData.sports}
              onChange={(e) => setFormData({...formData, sports: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Interests</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="e.g., Training, Coaching"
              value={formData.interests}
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Goals</label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="What do you want to achieve?"
              value={formData.goals}
              onChange={(e) => setFormData({...formData, goals: e.target.value})}
              rows={3}
              required
            />
          </div>

          {formData.userType === 'STUDENT' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">School</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Grade</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md 
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </Layout>
  )
}