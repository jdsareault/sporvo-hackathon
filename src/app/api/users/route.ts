import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        console.log('Session:', session)

        if (!session?.user?.id) {
            console.log('No session or user ID found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const users = await User.find({
            _id: { $ne: session.user.id }
        })
            .select('name userType')
            .sort('name')
            .lean()

        console.log('Found users:', users)

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error in users API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 