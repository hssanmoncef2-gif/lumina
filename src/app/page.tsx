'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Root page: session-aware redirect.
// - Authenticated  → /home
// - Unauthenticated → /auth/login
export default function RootPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return
    if (session?.user) {
      window.location.replace('/home')
    } else {
      window.location.replace('/auth/login')
    }
  }, [session, status])

  return null
}
