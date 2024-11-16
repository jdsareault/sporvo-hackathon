import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        console.log('Session:', session)
        console.log('User type:', session?.user?.userType)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        if (session.user.userType !== 'MENTOR') {
            return NextResponse.json({ error: 'Not authorized - Mentor access only' }, { status: 401 })
        }

        await dbConnect()

        const students = await User.find({ userType: 'STUDENT' })
            .select('name grade totalPoints')
            .sort('name')

        return NextResponse.json(students)
    } catch (error) {
        console.error('Error fetching students:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
