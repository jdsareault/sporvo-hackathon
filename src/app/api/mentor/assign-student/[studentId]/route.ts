import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function POST(
    request: Request,
    { params }: { params: { studentId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        if (session.user.userType !== 'MENTOR') {
            return NextResponse.json({ error: 'Not authorized - Mentor access only' }, { status: 401 })
        }

        await dbConnect()

        const updatedStudent = await User.findByIdAndUpdate(
            params.studentId,
            { mentor: session.user.id },
            { new: true }
        ).select('name grade totalPoints')

        if (!updatedStudent) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 })
        }

        return NextResponse.json(updatedStudent)
    } catch (error) {
        console.error('Error assigning student:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 