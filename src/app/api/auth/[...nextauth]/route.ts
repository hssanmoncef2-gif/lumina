// ============================================================
// LUMINA — NextAuth config
// Credentials provider (email + bcrypt password) + MongoDB
// ============================================================

import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb/client'
import { User } from '@/lib/models/User'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/login',
    error:  '/auth/login',
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()

        const user = await User.findOne({ email: credentials.email.toLowerCase() })
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id:          user._id.toString(),
          email:       user.email,
          name:        user.displayName || user.email.split('@')[0],
          displayName: user.displayName,
        }
      },
    }),
  ],

  callbacks: {
    // Persist user id + displayName into the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id          = user.id
        token.displayName = (user as any).displayName ?? user.name
      }
      return token
    },

    // Expose id + displayName on the session object
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id          = token.id as string
        ;(session.user as any).displayName = token.displayName as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
