'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import MessageThread from './MessageThread'
import NewMessageModal from './NewMessageModal'

interface Thread {
    _id: string
    participants: {
        _id: string
        name: string
        userType: 'STUDENT' | 'MENTOR'
    }[]
    lastMessage: {
        content: string
        timestamp: string
    }
    unreadCount: number
}

export default function MessagesList() {
    const { data: session, status } = useSession()
    const [threads, setThreads] = useState<Thread[]>([])
    const [selectedThread, setSelectedThread] = useState<string | null>(null)
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchThreads = async () => {
            console.log('Session status:', status)
            console.log('Session data:', session)

            try {
                if (status !== 'authenticated' || !session?.user?.id) {
                    console.log('Session not ready:', { status, session })
                    return
                }

                const response = await fetch('/api/messages/threads', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                console.log('API Response:', response.status)

                if (!response.ok) {
                    const errorData = await response.json()
                    console.error('API Error Details:', errorData)
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                console.log('Threads data:', data)

                if (!Array.isArray(data)) {
                    throw new Error('Expected array of threads')
                }
                setThreads(data)
            } catch (error) {
                console.error('Error fetching message threads:', error)
                setThreads([])
            } finally {
                setLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchThreads()
        }
    }, [session, status])

    return (
        <div className="flex h-[calc(100vh-200px)]">
            {/* Threads List */}
            <div className="w-1/3 border-r">
                <div className="p-4 border-b">
                    <button
                        onClick={() => setIsNewMessageModalOpen(true)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        New Message
                    </button>
                </div>

                {loading ? (
                    <div className="p-4">Loading...</div>
                ) : (
                    <div className="overflow-y-auto">
                        {threads.map((thread) => (
                            <div
                                key={thread._id}
                                onClick={() => setSelectedThread(thread._id)}
                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedThread === thread._id ? 'bg-gray-100' : ''
                                    }`}
                            >
                                <div className="font-medium">
                                    {thread.participants
                                        .filter((p) => p._id !== session?.user?.id)
                                        .map((p) => p.name)
                                        .join(', ')}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                    {thread.lastMessage.content}
                                </div>
                                {thread.unreadCount > 0 && (
                                    <div className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 inline-block">
                                        {thread.unreadCount}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Thread */}
            <div className="w-2/3">
                {selectedThread ? (
                    <MessageThread threadId={selectedThread} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        Select a conversation or start a new one
                    </div>
                )}
            </div>

            {/* New Message Modal */}
            <NewMessageModal
                isOpen={isNewMessageModalOpen}
                onClose={() => setIsNewMessageModalOpen(false)}
                onThreadCreated={(threadId) => {
                    setSelectedThread(threadId)
                    setIsNewMessageModalOpen(false)
                }}
            />
        </div>
    )
} 