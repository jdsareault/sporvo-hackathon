import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import MessageThread from '@/models/MessageThread'
import Message from '@/models/Message'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const threads = await MessageThread.find({
            participants: session.user.id
        })
            .populate('participants', 'name userType')
            .sort('-updatedAt')

        // Get unread count for each thread
        const threadsWithMeta = await Promise.all(
            threads.map(async (thread) => {
                const unreadCount = await Message.countDocuments({
                    threadId: thread._id,
                    senderId: { $ne: session.user?.id },
                    read: false
                })

                const lastMessage = await Message.findOne({ threadId: thread._id })
                    .sort('-createdAt')
                    .select('content createdAt')

                return {
                    _id: thread._id,
                    participants: thread.participants,
                    lastMessage: lastMessage ? {
                        content: lastMessage.content,
                        timestamp: lastMessage.createdAt
                    } : null,
                    unreadCount
                }
            })
        )

        return NextResponse.json(threadsWithMeta)
    } catch (error) {
        console.error('Error fetching message threads:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { recipientId, message } = await request.json()

        await dbConnect()

        // Create or find thread
        let thread = await MessageThread.findOne({
            participants: { $all: [session.user.id, recipientId] }
        })

        if (!thread) {
            thread = await MessageThread.create({
                participants: [session.user.id, recipientId]
            })
        }

        // Create message
        await Message.create({
            threadId: thread._id,
            senderId: session.user.id,
            content: message
        })

        return NextResponse.json({ threadId: thread._id })
    } catch (error) {
        console.error('Error creating message thread:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 