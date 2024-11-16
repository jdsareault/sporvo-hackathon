import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Message from '@/models/Message'
import MessageThread from '@/models/MessageThread'

export async function GET(
    request: Request,
    { params }: { params: { threadId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        // Verify user is part of thread
        const thread = await MessageThread.findOne({
            _id: params.threadId,
            participants: session.user.id
        })

        if (!thread) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
        }

        const messages = await Message.find({ threadId: params.threadId })
            .sort('createdAt')
            .select('senderId content createdAt')

        return NextResponse.json(messages)
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(
    request: Request,
    { params }: { params: { threadId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { content } = await request.json()

        await dbConnect()

        // Verify user is part of thread
        const thread = await MessageThread.findOne({
            _id: params.threadId,
            participants: session.user.id
        })

        if (!thread) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
        }

        const message = await Message.create({
            threadId: params.threadId,
            senderId: session.user.id,
            content
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error('Error sending message:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 