import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { hash } from 'bcryptjs'
import mongoose from 'mongoose'

export async function POST(request: Request) {
    try {
        const { name, email, password, userType, school, grade } = await request.json()

        await dbConnect()

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hash(password, 12)

        // Generate unique ID
        const uniqueId = new mongoose.Types.ObjectId().toString()

        // Create user
        const user = await User.create({
            id: uniqueId,
            name,
            email,
            password: hashedPassword,
            userType,
            school,
            grade
        })

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Error creating user' },
            { status: 500 }
        )
    }
}
