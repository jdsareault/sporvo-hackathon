'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/sporvo.png"
                alt="Sporvo Logo"
                width={165}
                height={60}
              />
      
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/leaderboard" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                Leaderboard
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="hover:bg-blue-700 px-3 py-2 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                    Login
                  </Link>
                  <Link href="/register" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 