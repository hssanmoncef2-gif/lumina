// ============================================================
// LUMINA — Middleware: ALL routes require auth except auth pages
// ============================================================

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const path  = req.nextUrl.pathname
    const token = req.nextauth.token

    // Already authed → redirect away from auth pages
    if (token && (path.startsWith('/auth/login') || path.startsWith('/auth/signup'))) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const path = req.nextUrl.pathname
        // Public: only auth pages and static assets
        const isPublic =
          path.startsWith('/auth/') ||
          path.startsWith('/_next/') ||
          path.startsWith('/api/auth/') ||
          path === '/favicon.ico'
        if (!isPublic && !token) return false
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
