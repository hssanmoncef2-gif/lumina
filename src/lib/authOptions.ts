// src/lib/authOptions.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/lib/mongodb/client'
import { User } from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()
        const user = await User.findOne({ email: credentials.email })
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id:             user._id.toString(),
          email:          user.email,
          name:           user.displayName ?? '',
          sessionVersion: user.sessionVersion ?? 0,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   60 * 60 * 24 * 7, // 7 days — token expires even if user never logs out
  },

  callbacks: {
    // Embed sessionVersion into the JWT when the user first signs in
    async jwt({ token, user }) {
      if (user) {
        token.id             = user.id
        token.sessionVersion = (user as any).sessionVersion ?? 0
      }
      return token
    },

    // On every request, verify the JWT's sessionVersion still matches the DB.
    // If the user logged out (which bumps sessionVersion), the old token is rejected.
    async session({ session, token }) {
      if (!token?.id) return { ...session, user: undefined } as any

      try {
        await connectDB()
        const dbUser = await User.findById(token.id).select('sessionVersion').lean()

        if (!dbUser || (dbUser as any).sessionVersion !== token.sessionVersion) {
          // Session is stale — return empty session so NextAuth treats user as logged out
          return { ...session, user: undefined } as any
        }
      } catch {
        return { ...session, user: undefined } as any
      }

      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    },
  },

  pages:  { signIn: '/auth/login' },
  secret: process.env.NEXTAUTH_SECRET,
}
