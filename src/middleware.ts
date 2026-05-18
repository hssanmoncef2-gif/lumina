// ============================================================
// LUMINA — Middleware (NextAuth)
// Replaces Supabase session check with NextAuth JWT check
// ============================================================

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const PROTECTED = ['/journal', '/letters', '/companion', '/profile', '/quiz', '/comfort', '/music']

export default withAuth(
  function middleware(req) {
    const path  = req.nextUrl.pathname
    const token = req.nextauth.token

    // Already authed → redirect away from login/signup
    if (token && (path.startsWith('/auth/login') || path.startsWith('/auth/signup'))) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Return true = allow. Return false = redirect to signIn page.
      authorized({ token, req }) {
        const path = req.nextUrl.pathname
        const isProtected = PROTECTED.some((p) => path.startsWith(p))
        if (isProtected && !token) return false
        return true
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
