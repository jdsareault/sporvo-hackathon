'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}