import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { compare } from 'bcryptjs'
import { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    userType: 'STUDENT' | 'MENTOR'
  }
}

const handler = NextAuth({
  providers: [

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password')
        }

        await dbConnect()

        // Find user by email
        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('No user found with this email')
        }

        // Verify password
        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        // Return user data
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userType = token.userType as 'STUDENT' | 'MENTOR'
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  }
})

export { handler as GET, handler as POST }

export const authOptions = {
  providers: [
    // your providers configuration
  ],
  // other NextAuth.js options
} 