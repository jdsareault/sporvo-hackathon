'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Score {
  subject: string
  score: number
}

interface AthleticScore {
  sport: string
  points: number
}

interface StudentStats {
  academicScores: Score[]
  athleticScores: AthleticScore[]
  totalPoints: number
  rank: number
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch student stats and posts
    const fetchData = async () => {
      try {
        const [statsRes, postsRes] = await Promise.all([
          fetch('/api/student/stats'),
          fetch('/api/student/posts')
        ])
        
        const statsData = await statsRes.json()
        const postsData = await postsRes.json()
        
        setStats(statsData)
        setPosts(postsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Overview */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Performance</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Total Points</h3>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalPoints}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Current Rank</h3>
              <p className="text-3xl font-bold text-green-600">#{stats?.rank}</p>
            </div>
          </div>

          {/* Academic Scores */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Academic Scores</h3>
            <div className="space-y-2">
              {stats?.academicScores.map((score, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{score.subject}</span>
                  <span className="font-semibold">{score.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Athletic Scores */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Athletic Points</h3>
            <div className="space-y-2">
              {stats?.athleticScores.map((score, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{score.sport}</span>
                  <span className="font-semibold">{score.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              href="/posts/new" 
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Create New Post
            </Link>
            <Link 
              href="/profile" 
              className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
            >
              Update Profile
            </Link>
            <Link 
              href="/messages" 
              className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
            >
              Messages
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{post.content.substring(0, 100)}...</p>
              <Link 
                href={`/posts/${post._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 