'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

interface Message {
    _id: string
    senderId: string
    content: string
    timestamp: string
}

interface MessageThreadProps {
    threadId: string
}

export default function MessageThread({ threadId }: MessageThreadProps) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/messages/threads/${threadId}`)
                const data = await response.json()
                setMessages(data)
                scrollToBottom()
            } catch (error) {
                console.error('Error fetching messages:', error)
            }
        }

        fetchMessages()

        // Set up real-time updates here if needed
    }, [threadId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        try {
            const response = await fetch(`/api/messages/threads/${threadId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newMessage }),
            })

            if (response.ok) {
                const message = await response.json()
                setMessages([...messages, message])
                setNewMessage('')
                scrollToBottom()
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    return (
        <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`mb-4 flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.senderId === session?.user?.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100'
                                }`}
                        >
                            <div className="text-sm">{message.content}</div>
                            <div className="text-xs mt-1 opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
} 