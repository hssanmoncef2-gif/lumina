'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AuthForm from '@/components/auth/AuthForm'

export default function LoginPage() {
  const params = useSearchParams()
  const error = params.get('error')

  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden bg-lumina-void px-6">

      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Large purple orb */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'orbPulse 12s ease-in-out infinite',
          }}
        />
        {/* Pink orb */}
        <div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-[0.09]"
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Blue orb */}
        <div
          className="absolute top-1/2 left-0 w-64 h-64 rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-[360px] flex flex-col gap-8"
      >

        {/* Logo / Wordmark */}
        <div className="text-center flex flex-col items-center gap-3">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-4xl"
          >
            🌙
          </motion.div>
          <div>
            <h1 className="text-3xl font-semibold text-dreamy tracking-tight">Lumina</h1>
            <p className="text-white/35 text-sm font-light mt-1">Your emotional sanctuary</p>
          </div>
        </div>

        {/* Auth card */}
        <div
          className="glass rounded-3xl p-6"
          style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.07)' }}
        >
          <h2 className="text-white/80 font-medium text-base mb-5">Welcome back</h2>

          {/* Callback error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400/70 text-xs mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/15"
            >
              Couldn&apos;t sign you in. Please try again.
            </motion.p>
          )}

          <AuthForm mode="login" />
        </div>

        {/* Switch to signup */}
        <p className="text-center text-white/30 text-sm">
          New here?{' '}
          <Link href="/auth/signup" className="text-lumina-purple-dream hover:text-lumina-purple-soft transition-colors">
            Create your sanctuary
          </Link>
        </p>

      </motion.div>
    </main>
  )
}
