'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import StudentDashboard from '../components/dashboard/StudentDashboard'
import MentorDashboard from '../components/dashboard/MentorDashboard'
import Layout from '../components/layout/Layout'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <Layout>
                <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                    Loading...
                </div>
            </Layout>
        )
    }

    // Reference to existing components:
    // StudentDashboard component:
    // ```typescript:src/app/components/dashboard/StudentDashboard.tsx
    // startLine: 23
    // endLine: 147
    // ```

    // MentorDashboard component:
    // ```typescript:src/app/components/dashboard/MentorDashboard.tsx
    // startLine: 13
    // endLine: 130
    // ```

    return (
        <Layout>
            {session?.user?.userType === 'STUDENT' ? (
                <StudentDashboard />
            ) : session?.user?.userType === 'MENTOR' ? (
                <MentorDashboard />
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Invalid user type. Please contact support if you believe this is an error.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
} 