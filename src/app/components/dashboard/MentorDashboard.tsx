'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Student {
  _id: string
  name: string
  grade: string
  totalPoints: number
  hasMentor: boolean
}

export default function MentorDashboard() {
  const { data: session, status } = useSession()
  const [students, setStudents] = useState<Student[]>([])
  const [unmentoredStudents, setUnmentoredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || session?.user?.userType !== 'MENTOR') {
        console.error('User not authenticated or not a mentor')
        setLoading(false)
        return
      }

      try {
        const [studentsRes, unmentoredRes] = await Promise.all([
          fetch('/api/mentor/students'),
          fetch('/api/mentor/unmentored-students')
        ])

        if (!studentsRes.ok || !unmentoredRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const studentsData = await studentsRes.json()
        const unmentoredData = await unmentoredRes.json()

        setStudents(studentsData)
        setUnmentoredStudents(unmentoredData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setStudents([])
        setUnmentoredStudents([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status, session])

  const handleMentorStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/mentor/assign-student/${studentId}`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to assign student')
      }

      // Update both lists
      setUnmentoredStudents(prev => prev.filter(s => s._id !== studentId))
      const updatedStudent = await response.json()
      setStudents(prev => [...prev, updatedStudent])
    } catch (error) {
      console.error('Error assigning student:', error)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated' || session?.user?.userType !== 'MENTOR') {
    return <div>Access denied. Please log in as a mentor.</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Your Students section */}
        <div className="col-span-3 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Students</h2>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.grade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.totalPoints}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/students/${student._id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/students/${student._id}/scores`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Add Scores
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              href="/scores/batch"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Batch Score Entry
            </Link>
            <Link
              href="/reports"
              className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
            >
              View Reports
            </Link>
            <Link
              href="/messages"
              className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
            >
              Messages
            </Link>
          </div>
        </div>

        {/* Students Needing Mentors - Now full width below other sections */}
        <div className="col-span-4 bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">Students Needing Mentors</h2>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : unmentoredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unmentoredStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.grade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.totalPoints}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleMentorStudent(student._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Mentor Student
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No students currently need mentoring</p>
          )}
        </div>
      </div>
    </div>
  )
} 