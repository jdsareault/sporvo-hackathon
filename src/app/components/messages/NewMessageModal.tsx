'use client'

import { useState, useEffect } from 'react'

interface User {
    _id: string
    name: string
    userType: 'STUDENT' | 'MENTOR'
}

interface NewMessageModalProps {
    isOpen: boolean
    onClose: () => void
    onThreadCreated: (threadId: string) => void
}

export default function NewMessageModal({
    isOpen,
    onClose,
    onThreadCreated
}: NewMessageModalProps) {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users')
                const data = await response.json()
                setUsers(data)
            } catch (error) {
                console.error('Error fetching users:', error)
            } finally {
                setLoading(false)
            }
        }

        if (isOpen) {
            fetchUsers()
        }
    }, [isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUser || !message.trim()) return

        try {
            const response = await fetch('/api/messages/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientId: selectedUser,
                    message: message,
                }),
            })

            if (response.ok) {
                const { threadId } = await response.json()
                onThreadCreated(threadId)
            }
        } catch (error) {
            console.error('Error creating message thread:', error)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">New Message</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            To:
                        </label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        >
                            <option value="">Select a recipient</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.userType})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message:
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 h-32"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 