'use client'

import Layout from '@/app/components/layout/Layout'
import MessagesList from '../components/messages/MessagesList'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MessagesPage() {
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

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold mb-6">Messages</h1>
                <MessagesList />
            </div>
        </Layout>
    )
} 