'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AuthForm from '@/components/auth/AuthForm'

function LoginContent() {
  const params = useSearchParams()
  const error = params.get('error')

  return (
    <div
      className="rounded-[28px] p-7"
      style={{
        background:
          'linear-gradient(160deg, rgba(255,234,206,0.055) 0%, rgba(244,200,168,0.025) 60%, rgba(220,180,160,0.02) 100%)',
        border: '1px solid rgba(252,207,158,0.16)',
        backdropFilter: 'blur(20px) saturate(118%)',
        boxShadow:
          '0 30px 80px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,234,206,0.08)',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="ornament-rule" />
        <h2
          className="text-[13px]"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(248,226,198,0.75)',
            letterSpacing: '0.02em',
          }}
        >
          welcome back, gently
        </h2>
        <span className="ornament-rule" />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[12px] mb-4 p-3 rounded-2xl"
          style={{
            color: 'rgba(244,168,168,0.85)',
            background: 'rgba(244,88,88,0.08)',
            border: '1px solid rgba(244,168,168,0.18)',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
          }}
        >
          Couldn&apos;t sign you in. Take a breath and try again.
        </motion.p>
      )}

      <AuthForm mode="login" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Atmospheric warm background — candle on the horizon */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] rounded-full opacity-90"
          style={{
            background:
              'radial-gradient(ellipse, rgba(252,178,110,0.32) 0%, rgba(232,132,88,0.14) 30%, transparent 65%)',
            filter: 'blur(40px)',
            animation: 'orbPulse 16s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-20 -left-20 w-[480px] h-[480px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(244,168,168,0.22), transparent 70%)',
            filter: 'blur(70px)',
            animation: 'orbPulse 20s ease-in-out infinite 4s',
          }}
        />
        <div
          className="absolute top-40 -right-16 w-[360px] h-[360px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(196,144,200,0.18), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 w-full max-w-[380px] flex flex-col gap-9"
      >
        <div className="text-center flex flex-col items-center gap-4">
          {/* Soft candle/flame mark */}
          <motion.div
            animate={{ y: [0, -5, 0], scale: [1, 1.03, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-12 h-12 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 rounded-full opacity-80"
              style={{
                background: 'radial-gradient(circle, rgba(252,178,110,0.6), transparent 65%)',
                filter: 'blur(8px)',
              }}
            />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fde0b8" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c1.5 2 4 4 4 7a4 4 0 1 1-8 0c0-3 2.5-5 4-7z" />
            </svg>
          </motion.div>

          <div>
            <h1 className="text-wordmark text-[44px] leading-none">Lumina</h1>
            <p
              className="mt-2.5"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '13.5px',
                color: 'rgba(248,226,198,0.5)',
                letterSpacing: '0.01em',
              }}
            >
              your emotional sanctuary
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="rounded-[28px] h-40" style={{ background: 'rgba(255,234,206,0.04)' }} />}>
          <LoginContent />
        </Suspense>

        <p
          className="text-center text-[13px]"
          style={{ color: 'rgba(232,210,188,0.42)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300 }}
        >
          new here?{' '}
          <Link
            href="/auth/signup"
            className="transition-colors"
            style={{ color: '#fde0b8', borderBottom: '1px solid rgba(252,178,110,0.45)', paddingBottom: '1px' }}
          >
            create your sanctuary
          </Link>
        </p>

      </motion.div>
    </main>
  )
}
